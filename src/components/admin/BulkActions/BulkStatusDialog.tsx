
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { CheckSquare } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type LeadStatus = Database['public']['Enums']['lead_status'];

interface BulkStatusDialogProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onBulkUpdate: () => void;
}

export const BulkStatusDialog = ({ selectedIds, onSelectionChange, onBulkUpdate }: BulkStatusDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [bulkStatus, setBulkStatus] = useState<string>('new');
  const [isUpdating, setIsUpdating] = useState(false);
  const { toast } = useToast();

  const handleBulkStatusUpdate = async () => {
    setIsUpdating(true);
    try {
      const updateData: any = { status: bulkStatus };
      
      // Update contacted_at for survey_booked status
      if (bulkStatus === 'survey_booked') {
        updateData.contacted_at = new Date().toISOString();
      }

      const { error } = await supabase
        .from('form_submissions')
        .update(updateData)
        .in('id', selectedIds);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Updated ${selectedIds.length} submissions to ${bulkStatus}`,
      });

      setIsOpen(false);
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
          <CheckSquare className="w-4 h-4 mr-2" />
          Update Status
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Update Status for {selectedIds.length} submissions</DialogTitle>
          <DialogDescription>
            This will update the status for all selected submissions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>New Status</Label>
            <Select value={bulkStatus} onValueChange={(value: string) => setBulkStatus(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="survey_booked">Survey Booked</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="doesnt_qualify">Doesn't Qualify</SelectItem>
                <SelectItem value="no_contact">No Contact</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkStatusUpdate} disabled={isUpdating}>
              {isUpdating ? 'Updating...' : 'Update Status'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
