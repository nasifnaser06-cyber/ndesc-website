package org.ndesc.nessxpay;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.URL;
import java.nio.charset.StandardCharsets;

/**
 * Talks to the Google Apps Script web app. Plain Java so it can be tested on a computer.
 *
 * Apps Script answers a POST with a redirect to the real reply. The script has already done its
 * work by then, so the redirect is followed with a GET just to read the answer.
 */
public final class Sender {
    private Sender() {}

    public static final class Result {
        public final boolean ok;
        /** True when trying again cannot help (wrong key, wrong link). */
        public final boolean permanent;
        public final String message;

        Result(boolean ok, boolean permanent, String message) {
            this.ok = ok;
            this.permanent = permanent;
            this.message = message;
        }
    }

    public static Result sendSms(String url, String key, String from, String text) {
        return post(url, "{\"action\":\"sms\",\"key\":" + q(key) + ",\"text\":" + q(text) + ",\"from\":" + q(from) + "}");
    }

    /** Checks the link and key without recording anything: the sheet ignores a message with no TrxID. */
    public static Result check(String url, String key) {
        Result r = sendSms(url, key, "NESSX Payments app", "Connection check from the NESSX Payments app");
        if (r.ok) return new Result(true, false, "Connected. The sheet accepted the key.");
        return r;
    }

    static Result post(String url, String body) {
        if (url == null || !url.trim().startsWith("https://")) return new Result(false, true, "The web app link must start with https://");
        return send(url, body);
    }

    /** Tests only: a local stand-in server speaks plain http. */
    static Result postForTest(String url, String body) { return send(url, body); }

    private static Result send(String url, String body) {
        HttpURLConnection c = null;
        try {
            c = (HttpURLConnection) new URL(url.trim()).openConnection();
            c.setInstanceFollowRedirects(false);
            c.setConnectTimeout(20000);
            c.setReadTimeout(30000);
            c.setRequestMethod("POST");
            c.setDoOutput(true);
            c.setRequestProperty("Content-Type", "text/plain;charset=utf-8");
            byte[] bytes = body.getBytes(StandardCharsets.UTF_8);
            c.setFixedLengthStreamingMode(bytes.length);
            try (OutputStream o = c.getOutputStream()) { o.write(bytes); }
            int code = c.getResponseCode();
            String reply;
            if (code >= 300 && code < 400) {
                String next = c.getHeaderField("Location");
                c.disconnect();
                c = null;
                if (next == null) return new Result(false, false, "The sheet sent no reply. Will try again.");
                reply = get(next, 5);
            } else if (code >= 200 && code < 300) {
                reply = read(c.getInputStream());
            } else if (code == 404) {
                return new Result(false, true, "Link not found. Check the web app link.");
            } else if (code == 401 || code == 403) {
                return new Result(false, true, "Google refused. Is the web app shared with Anyone?");
            } else {
                return new Result(false, false, "The sheet answered " + code + ". Will try again.");
            }
            return judge(reply);
        } catch (IOException e) {
            return new Result(false, false, "No connection (" + e.getClass().getSimpleName() + "). Will try again.");
        } finally {
            if (c != null) c.disconnect();
        }
    }

    private static String get(String url, int hopsLeft) throws IOException {
        HttpURLConnection c = (HttpURLConnection) new URL(url).openConnection();
        try {
            c.setInstanceFollowRedirects(false);
            c.setConnectTimeout(20000);
            c.setReadTimeout(30000);
            int code = c.getResponseCode();
            if (code >= 300 && code < 400 && hopsLeft > 0 && c.getHeaderField("Location") != null) {
                return get(c.getHeaderField("Location"), hopsLeft - 1);
            }
            if (code >= 400) return "";
            return read(c.getInputStream());
        } finally {
            c.disconnect();
        }
    }

    static Result judge(String reply) {
        String r = reply == null ? "" : reply.replace(" ", "");
        if (r.contains("\"ok\":true")) {
            if (r.contains("\"duplicate\":true")) return new Result(true, false, "Already in the sheet.");
            if (r.contains("\"unread\":true")) return new Result(true, false, "Sent. The sheet could not read it: see the Unread SMS tab.");
            return new Result(true, false, "Sent to the sheet.");
        }
        if (r.contains("Notallowed")) return new Result(false, true, "The sheet refused the key. Copy the SMS key again from the Settings tab.");
        if (r.contains("Unknownrequest")) return new Result(false, true, "The sheet did not understand. Is this the right web app link?");
        if (r.isEmpty()) return new Result(false, false, "Empty reply from the sheet. Will try again.");
        return new Result(false, false, "Unexpected reply. Will try again.");
    }

    private static String read(InputStream in) throws IOException {
        try (InputStream i = in; ByteArrayOutputStream b = new ByteArrayOutputStream()) {
            byte[] buf = new byte[4096];
            int n;
            while ((n = i.read(buf)) > 0) b.write(buf, 0, n);
            return b.toString("UTF-8");
        }
    }

    /** A JSON string. */
    static String q(String s) {
        if (s == null) s = "";
        StringBuilder b = new StringBuilder("\"");
        for (char ch : s.toCharArray()) {
            switch (ch) {
                case '"': b.append("\\\""); break;
                case '\\': b.append("\\\\"); break;
                case '\n': b.append("\\n"); break;
                case '\r': b.append("\\r"); break;
                case '\t': b.append("\\t"); break;
                default:
                    if (ch < 0x20) b.append(String.format("\\u%04x", (int) ch));
                    else b.append(ch);
            }
        }
        return b.append('"').toString();
    }
}
