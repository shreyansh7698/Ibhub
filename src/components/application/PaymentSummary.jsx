import { formatMoney } from '../../data/touristVisas.js';

/**
 * Fee breakdown. `breakdown` + `currency` come from the server-created order
 * (or, before an order exists, from the selected visa type for display only —
 * the backend recomputes and is authoritative).
 */
export default function PaymentSummary({ breakdown, currency = 'INR', heading = 'Payment summary', muted }) {
  const { visaFee = 0, serviceFee = 0, tax = 0 } = breakdown || {};
  const total = visaFee + serviceFee + tax;
  const rows = [
    ['Visa application fee', visaFee],
    ['IBHUB service fee', serviceFee],
    ['Taxes', tax]
  ];
  return (
    <div className={`pay-summary ${muted ? 'pay-summary--muted' : ''}`}>
      <h3>{heading}</h3>
      <dl>
        {rows.map(([label, amt]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{formatMoney(amt, currency)}</dd>
          </div>
        ))}
        <div className="pay-summary__total">
          <dt>Total payable</dt>
          <dd>{formatMoney(total, currency)}</dd>
        </div>
      </dl>
      <p className="pay-summary__note">
        Fees are confirmed by IBHUB when your order is created. Payment confirms submission of your
        application — it does not guarantee visa approval.
      </p>
    </div>
  );
}
