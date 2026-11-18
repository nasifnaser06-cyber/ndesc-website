const { makeGoogle } = require('./fake-google');
const { ctx, sheets, mails } = makeGoogle();
let pass = 0, fail = 0;
const check = (n, c, x) => { if (c) pass++; else { fail++; console.log('FAIL', n, x !== undefined ? JSON.stringify(x) : ''); } };
const post = body => ctx.doPost({ postData: { contents: JSON.stringify(body) }, parameter: {} });

ctx.setup();
const S = sheets.Settings.data;
const key = S.find(r => r[0] === 'SMS key')[1];
check('setup made sheets', ['Registrations', 'Payments', 'Needs review', 'Unread SMS', 'Settings'].every(n => sheets[n]));
check('secret key made', key && key.length >= 30);

const base = { action: 'register', name: 'Rahim Uddin', email: 'rahim@example.com', phone: '01730260578', institution: 'Ideal School', className: '9', category: 'S', segments: ['Star Mapping'], wallet: 'bKash', consent: true };

let r1 = post({ ...base, pass: 'solo', trxId: 'DK481HDVPG', sender: '01730260578' });
check('register accepted, waiting', r1.ok && r1.status === 'Waiting', r1);
check('received email sent', mails.length === 1 && /received/.test(mails[0].subject), mails.map(m => m.subject));

let bad = post({ action: 'sms', key: 'wrong', text: 'You have received Tk 200.00 from 01730260578. Fee Tk 0.00. Balance Tk 9.00. TrxID DK481HDVPG at 18/11/2026 13:38' });
check('sms without key refused', bad.ok === false);

let sms = post({ action: 'sms', key, text: 'You have received Tk 200.00 from 01730260578. Fee Tk 0.00. Balance Tk 1,075.27. TrxID DK481HDVPG at 18/11/2026 13:38' });
check('sms accepted', sms.ok && sms.trxId === 'DK481HDVPG', sms);
const reg = sheets.Registrations.data[1];
check('registration verified', reg[2] === 'Verified', reg);
check('participant id', reg[17] === 'NESSX-S-0001', reg[17]);
check('pass emailed', /Your NESSX Solo Pass, NESSX-S-0001/.test(mails[mails.length - 1].subject), mails.map(m => m.subject));
check('payment marked used', sheets.Payments.data[1][7] === reg[0], sheets.Payments.data[1]);
check('balance not stored', !JSON.stringify(sheets.Payments.data).includes('1075'));

let again = post({ action: 'sms', key, text: 'You have received Tk 200.00 from 01730260578. Fee Tk 0.00. Balance Tk 1,075.27. TrxID DK481HDVPG at 18/11/2026 13:38' });
check('repeated sms not doubled', sheets.Payments.data.length === 2, sheets.Payments.data.length);

let dup = post({ ...base, pass: 'solo', trxId: 'DK481HDVPG', sender: '01730260578' });
check('same form twice returns first', dup.ok && dup.duplicate && dup.regId === r1.regId, dup);

let thief = post({ ...base, phone: '01811111111', email: 'x@example.com', pass: 'solo', trxId: 'DK481HDVPG', sender: '01811111111' });
check('reused TrxID goes to review', thief.ok && thief.status === 'Needs review', thief);
check('review email sent', /checking your payment/.test(mails[mails.length - 1].subject));

// pay first, register later (Cash In from an agent)
post({ action: 'sms', key, text: 'Cash In Tk 300.00 from 01622334999 successful. Fee Tk 0.00. Balance Tk 1,035.17. TrxID DKI4MZEC1K at 18/11/2026 17:50. Download App: https://bKa.sh/8app' });
let team1 = post({ ...base, phone: '01912345678', email: 't1@example.com', pass: 'team', segments: ['Wall Magazine'], trxId: 'DKI4MZEC1K', sender: '01912345678' });
check('team: new code, verified from earlier cash in', team1.ok && team1.newTeam && /^[A-Z0-9]{6}$/.test(team1.teamCode) && team1.status === 'Verified', team1);

let badCode = post({ ...base, phone: '01912345679', email: 't2@example.com', pass: 'team', segments: ['Wall Magazine'], teamCode: 'ZZZZZZ', trxId: 'DKXXXXXX99', sender: '01912345679' });
check('unknown team code refused', badCode.ok === false && /team code/.test(badCode.errors[0]), badCode);

let online = post({ ...base, phone: '01555555555', email: 'o@example.com', pass: 'online', segments: ['Photosphere 7.0'] });
check('online pass verified immediately', online.ok && online.status === 'Verified', online);

let st = post({ action: 'status', phone: '01730260578', trxId: 'dk481hdvpg' });
check('status lookup', st.ok && st.status === 'Verified' && st.participantId === 'NESSX-S-0001', st);

let otp = post({ action: 'sms', key, text: 'Your bKash verification code is 482910. OTP valid for 2 min' });
check('otp ignored and not stored', otp.ignored && !JSON.stringify(sheets).includes('482910'));

let invalid = post({ ...base, pass: 'solo', email: 'nope', trxId: 'x', sender: '1' });
check('bad form refused with reasons', invalid.ok === false && invalid.errors.length >= 3, invalid);

S.find(r => r[0] === 'Registration open')[1] = 'FALSE';
let closed = post({ ...base, phone: '01722222222', pass: 'online', segments: ['Photosphere 7.0'] });
check('closed registration refused', closed.ok === false && /closed/.test(closed.error), closed);

console.log(`${pass}/${pass + fail} checks passed`);
process.exit(fail ? 1 : 0);
