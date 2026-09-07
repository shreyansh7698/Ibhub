/**
 * Payment orchestration.
 *
 * The frontend NEVER decides that a payment succeeded and NEVER collects card /
 * CVV / UPI PIN / OTP. Flow:
 *   1. createOrder()  -> backend creates the order and returns the amount it computed
 *   2. checkout()     -> production: open the gateway's official SDK/checkout
 *                        demo: a labelled panel with "simulate success/failure"
 *   3. verify()       -> backend verifies with the gateway and returns the
 *                        application, now PAID (or not)
 */
import * as api from './api.js';
import { isMock } from './api.js';

export const createOrder = (applicationId) => api.createPaymentOrder(applicationId);

/**
 * @param {object} order  from createOrder()
 * @param {'success'|'failure'} outcome  demo only — chosen in the DemoCheckout panel
 * @returns {Promise<{verified:boolean, application:object}>}
 */
export async function checkoutAndVerify(order, outcome = 'success') {
  if (isMock) {
    // Demo: no gateway, no credentials. Stand-in for gateway callback + server verify.
    const gatewayPaymentId = `demo_pay_${Math.random().toString(36).slice(2, 12)}`;
    return api.verifyPayment(order.orderId, { gatewayPaymentId, outcome });
  }
  // Production: load the gateway SDK (e.g. Razorpay/Stripe), open checkout,
  // then call verify with the gateway's payment id + signature. Left as an
  // integration point.
  throw new Error('Live payment gateway not configured. Set VITE_USE_MOCK_API=true for the demo.');
}

export const getPayment = (paymentId) => api.getPayment(paymentId);
