package org.ndesc.nessxpay;

import static org.junit.Assert.*;

import org.junit.Test;

public class SmsFilterTest {
    static final String CASH_IN = "Cash In Tk 1,000.00 from 01622334999 successful. Fee Tk 0.00. Balance Tk 1,035.17. TrxID DKI4MZEC1K at 18/11/2026 17:50. Download App: https://bKa.sh/8app";
    static final String RECEIVED = "You have received Tk 1,000.00 from 01730260578. Fee Tk 0.00. Balance Tk 1,075.27. TrxID DK481HDVPG at 04/11/2026 13:38";

    @Test public void forwardsBkashMoneyIn() {
        assertTrue(SmsFilter.isPayment("bKash", CASH_IN));
        assertTrue(SmsFilter.isPayment("bKash", RECEIVED));
        assertTrue(SmsFilter.isPayment("BKASH", RECEIVED));
        assertTrue(SmsFilter.isPayment("16247", RECEIVED));
    }

    @Test public void forwardsNagadSoTheSheetCanLearnItsFormat() {
        assertTrue(SmsFilter.isPayment("NAGAD", "Money Received. Amount: Tk 10.00 Sender: 01711111111 TxnID: 7A1B2C3D4E"));
    }

    @Test public void neverForwardsPeopleOrOtherSenders() {
        assertFalse(SmsFilter.isPayment("01711111111", RECEIVED));
        assertFalse(SmsFilter.isPayment("+8801711111111", "TrxID ABCDEFGH12 lol"));
        assertFalse(SmsFilter.isPayment("GP", "TrxID ABCDEFGH12"));
        assertFalse(SmsFilter.isPayment(null, RECEIVED));
        assertFalse(SmsFilter.isPayment("bKash", null));
    }

    @Test public void neverForwardsCodesOrMessagesWithoutAnId() {
        assertFalse(SmsFilter.isPayment("bKash", "Your bKash verification code is 123456. Do not share it."));
        assertFalse(SmsFilter.isPayment("bKash", "Your OTP is 445566. TrxID ABCDEFGH12"));
        assertFalse(SmsFilter.isPayment("bKash", "Never share your PIN with anyone."));
        assertFalse(SmsFilter.isPayment("bKash", "Get 10% cashback this Friday!"));
    }

    @Test public void readsIdAndAmountForTheList() {
        assertEquals("DKI4MZEC1K", SmsFilter.trxId(CASH_IN));
        assertEquals("1,000.00", SmsFilter.amount(RECEIVED));
        assertEquals("7A1B2C3D4E", SmsFilter.trxId("TxnID: 7a1b2c3d4e"));
        assertEquals("", SmsFilter.trxId("nothing"));
    }
}
