
import type { Database } from '@/integrations/supabase/types';
import { BulkActionHeader } from './BulkActions/BulkActionHeader';
import { BulkActionButtons } from './BulkActions/BulkActionButtons';

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];

interface BulkActionsProps {
  submissions: FormSubmission[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onBulkUpdate: () => void;
}

export const BulkActions = ({ submissions, selectedIds, onSelectionChange, onBulkUpdate }: BulkActionsProps) => {
  if (submissions.length === 0) return null;

  const selectedSubmissions = submissions.filter(submission => 
    selectedIds.includes(submission.id)
  );

  return (
    <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
      <BulkActionHeader
        submissions={submissions}
        selectedIds={selectedIds}
        onSelectionChange={onSelectionChange}
      />
      
      <BulkActionButtons
        selectedIds={selectedIds}
        selectedSubmissions={selectedSubmissions}
        onSelectionChange={onSelectionChange}
        onBulkUpdate={onBulkUpdate}
      />
    </div>
  );
};
