package org.ndesc.nessxpay;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.provider.Telephony;
import android.telephony.SmsMessage;

import java.util.LinkedHashMap;
import java.util.Map;

/** Runs when an SMS arrives, even if the app is closed. Passes payment SMS on to ForwardWorker. */
public class SmsReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context c, Intent intent) {
        if (!Telephony.Sms.Intents.SMS_RECEIVED_ACTION.equals(intent.getAction())) return;
        Store store = new Store(c);
        if (!store.enabled() || !store.configured()) return;

        SmsMessage[] parts = Telephony.Sms.Intents.getMessagesFromIntent(intent);
        if (parts == null) return;
        // A long SMS arrives in several parts. Join them per sender.
        Map<String, StringBuilder> bySender = new LinkedHashMap<>();
        for (SmsMessage m : parts) {
            if (m == null) continue;
            String from = m.getDisplayOriginatingAddress();
            if (from == null) from = "";
            StringBuilder sb = bySender.get(from);
            if (sb == null) { sb = new StringBuilder(); bySender.put(from, sb); }
            sb.append(m.getDisplayMessageBody());
        }
        for (Map.Entry<String, StringBuilder> e : bySender.entrySet()) {
            String text = e.getValue().toString();
            if (!SmsFilter.isPayment(e.getKey(), text)) continue;
            long id = store.add(e.getKey(), text);
            ForwardWorker.enqueue(c, id, e.getKey(), text);
        }
    }
}
