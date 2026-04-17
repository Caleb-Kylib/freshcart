const crypto = require('crypto');

// Pesapal Configuration
const PESAPAL_CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY;
const PESAPAL_CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET;
const PESAPAL_ENV = process.env.PESAPAL_ENV || "sandbox"; // "sandbox" or "production"

const BASE_URL = PESAPAL_ENV === "sandbox" 
  ? "https://cybqa.pesapal.com/pesapalv3/api" 
  : "https://pay.pesapal.com/v3/api";

/**
 * Authenticate with Pesapal and get bearer token
 */
const getAuthToken = async () => {
  try {
    const response = await fetch(`${BASE_URL}/Auth/RequestToken`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        consumer_key: PESAPAL_CONSUMER_KEY,
        consumer_secret: PESAPAL_CONSUMER_SECRET
      })
    });

    const data = await response.json();
    if (data.status === "200" || response.ok) {
      return data.token;
    }
    throw new Error(data.message || "Failed to get Pesapal token");
  } catch (error) {
    console.error("Pesapal Auth Error:", error);
    throw error;
  }
};

/**
 * Register IPN URL
 */
const registerIPN = async (token, ipnUrl) => {
  try {
    const response = await fetch(`${BASE_URL}/URLSetup/RegisterIPN`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify({
        url: ipnUrl,
        ipn_notification_type: "POST"
      })
    });

    const data = await response.json();
    if (response.ok) {
      return data.ipn_id;
    }
    throw new Error(data.error?.message || "Failed to register IPN");
  } catch (error) {
    console.error("Pesapal IPN Registration Error:", error);
    throw error;
  }
};

/**
 * Submit Order Request
 */
const submitOrder = async (token, orderData) => {
  try {
    const response = await fetch(`${BASE_URL}/Transactions/SubmitOrderRequest`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      },
      body: JSON.stringify(orderData)
    });

    const data = await response.json();
    if (response.ok) {
      return data; // Returns { order_tracking_id, merchant_reference, redirect_url, error }
    }
    throw new Error(data.error?.message || "Failed to submit order");
  } catch (error) {
    console.error("Pesapal Submit Order Error:", error);
    throw error;
  }
};

/**
 * Get Transaction Status
 */
const getTransactionStatus = async (token, orderTrackingId) => {
  try {
    const response = await fetch(`${BASE_URL}/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json",
        "Authorization": `Bearer ${token}`
      }
    });

    const data = await response.json();
    if (response.ok) {
      return data;
    }
    throw new Error(data.error?.message || "Failed to get status");
  } catch (error) {
    console.error("Pesapal Get Status Error:", error);
    throw error;
  }
};

module.exports = {
  getAuthToken,
  registerIPN,
  submitOrder,
  getTransactionStatus,
  PESAPAL_ENV
};
