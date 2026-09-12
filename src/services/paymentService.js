/**
 * Payment orchestration.
 *
 * Flow:
 *   1. createOrder() -> backend creates the payment order
 *   2. checkoutAndVerify() -> demo simulation calls backend verification
 *   3. verify() -> backend changes payment/application status
 */
import * as api from './api.js';

export const createOrder = (applicationId) => {
  return api.createPaymentOrder(applicationId);
};

/**
 * Demo payment flow.
 *
 * @param {object} order
 * @param {'success'|'failure'} outcome
 * @returns {Promise<{verified:boolean, application:object}>}
 */
export async function checkoutAndVerify(order, outcome = 'success') {
  const gatewayPaymentId =
    `demo_pay_${Math.random().toString(36).slice(2, 12)}`;

  return api.verifyPayment(
    order.orderId,
    {
      gatewayPaymentId,
      outcome
    }
  );
}

export const getPayment = (paymentId) => {
  return api.getPayment(paymentId);
};