import { LucideIcon } from 'lucide-react';

interface AnalyticsCardProps {
  title: string;
  value: number;
  icon: LucideIcon;
  color: string;
  change?: string;
}

export function AnalyticsCard({ title, value, icon: Icon, color, change }: AnalyticsCardProps) {
  return (
    <div className="rounded-2xl border bg-card p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center"
          style={{ backgroundColor: color + '18' }}>
          <Icon className="w-5 h-5" style={{ color }} />
        </div>
        {change && (
          <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
            change.startsWith('+') ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
            : change === '0%' ? 'bg-muted text-muted-foreground' : 'bg-red-100 text-red-700'
          }`}>
            {change}
          </span>
        )}
      </div>
      <div className="text-3xl font-black mb-1" style={{ color }}>
        {value.toLocaleString()}
      </div>
      <div className="text-sm text-muted-foreground font-medium">{title}</div>
    </div>
  );
}
