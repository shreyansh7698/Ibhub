import { motion } from 'framer-motion';
import { FileStack, Clock3, FileWarning, BadgeCheck, Loader, CheckCheck, XCircle, CalendarDays, IndianRupee } from 'lucide-react';
import Odometer from '../../motion/Odometer.jsx';

const CARDS = [
  { key: 'total', label: 'Total applications', icon: FileStack },
  { key: 'pendingReview', label: 'Pending review', icon: Clock3 },
  { key: 'documentsPending', label: 'Documents pending', icon: FileWarning },
  { key: 'paid', label: 'Paid applications', icon: BadgeCheck },
  { key: 'processing', label: 'Under processing', icon: Loader },
  { key: 'approved', label: 'Approved', icon: CheckCheck },
  { key: 'rejected', label: 'Rejected', icon: XCircle },
  { key: 'today', label: "Today's applications", icon: CalendarDays }
];

export default function DashboardCards({ stats }) {
  if (!stats) return <div className="dash-cards dash-cards--loading" aria-busy="true" />;
  return (
    <div className="dash-cards">
      {CARDS.map((c, i) => {
        const Icon = c.icon;
        return (
          <motion.div
            key={c.key}
            className="dash-card"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.04, duration: 0.35 }}
          >
            <span className="dash-card__icon" aria-hidden="true">
              <Icon />
            </span>
            <Odometer value={stats[c.key] ?? 0} className="dash-card__value" />
            <span className="dash-card__label">{c.label}</span>
          </motion.div>
        );
      })}
      <motion.div
        className="dash-card dash-card--revenue"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: CARDS.length * 0.04, duration: 0.35 }}
      >
        <span className="dash-card__icon" aria-hidden="true">
          <IndianRupee />
        </span>
        <Odometer value={stats.revenue ?? 0} prefix="₹ " className="dash-card__value" />
        <span className="dash-card__label">Revenue (paid)</span>
      </motion.div>
    </div>
  );
}
