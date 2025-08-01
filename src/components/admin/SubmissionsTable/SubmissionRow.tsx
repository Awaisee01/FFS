
import { Checkbox } from '@/components/ui/checkbox';
import { TableCell, TableRow } from '@/components/ui/table';
import { LeadStatusBadge } from '../LeadStatusBadge';
import { LeadActions } from '../LeadActions';
import { ContactInfo } from './ContactInfo';
import { PriorityIndicator } from './PriorityIndicator';
import type { Database } from '@/integrations/supabase/types';

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];

interface SubmissionRowProps {
  submission: FormSubmission;
  isSelected: boolean;
  onSelect: (id: string, checked: boolean) => void;
  onViewDetails: (submission: FormSubmission) => void;
  onStatusUpdate: (submissionId: string, status: string) => void;
  onDelete?: (submissionId: string) => void;
}

export const SubmissionRow = ({
  submission,
  isSelected,
  onSelect,
  onViewDetails,
  onStatusUpdate,
  onDelete
}: SubmissionRowProps) => {
  const formatServiceType = (serviceType: string) => {
    const formatted = {
      eco4: 'ECO4',
      solar: 'Solar',
      gas_boilers: 'Gas Boilers',
      home_improvements: 'Home Improvements'
    };
    return formatted[serviceType as keyof typeof formatted] || serviceType;
  };

  const getRowPriority = (submission: FormSubmission) => {
    const hoursSinceCreated = (Date.now() - new Date(submission.created_at).getTime()) / (1000 * 60 * 60);
    
    if (submission.status === 'new' && hoursSinceCreated < 2) {
      return 'urgent';
    }
    if (submission.status === 'new' && hoursSinceCreated < 24) {
      return 'high';
    }
    return 'normal';
  };

  const getPriorityClasses = (priority: string) => {
    switch (priority) {
      case 'urgent':
        return 'bg-red-50 border-l-4 border-l-red-500';
      case 'high':
        return 'bg-orange-50 border-l-4 border-l-orange-500';
      default:
        return '';
    }
  };

  const priority = getRowPriority(submission);
  const priorityClasses = getPriorityClasses(priority);

  return (
    <TableRow 
      className={`${priorityClasses} ${priority === 'urgent' ? 'animate-pulse' : ''}`}
    >
      <TableCell>
        <Checkbox
          checked={isSelected}
          onCheckedChange={(checked) => onSelect(submission.id, checked as boolean)}
        />
      </TableCell>
      <TableCell>
        <ContactInfo submission={submission} />
      </TableCell>
      <TableCell>
        <div className="font-medium">
          {formatServiceType(submission.service_type)}
        </div>
      </TableCell>
      <TableCell>
        <LeadStatusBadge status={submission.status} />
        <PriorityIndicator priority={priority as 'urgent' | 'high' | 'normal'} />
      </TableCell>
      <TableCell>
        <div className="text-sm">
          <div className="font-medium">
            {new Date(submission.created_at).toLocaleDateString('en-GB')}
          </div>
          <div className="text-gray-500">
            {new Date(submission.created_at).toLocaleTimeString('en-GB', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <LeadActions
          submission={submission}
          onViewDetails={onViewDetails}
          onStatusUpdate={onStatusUpdate}
          onDelete={onDelete}
        />
      </TableCell>
    </TableRow>
  );
};
