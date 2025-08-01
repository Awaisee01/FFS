
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreHorizontal, Eye, Mail, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { ConfirmationDialog } from './ConfirmationDialog';
import type { Database } from '@/integrations/supabase/types';

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];

interface LeadActionsProps {
  submission: FormSubmission;
  onViewDetails: (submission: FormSubmission) => void;
  onStatusUpdate: (submissionId: string, status: string) => void;
  onDelete?: (submissionId: string) => void;
}

export const LeadActions = ({ 
  submission, 
  onViewDetails, 
  onStatusUpdate,
  onDelete 
}: LeadActionsProps) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const handleDelete = () => {
    if (onDelete) {
      onDelete(submission.id);
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onViewDetails(submission)}>
            <Eye className="mr-2 h-4 w-4" />
            View Details
          </DropdownMenuItem>
          {submission.email && (
            <DropdownMenuItem 
              onClick={() => window.open(`mailto:${submission.email}`, '_blank')}
            >
              <Mail className="mr-2 h-4 w-4" />
              Send Email
            </DropdownMenuItem>
          )}
          <DropdownMenuItem 
            onClick={() => setShowDeleteConfirm(true)}
            className="text-red-600 focus:text-red-600"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <ConfirmationDialog
        isOpen={showDeleteConfirm}
        onClose={() => setShowDeleteConfirm(false)}
        onConfirm={handleDelete}
        title="Delete Enquiry"
        description="Are you sure you want to delete this enquiry? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        variant="destructive"
      />
    </>
  );
};
