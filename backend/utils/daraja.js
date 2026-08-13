const DARJA_BASE_URL = process.env.DARAJA_ENV === "production" ? "https://api.safaricom.co.ke" : "https://sandbox.safaricom.co.ke";

const getConfig = () => {
  const config = { consumerKey: process.env.DARAJA_CONSUMER_KEY, consumerSecret: process.env.DARAJA_CONSUMER_SECRET, shortcode: process.env.DARAJA_SHORTCODE, passkey: process.env.DARAJA_PASSKEY, callbackUrl: process.env.DARAJA_CALLBACK_URL };
  const missing = Object.entries(config).filter(([, value]) => !value).map(([key]) => key);
  if (missing.length) throw new Error(`Daraja is not configured: missing ${missing.join(", ")}`);
  return config;
};

const normalizeKenyanPhone = (phone) => {
  const digits = String(phone || "").replace(/\D/g, "");
  const normalized = digits.startsWith("0") ? `254${digits.slice(1)}` : digits.startsWith("7") || digits.startsWith("1") ? `254${digits}` : digits;
  if (!/^254(7|1)\d{8}$/.test(normalized)) throw new Error("Use a valid Kenyan M-Pesa number, e.g. 0712345678.");
  return normalized;
};

const readJson = async (response) => {
  const body = await response.text();
  try { return body ? JSON.parse(body) : {}; } catch { return { raw: body }; }
};

const getAccessToken = async () => {
  const { consumerKey, consumerSecret } = getConfig();
  const credentials = Buffer.from(`${consumerKey}:${consumerSecret}`).toString("base64");
  const response = await fetch(`${DARJA_BASE_URL}/oauth/v1/generate?grant_type=client_credentials`, { headers: { Authorization: `Basic ${credentials}` } });
  const data = await readJson(response);
  if (!response.ok || !data.access_token) throw new Error(data.errorMessage || data.error || "Could not obtain a Daraja access token.");
  return data.access_token;
};

const paymentPassword = (shortcode, passkey, timestamp) => Buffer.from(`${shortcode}${passkey}${timestamp}`).toString("base64");
const timestampNow = () => new Date().toISOString().replace(/[-:TZ.]/g, "").slice(0, 14);

const stkPush = async ({ phone, amount, accountReference, transactionDesc }) => {
  const { shortcode, passkey, callbackUrl } = getConfig();
  const Timestamp = timestampNow();
  const accessToken = await getAccessToken();
  const response = await fetch(`${DARJA_BASE_URL}/mpesa/stkpush/v1/processrequest`, {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ BusinessShortCode: shortcode, Password: paymentPassword(shortcode, passkey, Timestamp), Timestamp, TransactionType: process.env.DARAJA_TRANSACTION_TYPE || "CustomerPayBillOnline", Amount: Math.round(Number(amount)), PartyA: phone, PartyB: shortcode, PhoneNumber: phone, CallBackURL: callbackUrl, AccountReference: accountReference.slice(0, 12), TransactionDesc: transactionDesc.slice(0, 13) })
  });
  const data = await readJson(response);
  if (!response.ok || data.ResponseCode !== "0") throw new Error(data.errorMessage || data.ResponseDescription || "Daraja rejected the STK Push request.");
  return data;
};

const stkQuery = async (checkoutRequestId) => {
  const { shortcode, passkey } = getConfig();
  const Timestamp = timestampNow();
  const accessToken = await getAccessToken();
  const response = await fetch(`${DARJA_BASE_URL}/mpesa/stkpushquery/v1/query`, {
    method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${accessToken}` },
    body: JSON.stringify({ BusinessShortCode: shortcode, Password: paymentPassword(shortcode, passkey, Timestamp), Timestamp, CheckoutRequestID: checkoutRequestId })
  });
  const data = await readJson(response);
  if (!response.ok) throw new Error(data.errorMessage || "Could not query Daraja payment status.");
  return data;
};

module.exports = { normalizeKenyanPhone, stkPush, stkQuery };
