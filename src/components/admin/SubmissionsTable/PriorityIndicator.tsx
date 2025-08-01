
interface PriorityIndicatorProps {
  priority: 'urgent' | 'high' | 'normal';
}

export const PriorityIndicator = ({ priority }: PriorityIndicatorProps) => {
  if (priority === 'urgent') {
    return (
      <div className="text-xs text-red-600 font-medium mt-1">
        🔥 URGENT
      </div>
    );
  }
  
  if (priority === 'high') {
    return (
      <div className="text-xs text-orange-600 font-medium mt-1">
        ⚡ HIGH PRIORITY
      </div>
    );
  }
  
  return null;
};
