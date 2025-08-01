
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Mail, Loader2 } from 'lucide-react';

export const TestEmailButton = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleTestEmail = async () => {
    setIsLoading(true);
    
    try {
      console.log('Testing form submission notification...');
      
      // Test by inserting a test form submission which will trigger the notification
      const { data, error } = await supabase
        .from('form_submissions')
        .insert({
          service_type: 'eco4',
          name: 'TEST NOTIFICATION',
          email: 'test@example.com',
          phone: '07777777777',
          postcode: 'TEST123',
          page_path: '/admin-test',
          form_data: {
            source: 'admin_test_notification',
            note: 'This is a test notification from admin dashboard'
          }
        })
        .select()
        .single();
      
      if (error) {
        console.error('Test submission error:', error);
        throw error;
      }
      
      console.log('Test submission created:', data);
      
      toast({
        title: "Test Notification Triggered!",
        description: "A test form submission was created. Check your inbox at info@fundingforscotland.co.uk for the notification.",
      });
      
    } catch (error) {
      console.error('Failed to send test notification:', error);
      toast({
        title: "Test Failed",
        description: "There was an error creating the test submission. Check the console for details.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      onClick={handleTestEmail}
      disabled={isLoading}
      variant="outline"
      size="sm"
      className="flex items-center gap-2"
    >
      {isLoading ? (
        <Loader2 className="h-4 w-4 animate-spin" />
      ) : (
        <Mail className="h-4 w-4" />
      )}
      {isLoading ? 'Testing...' : 'Test Form Notification'}
    </Button>
  );
};
