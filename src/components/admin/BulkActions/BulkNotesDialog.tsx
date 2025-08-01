
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

interface BulkNotesDialogProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onBulkUpdate: () => void;
}

export const BulkNotesDialog = ({ selectedIds, onSelectionChange, onBulkUpdate }: BulkNotesDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bulkNotes, setBulkNotes] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleBulkNotesUpdate = async () => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('form_submissions')
        .update({ admin_notes: bulkNotes })
        .in('id', selectedIds);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Added notes to ${selectedIds.length} submissions`,
      });

      setIsOpen(false);
      setBulkNotes('');
      onSelectionChange([]);
      onBulkUpdate();
    } catch (error) {
      console.error('Error updating submissions:', error);
      toast({
        title: "Error",
        description: "Failed to update submissions",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <FileText className="w-4 h-4 mr-2" />
          Add Notes
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Notes to {selectedIds.length} submissions</DialogTitle>
          <DialogDescription>
            This will add the same note to all selected submissions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Notes</Label>
            <Textarea
              value={bulkNotes}
              onChange={(e) => setBulkNotes(e.target.value)}
              placeholder="Enter notes to add to selected submissions..."
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkNotesUpdate} disabled={isUpdating || !bulkNotes.trim()}>
              {isUpdating ? 'Adding...' : 'Add Notes'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
