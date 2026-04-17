const INTASEND_SECRET_KEY = process.env.INTASEND_SECRET_KEY;
const INTASEND_ENV = process.env.INTASEND_ENV || "sandbox"; // "sandbox" or "live"

const BASE_URL = INTASEND_ENV === "live"
  ? "https://payment.intasend.com/api/v1"
  : "https://sandbox.intasend.com/api/v1";

/**
 * Initiate M-Pesa STK Push (direct prompt to customer's phone)
 * @param {object} params - { phone, amount, orderId, email, name }
 * @returns {object} - { invoice_id, state }
 */
const initiateMpesaSTK = async ({ phone, amount, orderId, email, name }) => {
  // Normalize Kenyan phone to 254XXXXXXXXX format
  let normalizedPhone = phone.replace(/\s+/g, "").replace(/^0/, "254").replace(/^\+/, "");

  const response = await fetch(`${BASE_URL}/payment/mpesa-stk-push/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${INTASEND_SECRET_KEY}`
    },
    body: JSON.stringify({
      amount: Math.round(amount),
      phone_number: normalizedPhone,
      api_ref: `FC-${orderId}`,
      email: email || "customer@freshcart.ke",
      first_name: name?.split(" ")[0] || "Customer",
      last_name: name?.split(" ")[1] || "",
      currency: "KES",
      narrative: `FreshCart Order #${orderId}`
    })
  });

  const data = await response.json();
  if (!response.ok) {
    const errMsg = data?.details?.detail || data?.message || JSON.stringify(data);
    throw new Error(`IntaSend STK Push failed: ${errMsg}`);
  }
  return data; // { invoice_id, state, id }
};

/**
 * Check the status of an STK Push payment
 * @param {string} invoiceId - invoice_id from initiateMpesaSTK
 */
const checkPaymentStatus = async (invoiceId) => {
  const response = await fetch(`${BASE_URL}/payment/status/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${INTASEND_SECRET_KEY}`
    },
    body: JSON.stringify({ invoice_id: invoiceId })
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data?.message || "Failed to check payment status");
  }
  return data; // { invoice: { state: "COMPLETE" | "PENDING" | "FAILED" } }
};

module.exports = { initiateMpesaSTK, checkPaymentStatus };
