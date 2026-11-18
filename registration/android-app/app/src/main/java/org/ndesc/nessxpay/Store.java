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
    private static final int KEEP = 100;
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
    }

    public void setEnabled(boolean on) { p.edit().putBoolean("enabled", on).apply(); }

    public synchronized JSONArray items() {
        try { return new JSONArray(p.getString("items", "[]")); } catch (JSONException e) { return new JSONArray(); }
    }

    /** Adds a payment SMS as waiting and returns its id. */
    public synchronized long add(String from, String text) {
        long id = System.currentTimeMillis();
        JSONArray old = items();
        JSONArray out = new JSONArray();
        try {
            JSONObject o = new JSONObject();
            o.put("id", id).put("from", from).put("text", text).put("status", WAITING)
                    .put("trx", SmsFilter.trxId(text)).put("amount", SmsFilter.amount(text)).put("msg", "Waiting to send");
            out.put(o);
            for (int i = 0; i < old.length() && out.length() < KEEP; i++) out.put(old.get(i));
        } catch (JSONException ignored) {}
        p.edit().putString("items", out.toString()).apply();
        return id;
    }

    public synchronized void update(long id, String status, String msg) {
        JSONArray a = items();
        try {
            for (int i = 0; i < a.length(); i++) {
                JSONObject o = a.getJSONObject(i);
                if (o.getLong("id") == id) { o.put("status", status).put("msg", msg).put("at", System.currentTimeMillis()); break; }
            }
        } catch (JSONException ignored) {}
        p.edit().putString("items", a.toString()).apply();
    }

    public synchronized List<JSONObject> withStatus(String status) {
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
}
