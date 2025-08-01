
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Trash2 } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface BulkDeleteDialogProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onBulkUpdate: () => void;
}

export const BulkDeleteDialog = ({ selectedIds, onSelectionChange, onBulkUpdate }: BulkDeleteDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleBulkDelete = async () => {
    if (selectedIds.length === 0) return;

    setIsLoading(true);
    try {
      const sessionToken = localStorage.getItem('adminSessionToken');
      if (!sessionToken) {
        throw new Error('No session token found');
      }

      const { data, error } = await supabase.functions.invoke('bulk-delete-submissions', {
        body: {
          session_token: sessionToken,
          submission_ids: selectedIds
        }
      });

      if (error) throw error;

      if (!data?.success) {
        throw new Error(data?.error || 'Delete failed');
      }

      toast({
        title: "Success",
        description: `Successfully deleted ${selectedIds.length} enquir${selectedIds.length === 1 ? 'y' : 'ies'}`,
      });

      onSelectionChange([]);
      onBulkUpdate();
      setIsOpen(false);
    } catch (error) {
      console.error('Error deleting submissions:', error);
      toast({
        title: "Error",
        description: "Failed to delete enquiries",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="destructive" size="sm">
          <Trash2 className="w-4 h-4 mr-2" />
          Delete ({selectedIds.length})
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Enquiries</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete {selectedIds.length} selected enquir{selectedIds.length === 1 ? 'y' : 'ies'}? 
            This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={() => setIsOpen(false)} disabled={isLoading}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleBulkDelete} disabled={isLoading}>
            {isLoading ? 'Deleting...' : `Delete ${selectedIds.length} Enquir${selectedIds.length === 1 ? 'y' : 'ies'}`}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
