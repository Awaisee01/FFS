
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];

interface EmailIntegrationProps {
  submission: FormSubmission;
  onEmailSent?: () => void;
}

export const EmailIntegration = ({ submission, onEmailSent }: EmailIntegrationProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [subject, setSubject] = useState(`Re: Your ${submission.service_type} enquiry`);
  const [message, setMessage] = useState(`Dear ${submission.name},\n\nThank you for your enquiry about our ${submission.service_type} services. We've received your details and would like to discuss how we can help you.\n\nBest regards,\nFunding For Scotland Team`);
  const [isSending, setIsSending] = useState(false);
  const { toast } = useToast();

  const handleSendEmail = async () => {
    if (!submission.email) {
      toast({
        title: "Error",
        description: "No email address available for this submission",
        variant: "destructive",
      });
      return;
    }

    setIsSending(true);
    try {
      // In a real implementation, you would call your email service here
      // For now, we'll simulate sending an email
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast({
        title: "Email Sent",
        description: `Email sent successfully to ${submission.email}`,
      });
      
      setIsOpen(false);
      onEmailSent?.();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to send email. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSending(false);
    }
  };

  if (!submission.email) {
    return (
      <Button variant="outline" size="sm" disabled>
        <Mail className="w-4 h-4 mr-1" />
        No Email
      </Button>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Mail className="w-4 h-4 mr-1" />
          Email
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Send Email to {submission.name}</DialogTitle>
          <DialogDescription>
            Compose an email to {submission.email}
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="subject">Subject</Label>
            <Input
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
            />
          </div>
          <div>
            <Label htmlFor="message">Message</Label>
            <Textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              rows={10}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSendEmail} disabled={isSending}>
              {isSending ? 'Sending...' : 'Send Email'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
