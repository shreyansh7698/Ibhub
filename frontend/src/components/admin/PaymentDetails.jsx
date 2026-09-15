import { formatMoney } from '../../data/touristVisas.js';

const fmt = (iso) => (iso ? new Date(iso).toLocaleString(undefined, { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '—');

export default function PaymentDetails({ payment }) {
  if (!payment) {
    return <p className="admin-empty">No payment has been created for this application yet.</p>;
  }
  const rows = [
    ['Order ID', payment.orderId],
    ['Payment ID', payment.paymentId || '—'],
    ['Gateway', payment.gateway === 'demo' ? 'Demo (no real gateway)' : payment.gateway],
    ['Payment reference', payment.reference || '—'],
    ['Amount', `${formatMoney(payment.amount, payment.currency)}`],
    ['Currency', payment.currency],
    ['Paid at', fmt(payment.paidAt)],
    ['Status', payment.status]
  ];
  return (
    <div className="pay-details">
      <dl className="review__grid">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt>{k}</dt>
            <dd>{v}</dd>
          </div>
        ))}
      </dl>
      {payment.breakdown && (
        <p className="pay-details__breakdown">
          Visa fee {formatMoney(payment.breakdown.visaFee, payment.currency)} · Service fee{' '}
          {formatMoney(payment.breakdown.serviceFee, payment.currency)} · Taxes{' '}
          {formatMoney(payment.breakdown.tax, payment.currency)}
        </p>
      )}
      <p className="pay-details__note">
        Only order and payment identifiers and status are stored. Card numbers, CVV, UPI PINs, banking
        passwords and OTPs are never collected, transmitted or stored by IBHUB.
      </p>
    </div>
  );
}
