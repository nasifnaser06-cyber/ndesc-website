# NESSX Payments (Android app)

The club's own app for the payment phone. When a bKash payment SMS arrives, it sends that SMS to the registration sheet's web app. Nothing else leaves the phone.

## What it sends, and what it never sends

- **Sends:** SMS from bKash (or Nagad) that contain a transaction ID (`TrxID` / `TxnID`).
- **Never sends:** messages from people, other companies, OTP or PIN messages, or messages without a transaction ID.
- The sheet ignores a TrxID it already has, so a repeat can never count a payment twice.

## Install on the payment phone

1. Copy `NESSX-Payments-1.2.apk` to the phone (WhatsApp to yourself, Google Drive or a USB cable) and tap it.
2. Android asks to allow installs from that app (Files, Drive, WhatsApp). Allow it. If Play Protect warns, tap **More details > Install anyway**. It warns because the app is not from the Play Store and reads SMS.
3. Open **NESSX Payments**:
   - Tap **Allow** for SMS.
   - Paste the web app link (ends in `/exec`) and the **SMS key** from the sheet's Settings tab, then tap **Save and check**. It should say "✓ Connected. The sheet accepted the key."
   - Tap **Allow notifications** and **Allow running in the background** if those buttons show.
4. On Xiaomi, Oppo, Realme and Vivo phones also turn on **Autostart** for the app in the phone's settings.
5. Send 10 Tk from another phone. The payment appears in the app's list as "✓ Sent", a notification shows, and a row appears in the sheet's Payments tab.

## How it avoids missing a payment (1.2)

- **Always on.** A small permanent notification, "NESSX Payments is on", keeps the app running. Phones such as Tecno and Xiaomi do not stop an app that shows one. It starts again by itself after a restart or an update.
- **Inbox check.** Every minute (and when the app opens, and every 15 minutes as a backup even if the app was closed) it looks through the SMS inbox for bKash payment SMS it has not sent yet, and sends them. It only looks at SMS from after the app was first set up, and never more than 3 days back, so older personal messages are never sent.
- A payment found both ways is sent once: the app keeps a list of TrxIDs it has seen, and the sheet ignores a TrxID it already has.

## Day to day

- Keep the phone charged and on mobile data or Wi-Fi. If the internet drops, the app keeps the SMS and sends it when the connection is back.
- A red "✗ Not sent" item means the link or key is wrong. Fix it in Setup, tap **Save and check**, then **Send the failed ones again**.
- The switch at the top turns forwarding off without uninstalling.

## Build it yourself

Needs JDK 17+ and the Android SDK (platform 34, build-tools 34).

```
cd registration/android-app
echo "sdk.dir=/path/to/android-sdk" > local.properties
gradle testReleaseUnitTest      # 13 checks: the SMS filter and the sending
gradle assembleRelease          # app/build/outputs/apk/release/app-release.apk
```

Signing uses `keystore.properties` (storeFile, storePassword, keyAlias, keyPassword), which is not in git. Updates must be signed with the same key, or Android refuses to install them over the old app, so keep the key file and its password somewhere safe.

## Files

| File | What it does |
|---|---|
| `SmsFilter.java` | Decides which SMS are payments. |
| `Sender.java` | Sends to the web app and reads its answer (follows Apps Script's redirect). |
| `SmsReceiver.java` | Runs when an SMS arrives, even with the app closed. |
| `ListenerService.java` | The always-on part with the permanent notification; checks the inbox every minute. |
| `InboxScanner.java` | Finds payment SMS in the inbox that were not sent yet. |
| `ScanWorker.java` | The 15-minute backup check. |
| `BootReceiver.java` | Starts watching again after a restart or an update. |
| `ForwardWorker.java` | Sends one SMS, retrying with growing gaps while offline (up to 25 tries). |
| `Store.java` | Link, key, on/off and the list of recent payment SMS, kept on the phone. |
| `MainActivity.java` | The one screen. |
