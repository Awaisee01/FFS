
import { Button } from '@/components/ui/button';
import { BulkStatusDialog } from './BulkStatusDialog';
import { BulkNotesDialog } from './BulkNotesDialog';
import { BulkDeleteDialog } from './BulkDeleteDialog';
import { BulkEmailDialog } from '../BulkEmailDialog';
import { WorkflowTrigger } from '../WorkflowTrigger';
import { ConfirmationDialog } from '../ConfirmationDialog';
import { useState } from 'react';
import type { Database } from '@/integrations/supabase/types';

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];

interface BulkActionButtonsProps {
  selectedIds: string[];
  selectedSubmissions: FormSubmission[];
  onSelectionChange: (ids: string[]) => void;
  onBulkUpdate: () => void;
}

export const BulkActionButtons = ({ 
  selectedIds, 
  selectedSubmissions,
  onSelectionChange, 
  onBulkUpdate 
}: BulkActionButtonsProps) => {
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  if (selectedIds.length === 0) return null;

  const handleClearSelection = () => {
    onSelectionChange([]);
    setShowClearConfirm(false);
  };

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <BulkStatusDialog
        selectedIds={selectedIds}
        onSelectionChange={onSelectionChange}
        onBulkUpdate={onBulkUpdate}
      />
      
      <BulkNotesDialog
        selectedIds={selectedIds}
        onSelectionChange={onSelectionChange}
        onBulkUpdate={onBulkUpdate}
      />

      <BulkEmailDialog
        selectedSubmissions={selectedSubmissions}
        onSelectionChange={onSelectionChange}
        onBulkUpdate={onBulkUpdate}
      />

      <WorkflowTrigger
        selectedIds={selectedIds}
        onSelectionChange={onSelectionChange}
        onBulkUpdate={onBulkUpdate}
      />

      <BulkDeleteDialog
        selectedIds={selectedIds}
        onSelectionChange={onSelectionChange}
        onBulkUpdate={onBulkUpdate}
      />

      <Button
        variant="outline"
        size="sm"
        onClick={() => setShowClearConfirm(true)}
      >
        Clear Selection
      </Button>

      <ConfirmationDialog
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={handleClearSelection}
        title="Clear Selection"
        description={`Are you sure you want to clear the selection of ${selectedIds.length} items?`}
        confirmText="Clear"
        cancelText="Keep Selection"
      />
    </div>
  );
};
