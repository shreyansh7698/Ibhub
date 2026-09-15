import { Check } from 'lucide-react';

/**
 * Renders a list of strings with a check icon per item.
 */
export default function CheckList({ items, className = '' }) {
  return (
    <ul className={`check-list ${className}`}>
      {items.map((item) => (
        <li key={item}>
          <Check aria-hidden="true" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
