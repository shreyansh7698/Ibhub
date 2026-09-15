import { Star } from 'lucide-react';

const initials = (name) =>
  name
    .split(' ')
    .map((n) => n[0])
    .slice(0, 2)
    .join('');

export default function TestimonialCard({ item }) {
  return (
    <article className="tcard">
      <div className="tcard__stars" aria-label={`Rated ${item.rating} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => (
          <Star key={i} aria-hidden="true" style={{ opacity: i < item.rating ? 1 : 0.25 }} />
        ))}
      </div>
      <p className="tcard__quote">“{item.quote}”</p>
      <div className="tcard__person">
        <span className="tcard__avatar" aria-hidden="true">
          {initials(item.name)}
        </span>
        <div>
          <div className="tcard__name">{item.name}</div>
          <div className="tcard__meta">
            {item.country} · {item.service}
          </div>
        </div>
      </div>
    </article>
  );
}
