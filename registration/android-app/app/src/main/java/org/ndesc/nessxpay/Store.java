package org.ndesc.nessxpay;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/** Settings and the list of recent payment SMS, kept on the phone only. */
public final class Store {
    public static final String WAITING = "waiting", SENT = "sent", FAILED = "failed";
    private static final int KEEP = 100, KEEP_SEEN = 2000;
    /** One lock for every Store object: the SMS receiver, the inbox check and the screen can run at once. */
    private static final Object LOCK = new Object();
    private final SharedPreferences p;

    public Store(Context c) {
        p = c.getApplicationContext().getSharedPreferences("nessx", Context.MODE_PRIVATE);
    }

    public String url() { return p.getString("url", ""); }
    public String key() { return p.getString("key", ""); }
    public boolean enabled() { return p.getBoolean("enabled", true); }
    public boolean configured() { return !url().isEmpty() && !key().isEmpty(); }

    public void save(String url, String key) {
        p.edit().putString("url", url.trim()).putString("key", key.trim()).apply();
        since(); // fixes the start of the inbox check the first time the app is set up
    }

    public void setEnabled(boolean on) { p.edit().putBoolean("enabled", on).apply(); }

    /**
     * The inbox check only looks at SMS from this moment on: when the app was first set up
     * (or, after an update from 1.0/1.1, the oldest payment it already knew). Older bKash
     * messages on the phone are never sent.
     */
    public long since() {
        synchronized (LOCK) {
            long s = p.getLong("since", 0);
            if (s > 0) return s;
            s = System.currentTimeMillis();
            JSONArray a = items();
            for (int i = 0; i < a.length(); i++) {
                JSONObject o = a.optJSONObject(i);
                if (o != null && o.optLong("id") > 0) s = Math.min(s, o.optLong("id") - 60_000);
            }
            p.edit().putLong("since", s).apply();
            return s;
        }
    }

    public JSONArray items() {
        synchronized (LOCK) {
            try { return new JSONArray(p.getString("items", "[]")); } catch (JSONException e) { return new JSONArray(); }
        }
    }

    private JSONArray seen() {
        try { return new JSONArray(p.getString("seen", "[]")); } catch (JSONException e) { return new JSONArray(); }
    }

    /**
     * Adds a payment SMS as waiting and returns its id, or -1 if this payment is already known
     * (the live SMS and the inbox check can both find the same message).
     */
    public long addIfNew(String from, String text) {
        synchronized (LOCK) {
            String k = SmsFilter.key(text);
            JSONArray seen = seen();
            JSONArray old = items();
            for (int i = 0; i < seen.length(); i++) if (k.equals(seen.optString(i))) return -1;
            for (int i = 0; i < old.length(); i++) {
                JSONObject o = old.optJSONObject(i);
                if (o != null && k.equals(SmsFilter.key(o.optString("text")))) return -1;
            }
            long id = System.currentTimeMillis();
            JSONArray out = new JSONArray();
            JSONArray seenOut = new JSONArray();
            try {
                JSONObject o = new JSONObject();
                o.put("id", id).put("from", from).put("text", text).put("status", WAITING)
                        .put("trx", SmsFilter.trxId(text)).put("amount", SmsFilter.amount(text)).put("msg", "Waiting to send");
                out.put(o);
                for (int i = 0; i < old.length() && out.length() < KEEP; i++) out.put(old.get(i));
                seenOut.put(k);
                for (int i = 0; i < seen.length() && seenOut.length() < KEEP_SEEN; i++) seenOut.put(seen.get(i));
            } catch (JSONException ignored) {}
            p.edit().putString("items", out.toString()).putString("seen", seenOut.toString()).commit();
            return id;
        }
    }

    public void update(long id, String status, String msg) {
        synchronized (LOCK) {
            JSONArray a = items();
            try {
                for (int i = 0; i < a.length(); i++) {
                    JSONObject o = a.getJSONObject(i);
                    if (o.getLong("id") == id) { o.put("status", status).put("msg", msg).put("at", System.currentTimeMillis()); break; }
                }
            } catch (JSONException ignored) {}
            p.edit().putString("items", a.toString()).commit();
        }
    }

    public List<JSONObject> withStatus(String status) {
        List<JSONObject> out = new ArrayList<>();
        JSONArray a = items();
        for (int i = 0; i < a.length(); i++) {
            JSONObject o = a.optJSONObject(i);
            if (o != null && status.equals(o.optString("status"))) out.add(o);
        }
        return out;
    }

    public void setLastCheck(String msg) { p.edit().putString("lastCheck", msg).apply(); }
    public String lastCheck() { return p.getString("lastCheck", ""); }

    public void setLastScan(long at, int found) { p.edit().putLong("lastScan", at).putInt("lastScanFound", found).apply(); }
    public long lastScan() { return p.getLong("lastScan", 0); }
    public int lastScanFound() { return p.getInt("lastScanFound", 0); }
}
