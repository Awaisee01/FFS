
import { Badge } from '@/components/ui/badge';
import type { Database } from '@/integrations/supabase/types';

type LeadStatus = Database['public']['Enums']['lead_status'];

interface LeadStatusBadgeProps {
  status: string;
  size?: 'sm' | 'default' | 'lg';
}

export const LeadStatusBadge = ({ status, size = 'default' }: LeadStatusBadgeProps) => {
  const getStatusConfig = (status: string) => {
    const configs: Record<string, { color: string; label: string; priority: number }> = {
      new: { 
        color: 'bg-blue-100 text-blue-800 border-blue-200', 
        label: 'New',
        priority: 1 
      },
      survey_booked: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        label: 'Survey Booked',
        priority: 2 
      },
      lost: { 
        color: 'bg-red-100 text-red-800 border-red-200', 
        label: 'Lost',
        priority: 0 
      },
      doesnt_qualify: { 
        color: 'bg-orange-100 text-orange-800 border-orange-200', 
        label: "Doesn't Qualify",
        priority: 3 
      },
      no_contact: { 
        color: 'bg-gray-100 text-gray-800 border-gray-200', 
        label: 'No Contact',
        priority: 4 
      },
      // Legacy status support
      contacted: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        label: 'Contacted',
        priority: 2 
      },
      qualified: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        label: 'Qualified',
        priority: 2 
      },
      converted: { 
        color: 'bg-green-100 text-green-800 border-green-200', 
        label: 'Converted',
        priority: 2 
      },
      closed: { 
        color: 'bg-gray-100 text-gray-800 border-gray-200', 
        label: 'Closed',
        priority: 4 
      }
    };
    
    return configs[status] || configs.new;
  };

  const config = getStatusConfig(status);
  
  // Apply size-specific styling via className instead of size prop
  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5',
    default: 'text-xs px-2.5 py-0.5',
    lg: 'text-sm px-3 py-1'
  };
  
  return (
    <Badge 
      variant="outline" 
      className={`${config.color} font-medium ${sizeClasses[size]}`}
    >
      {config.label}
    </Badge>
  );
};
