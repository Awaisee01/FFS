
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { Database } from '@/integrations/supabase/types';

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];

interface BulkEmailDialogProps {
  selectedSubmissions: FormSubmission[];
  onSelectionChange: (ids: string[]) => void;
  onBulkUpdate: () => void;
}

export const BulkEmailDialog = ({ selectedSubmissions, onSelectionChange, onBulkUpdate }: BulkEmailDialogProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState('');
  const [message, setMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleBulkEmail = async () => {
    if (!subject.trim() || !message.trim()) {
      toast({
        title: "Error",
        description: "Subject and message are required",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      const emailPromises = selectedSubmissions
        .filter(submission => submission.email)
        .map(submission => 
          supabase.functions.invoke('send-bulk-email', {
            body: {
              to: submission.email,
              subject,
              message,
              submissionId: submission.id
            }
          })
        );

      await Promise.all(emailPromises);

      // Update submission status to contacted
      const submissionIds = selectedSubmissions.map(s => s.id);
      const { error } = await supabase
        .from('form_submissions')
        .update({ 
          status: 'contacted',
          contacted_at: new Date().toISOString()
        })
        .in('id', submissionIds);

      if (error) throw error;

      toast({
        title: "Success",
        description: `Sent emails to ${selectedSubmissions.filter(s => s.email).length} recipients`,
      });

      setIsOpen(false);
      setSubject('');
      setMessage('');
      onSelectionChange([]);
      onBulkUpdate();
    } catch (error) {
      console.error('Error sending bulk emails:', error);
      toast({
        title: "Error",
        description: "Failed to send bulk emails",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  const recipientCount = selectedSubmissions.filter(s => s.email).length;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" disabled={recipientCount === 0}>
          <Mail className="w-4 h-4 mr-2" />
          Send Email ({recipientCount})
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Bulk Email</DialogTitle>
          <DialogDescription>
            Send an email to {recipientCount} selected submissions with email addresses.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Enter email subject..."
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your message..."
              rows={8}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleBulkEmail} disabled={isSending || !subject.trim() || !message.trim()}>
              {isSending ? 'Sending...' : `Send to ${recipientCount} Recipients`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
