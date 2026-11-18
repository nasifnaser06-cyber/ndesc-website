package org.ndesc.nessxpay;

import android.Manifest;
import android.app.Activity;
import android.content.ClipData;
import android.content.ClipboardManager;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.graphics.Color;
import android.graphics.Typeface;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.os.Handler;
import android.os.Looper;
import android.os.PowerManager;
import android.provider.Settings;
import android.text.InputType;
import android.util.TypedValue;
import android.view.Gravity;
import android.view.View;
import android.widget.Button;
import android.widget.EditText;
import android.widget.LinearLayout;
import android.widget.ScrollView;
import android.widget.Switch;
import android.widget.TextView;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Locale;

/** The only screen: set up, see that it is on, and see every payment SMS and what happened to it. */
public class MainActivity extends Activity {
    private static final int GREEN = Color.rgb(46, 160, 67), AMBER = Color.rgb(214, 140, 20), RED = Color.rgb(207, 34, 46);

    private Store store;
    private TextView status, checkResult;
    private EditText url, key;
    private Switch onOff;
    private Button allowSms, allowNotes, allowBattery, resend;
    private LinearLayout list;
    private final Handler handler = new Handler(Looper.getMainLooper());
    private final Runnable tick = new Runnable() {
        @Override public void run() { refresh(); handler.postDelayed(this, 3000); }
    };
    private final SimpleDateFormat when = new SimpleDateFormat("d MMM, h:mm a", Locale.ENGLISH);

    @Override
    protected void onCreate(Bundle b) {
        super.onCreate(b);
        store = new Store(this);

        LinearLayout col = new LinearLayout(this);
        col.setOrientation(LinearLayout.VERTICAL);
        int pad = dp(20);
        col.setPadding(pad, pad, pad, pad);

        col.addView(text("NESSX Payments", 26, true));
        col.addView(text("Sends bKash payment SMS on this phone to the NESSX registration sheet. Nothing else leaves the phone.", 14, false));

        status = text("", 18, true);
        status.setPadding(0, dp(16), 0, dp(4));
        col.addView(status);
        checkResult = text("", 14, false);
        col.addView(checkResult);

        onOff = new Switch(this);
        onOff.setText("Send payment SMS to the sheet");
        onOff.setTextSize(TypedValue.COMPLEX_UNIT_SP, 16);
        onOff.setPadding(0, dp(12), 0, dp(12));
        onOff.setOnCheckedChangeListener((v, on) -> { store.setEnabled(on); refresh(); });
        col.addView(onOff);

        allowSms = button("Allow reading SMS", v -> requestPermissions(new String[]{Manifest.permission.RECEIVE_SMS}, 1));
        col.addView(allowSms);
        allowNotes = button("Allow notifications", v -> {
            if (Build.VERSION.SDK_INT >= 33) requestPermissions(new String[]{Manifest.permission.POST_NOTIFICATIONS}, 2);
        });
        col.addView(allowNotes);
        allowBattery = button("Allow running in the background", v -> {
            try {
                startActivity(new Intent(Settings.ACTION_REQUEST_IGNORE_BATTERY_OPTIMIZATIONS, Uri.parse("package:" + getPackageName())));
            } catch (Exception e) {
                startActivity(new Intent(Settings.ACTION_IGNORE_BATTERY_OPTIMIZATION_SETTINGS));
            }
        });
        col.addView(allowBattery);

        col.addView(heading("Setup"));
        col.addView(text("Web app link (ends in /exec)", 14, false));
        url = field(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_URI);
        url.setText(store.url());
        col.addView(row(url, button("Paste", v -> paste(url))));
        col.addView(text("SMS key (Settings tab of the sheet)", 14, false));
        key = field(InputType.TYPE_CLASS_TEXT | InputType.TYPE_TEXT_VARIATION_VISIBLE_PASSWORD);
        key.setText(store.key());
        col.addView(row(key, button("Paste", v -> paste(key))));
        col.addView(button("Save and check", v -> saveAndCheck()));

        col.addView(heading("Recent payment SMS"));
        resend = button("Send the failed ones again", v -> resendFailed());
        col.addView(resend);
        list = new LinearLayout(this);
        list.setOrientation(LinearLayout.VERTICAL);
        col.addView(list);

        ScrollView sv = new ScrollView(this);
        sv.addView(col);
        setContentView(sv);

        if (!hasSms()) requestPermissions(new String[]{Manifest.permission.RECEIVE_SMS}, 1);
    }

    @Override protected void onResume() { super.onResume(); handler.post(tick); }
    @Override protected void onPause() { super.onPause(); handler.removeCallbacks(tick); }
    @Override public void onRequestPermissionsResult(int c, String[] p, int[] r) { refresh(); }

