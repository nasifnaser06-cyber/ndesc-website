package org.ndesc.nessxpay;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

/**
 * Decides which SMS leave the phone. Only money messages from bKash (or Nagad) that carry a
 * transaction ID are sent. OTP and PIN messages never are, and nothing from people is.
 * Plain Java so it can be tested on a computer.
 */
public final class SmsFilter {
    private SmsFilter() {}

    // bKash sends as "bKash" (some phones show its short code 16247). Nagad sends as "NAGAD".
    private static final Pattern SENDER = Pattern.compile("(?i)^(?:.*bkash.*|.*nagad.*|16247|16167)$");
    private static final Pattern HAS_ID = Pattern.compile("(?i)\\b(?:TrxID|TxnID)\\b");
    private static final Pattern SECRET = Pattern.compile("(?i)\\b(?:OTP|PIN|verification code)\\b");
    private static final Pattern ID = Pattern.compile("(?i)\\b(?:TrxID|TxnID)[:\\s]+([A-Z0-9]{8,12})\\b");
    private static final Pattern AMOUNT = Pattern.compile("(?i)\\bTk\\.?\\s*([\\d,]+(?:\\.\\d{1,2})?)");

    public static boolean isPayment(String sender, String body) {
        if (sender == null || body == null) return false;
        if (!SENDER.matcher(sender.trim()).matches()) return false;
        if (SECRET.matcher(body).find()) return false;
        return HAS_ID.matcher(body).find();
    }

    /** The transaction ID, for the app's own list. Empty if none. */
    public static String trxId(String body) {
        Matcher m = ID.matcher(body == null ? "" : body);
        return m.find() ? m.group(1).toUpperCase(java.util.Locale.ROOT) : "";
    }

    /** The first "Tk 1,000.00" amount, for the app's own list. Empty if none. */
    public static String amount(String body) {
        Matcher m = AMOUNT.matcher(body == null ? "" : body);
        return m.find() ? m.group(1) : "";
    }
}
