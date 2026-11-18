package org.ndesc.nessxpay;

import android.Manifest;
import android.content.Context;
import android.content.pm.PackageManager;
import android.database.Cursor;
import android.provider.Telephony;

/**
 * Looks through the SMS inbox for bKash payment messages the app has not sent yet, so a
 * message the phone failed to hand over in the moment is still sent a little later.
 */
final class InboxScanner {
    private InboxScanner() {}
    private static final long WINDOW = 3L * 24 * 60 * 60 * 1000; // never more than 3 days back

    /** Returns how many new payment SMS were found and queued. */
    static int scan(Context c) {
        Store store = new Store(c);
        if (!store.enabled() || !store.configured()) return 0;
        if (c.checkSelfPermission(Manifest.permission.READ_SMS) != PackageManager.PERMISSION_GRANTED) return 0;
        long from = Math.max(store.since(), System.currentTimeMillis() - WINDOW);
        int found = 0;
        try (Cursor cur = c.getContentResolver().query(
                Telephony.Sms.Inbox.CONTENT_URI,
                new String[]{Telephony.Sms.ADDRESS, Telephony.Sms.BODY, Telephony.Sms.DATE},
                Telephony.Sms.DATE + " >= ?",
                new String[]{String.valueOf(from)},
                Telephony.Sms.DATE + " ASC")) {
            if (cur != null) {
                while (cur.moveToNext()) {
                    String addr = cur.getString(0), body = cur.getString(1);
                    if (!SmsFilter.isPayment(addr, body)) continue;
                    long id = store.addIfNew(addr, body);
                    if (id > 0) {
                        ForwardWorker.enqueue(c, id, addr, body);
                        found++;
                    }
                }
            }
        } catch (RuntimeException e) {
            // Some phones refuse the query for a moment; the next check tries again.
        }
        store.setLastScan(System.currentTimeMillis(), found);
        return found;
    }
}