    private void saveAndCheck() {
        String u = url.getText().toString().trim(), k = key.getText().toString().trim();
        store.save(u, k);
        checkResult.setText("Checking…");
        new Thread(() -> {
            Sender.Result r = Sender.check(u, k);
            String msg = (r.ok ? "✓ " : "✗ ") + r.message + "  (" + when.format(new Date()) + ")";
            store.setLastCheck(msg);
            runOnUiThread(this::refresh);
        }).start();
    }

    private void resendFailed() {
        int n = 0;
        for (JSONObject o : store.withStatus(Store.FAILED)) {
            long id = o.optLong("id");
            store.update(id, Store.WAITING, "Sending again");
            ForwardWorker.enqueue(this, id, o.optString("from"), o.optString("text"));
            n++;
        }
        checkResult.setText(n == 0 ? "Nothing failed." : "Sending " + n + " again.");
        refresh();
    }

    private void refresh() {
        boolean sms = hasSms();
        allowSms.setVisibility(sms ? View.GONE : View.VISIBLE);
        allowNotes.setVisibility(Build.VERSION.SDK_INT >= 33
                && checkSelfPermission(Manifest.permission.POST_NOTIFICATIONS) != PackageManager.PERMISSION_GRANTED ? View.VISIBLE : View.GONE);
        PowerManager pm = getSystemService(PowerManager.class);
        allowBattery.setVisibility(pm != null && pm.isIgnoringBatteryOptimizations(getPackageName()) ? View.GONE : View.VISIBLE);
        if (onOff.isChecked() != store.enabled()) onOff.setChecked(store.enabled());

        if (!store.configured()) setStatus("Not set up: paste the link and the key below", AMBER);
        else if (!sms) setStatus("Off: this app can't read SMS yet", RED);
        else if (!store.enabled()) setStatus("Off: switched off", AMBER);
        else setStatus("On: payment SMS go to the sheet", GREEN);
        if (!checkResult.getText().toString().startsWith("Checking")) checkResult.setText(store.lastCheck());

        resend.setVisibility(store.withStatus(Store.FAILED).isEmpty() ? View.GONE : View.VISIBLE);
        list.removeAllViews();
        JSONArray items = store.items();
        if (items.length() == 0) list.addView(text("None yet. They appear here as bKash payment SMS arrive.", 14, false));
        for (int i = 0; i < items.length(); i++) {
            JSONObject o = items.optJSONObject(i);
            if (o == null) continue;
            String st = o.optString("status");
            String mark = Store.SENT.equals(st) ? "✓ Sent" : Store.FAILED.equals(st) ? "✗ Not sent" : "… Waiting";
            int colr = Store.SENT.equals(st) ? GREEN : Store.FAILED.equals(st) ? RED : AMBER;
            String amount = o.optString("amount");
            TextView head = text((amount.isEmpty() ? "" : "Tk " + amount + "   ") + o.optString("trx"), 16, true);
            head.setPadding(0, dp(12), 0, 0);
            list.addView(head);
            TextView line = text(mark + "  ·  " + when.format(new Date(o.optLong("id"))) + "\n" + o.optString("msg"), 14, false);
            line.setTextColor(colr);
            list.addView(line);
        }
    }

    private boolean hasSms() { return checkSelfPermission(Manifest.permission.RECEIVE_SMS) == PackageManager.PERMISSION_GRANTED; }

    private void setStatus(String s, int color) { status.setText(s); status.setTextColor(color); }

    private void paste(EditText target) {
        ClipboardManager cm = getSystemService(ClipboardManager.class);
        ClipData clip = cm == null ? null : cm.getPrimaryClip();
        if (clip != null && clip.getItemCount() > 0 && clip.getItemAt(0).getText() != null) {
            target.setText(clip.getItemAt(0).getText().toString().trim());
        }
    }

    private TextView text(String s, int sp, boolean bold) {
        TextView t = new TextView(this);
        t.setText(s);
        t.setTextSize(TypedValue.COMPLEX_UNIT_SP, sp);
        if (bold) t.setTypeface(Typeface.DEFAULT_BOLD);
        t.setPadding(0, dp(4), 0, dp(4));
        return t;
    }

    private TextView heading(String s) {
        TextView t = text(s, 20, true);
        t.setPadding(0, dp(24), 0, dp(4));
        return t;
    }

    private Button button(String s, View.OnClickListener l) {
        Button b = new Button(this);
        b.setText(s);
        b.setAllCaps(false);
        b.setOnClickListener(l);
        return b;
    }

    private EditText field(int type) {
        EditText e = new EditText(this);
        e.setInputType(type);
        e.setSingleLine(true);
        return e;
    }

    private LinearLayout row(View main, View side) {
        LinearLayout r = new LinearLayout(this);
        r.setOrientation(LinearLayout.HORIZONTAL);
        r.setGravity(Gravity.CENTER_VERTICAL);
        r.addView(main, new LinearLayout.LayoutParams(0, LinearLayout.LayoutParams.WRAP_CONTENT, 1f));
        r.addView(side);
        return r;
    }

    private int dp(int v) { return Math.round(v * getResources().getDisplayMetrics().density); }
}
