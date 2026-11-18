package org.ndesc.nessxpay;

import static org.junit.Assert.*;

import org.junit.After;
import org.junit.Before;
import org.junit.Test;

import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.InetAddress;
import java.net.ServerSocket;
import java.net.Socket;
import java.nio.charset.StandardCharsets;
import java.util.concurrent.atomic.AtomicReference;

/** Plays the part of Apps Script: POST answers 302, the reply waits at the redirect address. */
public class SenderTest {
    ServerSocket server;
    String base;
    volatile boolean running = true;
    final AtomicReference<String> lastBody = new AtomicReference<>();
    final AtomicReference<String> reply = new AtomicReference<>("{\"ok\":true,\"trxId\":\"DK481HDVPG\"}");

    @Before public void start() throws Exception {
        server = new ServerSocket(0, 50, InetAddress.getByName("127.0.0.1"));
        base = "http://127.0.0.1:" + server.getLocalPort();
        Thread t = new Thread(() -> {
            while (running) {
                try (Socket s = server.accept()) { handle(s); } catch (Exception e) { /* closed */ }
            }
        });
        t.setDaemon(true);
        t.start();
    }

    void handle(Socket s) throws Exception {
        BufferedReader in = new BufferedReader(new InputStreamReader(s.getInputStream(), StandardCharsets.UTF_8));
        String first = in.readLine();
        if (first == null) return;
        String path = first.split(" ")[1];
        int len = 0;
        String h;
        while ((h = in.readLine()) != null && !h.isEmpty()) {
            if (h.toLowerCase().startsWith("content-length:")) len = Integer.parseInt(h.substring(15).trim());
        }
        char[] body = new char[len];
        int got = 0;
        while (got < len) { int n = in.read(body, got, len - got); if (n < 0) break; got += n; }
        OutputStream out = s.getOutputStream();
        String resp;
        if (path.equals("/exec")) {
            lastBody.set(new String(body, 0, got));
            resp = "HTTP/1.1 302 Found\r\nLocation: " + base + "/echo\r\nContent-Length: 0\r\nConnection: close\r\n\r\n";
        } else if (path.equals("/echo")) {
            byte[] b = reply.get().getBytes(StandardCharsets.UTF_8);
            resp = "HTTP/1.1 200 OK\r\nContent-Type: application/json\r\nContent-Length: " + b.length + "\r\nConnection: close\r\n\r\n" + reply.get();
        } else {
            resp = "HTTP/1.1 404 Not Found\r\nContent-Length: 0\r\nConnection: close\r\n\r\n";
        }
        out.write(resp.getBytes(StandardCharsets.UTF_8));
        out.flush();
    }

    @After public void stop() throws Exception { running = false; server.close(); }

    // The app only accepts https links, so tests call post() through a small http door.
    Sender.Result send(String path, String text) {
        return Sender.postForTest(base + path, "{\"action\":\"sms\",\"key\":\"k\",\"text\":" + Sender.q(text) + "}");
    }

    @Test public void followsTheRedirectAndReadsOk() {
        Sender.Result r = send("/exec", SmsFilterTest.RECEIVED);
        assertTrue(r.ok);
        assertTrue(lastBody.get().contains("DK481HDVPG"));
    }

    @Test public void wrongKeyIsPermanent() {
        reply.set("{\"ok\":false,\"error\":\"Not allowed.\"}");
        Sender.Result r = send("/exec", "x");
        assertFalse(r.ok);
        assertTrue(r.permanent);
    }

    @Test public void wrongLinkIsPermanent() {
        Sender.Result r = send("/missing", "x");
        assertFalse(r.ok);
        assertTrue(r.permanent);
    }

    @Test public void noConnectionRetries() {
        running = false;
        try { server.close(); } catch (Exception ignored) {}
        Sender.Result r = send("/exec", "x");
        assertFalse(r.ok);
        assertFalse(r.permanent);
    }

    @Test public void refusesPlainHttpInTheApp() {
        Sender.Result r = Sender.sendSms("http://example.com/exec", "k", "bKash", "x");
        assertFalse(r.ok);
        assertTrue(r.permanent);
    }

    @Test public void escapesTextIntoValidJson() {
        assertEquals("\"a\\\"b\\\\c\\nd\"", Sender.q("a\"b\\c\nd"));
    }

    @Test public void judgesReplies() {
        assertTrue(Sender.judge("{\"ok\":true,\"ignored\":true}").ok);
        assertTrue(Sender.judge("{\"ok\":true,\"unread\":true}").ok);
        assertFalse(Sender.judge("").ok);
        assertFalse(Sender.judge("{\"ok\":false,\"error\":\"Unknown request.\"}").ok);
    }
}
