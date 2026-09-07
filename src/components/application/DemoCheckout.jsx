import { useState } from 'react';
import { motion } from 'framer-motion';
import { ShieldCheck, CreditCard, XCircle } from 'lucide-react';
import { formatMoney } from '../../data/touristVisas.js';
import { LoadingDots } from '../../motion/feedback.jsx';

/**
 * Stand-in for a payment gateway checkout.
 *
 * It deliberately collects NO card / CVV / UPI / OTP data. In production this
 * component is replaced by the gateway's official SDK/checkout; the "Simulate"
 * buttons here represent the gateway callback, after which the backend verifies
 * and marks the application PAID.
 */
export default function DemoCheckout({ order, onResult, onCancel }) {
  const [running, setRunning] = useState(null); // 'success' | 'failure' | null

  const run = async (outcome) => {
    setRunning(outcome);
    await onResult(outcome);
    setRunning(null);
  };

  return (
    <motion.div
      className="checkout"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="checkout__brand">
        <CreditCard aria-hidden="true" />
        <span>Secure payment</span>
      </div>

      <p className="checkout__amount">
        Amount to pay <strong>{formatMoney(order.amount, order.currency)}</strong>
      </p>
      <p className="checkout__order">Order {order.orderId}</p>

      <div className="checkout__demo-note">
        <ShieldCheck aria-hidden="true" />
        <p>
          <strong>Demo checkout.</strong> No real gateway and no card details are collected here. In
          production this opens the payment provider's official checkout; your bank credentials are
          entered there, never in IBHUB. After payment, IBHUB's server verifies it before your
          application is marked paid.
        </p>
      </div>

      <div className="checkout__actions">
        <button type="button" className="btn btn--coral btn--lg" disabled={running} onClick={() => run('success')}>
          {running === 'success' ? (
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}>
              <LoadingDots color="#fff" /> Verifying payment…
            </span>
          ) : (
            'Simulate successful payment'
          )}
        </button>
        <button type="button" className="btn btn--outline" disabled={running} onClick={() => run('failure')}>
          <XCircle aria-hidden="true" /> Simulate failure
        </button>
        <button type="button" className="checkout__cancel" disabled={running} onClick={onCancel}>
          Back to review
        </button>
      </div>
    </motion.div>
  );
}
