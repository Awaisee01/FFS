
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Zap } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type LeadStatus = Database['public']['Enums']['lead_status'];

interface WorkflowTriggerProps {
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
  onBulkUpdate: () => void;
}

export const WorkflowTrigger = ({ selectedIds, onSelectionChange, onBulkUpdate }: WorkflowTriggerProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [workflowType, setWorkflowType] = useState<string>('');
  const [isExecuting, setIsExecuting] = useState(false);
  const { toast } = useToast();

  const workflowOptions = [
    { value: 'follow-up-sequence', label: 'Follow-up Email Sequence' },
    { value: 'qualification-check', label: 'Qualification Assessment' },
    { value: 'appointment-booking', label: 'Appointment Booking' },
    { value: 'document-request', label: 'Document Request' }
  ];

  const handleExecuteWorkflow = async () => {
    if (!workflowType) {
      toast({
        title: "Error",
        description: "Please select a workflow type",
        variant: "destructive",
      });
      return;
    }

    setIsExecuting(true);
    try {
      const { error } = await supabase.functions.invoke('execute-workflow', {
        body: {
          workflowType,
          submissionIds: selectedIds
        }
      });

      if (error) throw error;

      // Update submissions based on workflow type
      let statusUpdate: LeadStatus = 'contacted';
      if (workflowType === 'qualification-check') statusUpdate = 'qualified';

      await supabase
        .from('form_submissions')
        .update({ 
          status: statusUpdate,
          admin_notes: `Automated workflow: ${workflowOptions.find(w => w.value === workflowType)?.label} executed`
        })
        .in('id', selectedIds);

      toast({
        title: "Success",
        description: `Workflow executed for ${selectedIds.length} submissions`,
      });

      setIsOpen(false);
      setWorkflowType('');
      onSelectionChange([]);
      onBulkUpdate();
    } catch (error) {
      console.error('Error executing workflow:', error);
      toast({
        title: "Error",
        description: "Failed to execute workflow",
        variant: "destructive",
      });
    } finally {
      setIsExecuting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={selectedIds.length === 0}>
          <Zap className="w-4 h-4 mr-2" />
          Trigger Workflow
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Execute Automated Workflow</DialogTitle>
          <DialogDescription>
            Select a workflow to execute for {selectedIds.length} selected submissions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Workflow Type</Label>
            <Select value={workflowType} onValueChange={setWorkflowType}>
              <SelectTrigger>
                <SelectValue placeholder="Select workflow..." />
              </SelectTrigger>
              <SelectContent>
                {workflowOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleExecuteWorkflow} disabled={isExecuting || !workflowType}>
              {isExecuting ? 'Executing...' : 'Execute Workflow'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
