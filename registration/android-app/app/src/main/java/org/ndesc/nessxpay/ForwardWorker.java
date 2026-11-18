package org.ndesc.nessxpay;

import android.content.Context;

import androidx.annotation.NonNull;
import androidx.work.BackoffPolicy;
import androidx.work.Constraints;
import androidx.work.Data;
import androidx.work.ExistingWorkPolicy;
import androidx.work.NetworkType;
import androidx.work.OneTimeWorkRequest;
import androidx.work.WorkManager;
import androidx.work.Worker;
import androidx.work.WorkerParameters;

import java.util.concurrent.TimeUnit;

/**
 * Sends one payment SMS to the sheet. Android runs it as soon as there is internet, and tries
 * again with growing gaps if the sheet cannot be reached. The sheet ignores a TrxID it already
 * has, so a repeat can never count a payment twice.
 */
public class ForwardWorker extends Worker {
    private static final int MAX_TRIES = 25;

    public ForwardWorker(@NonNull Context c, @NonNull WorkerParameters p) { super(c, p); }

    static void enqueue(Context c, long id, String from, String text) {
        Data data = new Data.Builder().putLong("id", id).putString("from", from).putString("text", text).build();
        OneTimeWorkRequest req = new OneTimeWorkRequest.Builder(ForwardWorker.class)
                .setInputData(data)
                .setConstraints(new Constraints.Builder().setRequiredNetworkType(NetworkType.CONNECTED).build())
                .setBackoffCriteria(BackoffPolicy.EXPONENTIAL, 30, TimeUnit.SECONDS)
                .build();
        WorkManager.getInstance(c).enqueueUniqueWork("sms-" + id, ExistingWorkPolicy.REPLACE, req);
    }

    @NonNull
    @Override
    public Result doWork() {
        Context c = getApplicationContext();
        Store store = new Store(c);
        long id = getInputData().getLong("id", 0);
        String from = getInputData().getString("from");
        String text = getInputData().getString("text");
        String trx = SmsFilter.trxId(text);
        String amount = SmsFilter.amount(text);
        String label = (amount.isEmpty() ? "" : "Tk " + amount + "  ") + trx;

        Sender.Result r = Sender.sendSms(store.url(), store.key(), from, text);
        if (r.ok) {
            store.update(id, Store.SENT, r.message);
            Notifier.show(c, (int) (id % 100000), "Payment sent to sheet", label + "\n" + r.message);
            return Result.success();
        }
        if (r.permanent || getRunAttemptCount() + 1 >= MAX_TRIES) {
            store.update(id, Store.FAILED, r.message);
            Notifier.show(c, (int) (id % 100000), "Payment NOT sent: open the app", label + "\n" + r.message);
            return Result.failure();
        }
        store.update(id, Store.WAITING, r.message + " (try " + (getRunAttemptCount() + 1) + ")");
        return Result.retry();
    }
}
