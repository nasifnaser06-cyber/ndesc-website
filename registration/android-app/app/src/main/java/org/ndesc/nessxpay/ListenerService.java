package org.ndesc.nessxpay;

import android.app.Notification;
import android.app.NotificationChannel;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Context;
import android.content.Intent;
import android.content.pm.ServiceInfo;
import android.os.Build;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.IBinder;

/**
 * Keeps the app running with a small permanent notification. Phones (Tecno, Xiaomi and others)
 * do not stop an app that shows one, so payment SMS are seen the moment they arrive. While it
 * runs it also checks the inbox every minute for anything missed.
 */
public class ListenerService extends Service {
    private static final String CHANNEL = "listening";
    private static final int NOTE_ID = 1;
    private static final long EVERY = 60_000;
    private HandlerThread thread;
    private Handler handler;

    private final Runnable check = new Runnable() {
        @Override public void run() {
            InboxScanner.scan(ListenerService.this);
            handler.postDelayed(this, EVERY);
        }
    };

    /** Starts the service if the app is set up and switched on. Safe to call often. */
    static void start(Context c) {
        Store s = new Store(c);
        if (!s.enabled() || !s.configured()) return;
        Intent i = new Intent(c, ListenerService.class);
        try {
            if (Build.VERSION.SDK_INT >= 26) c.startForegroundService(i); else c.startService(i);
        } catch (RuntimeException e) {
            // Android refuses to start it from the background in some cases; opening the app starts it.
        }
    }

    static void stop(Context c) { c.stopService(new Intent(c, ListenerService.class)); }

    @Override
    public void onCreate() {
        super.onCreate();
        thread = new HandlerThread("inbox-check");
        thread.start();
        handler = new Handler(thread.getLooper());
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        Notification n = note();
        if (Build.VERSION.SDK_INT >= 34) startForeground(NOTE_ID, n, ServiceInfo.FOREGROUND_SERVICE_TYPE_SPECIAL_USE);
        else startForeground(NOTE_ID, n);
        Store s = new Store(this);
        if (!s.enabled() || !s.configured()) { stopSelf(); return START_NOT_STICKY; }
        handler.removeCallbacks(check);
        handler.post(check);
        return START_STICKY;
    }

    private Notification note() {
        NotificationManager nm = getSystemService(NotificationManager.class);
        Notification.Builder b;
        if (Build.VERSION.SDK_INT >= 26) {
            NotificationChannel ch = new NotificationChannel(CHANNEL, "Watching for payments", NotificationManager.IMPORTANCE_LOW);
            ch.setShowBadge(false);
            if (nm != null) nm.createNotificationChannel(ch);
            b = new Notification.Builder(this, CHANNEL);
        } else {
            b = new Notification.Builder(this);
        }
        PendingIntent open = PendingIntent.getActivity(this, 0, new Intent(this, MainActivity.class),
                PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
        return b.setSmallIcon(android.R.drawable.stat_notify_sync_noanim)
                .setContentTitle("NESSX Payments is on")
                .setContentText("Watching for bKash payment SMS")
                .setContentIntent(open)
                .setOngoing(true)
                .build();
    }

    @Override
    public void onDestroy() {
        handler.removeCallbacks(check);
        thread.quitSafely();
        super.onDestroy();
    }

    @Override public IBinder onBind(Intent intent) { return null; }
}
