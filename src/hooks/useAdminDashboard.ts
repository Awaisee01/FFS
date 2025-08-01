
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];
type LeadStatus = Database['public']['Enums']['lead_status'];

// Admin session validation hook
const useAdminAuth = () => {
  const [isValidating, setIsValidating] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { toast } = useToast();

  const validateSession = async () => {
    try {
      const sessionToken = localStorage.getItem('adminSessionToken');
      
      if (!sessionToken) {
        setIsAuthenticated(false);
        setIsValidating(false);
        return false;
      }

      const { data, error } = await supabase.functions.invoke('validate-admin-session', {
        body: { session_token: sessionToken }
      });

      if (error || !data?.valid) {
        // Clear invalid session
        localStorage.removeItem('adminSessionToken');
        localStorage.removeItem('adminId');
        localStorage.removeItem('adminEmail');
        localStorage.removeItem('adminAuthenticated');
        localStorage.removeItem('adminAuthTime');
        
        setIsAuthenticated(false);
        toast({
          title: "Session Expired",
          description: "Please log in again to continue.",
          variant: "destructive",
        });
        return false;
      }

      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Session validation error:', error);
      setIsAuthenticated(false);
      return false;
    } finally {
      setIsValidating(false);
    }
  };

  useEffect(() => {
    validateSession();
  }, []);

  return { isAuthenticated, isValidating, validateSession };
};

export const useAdminDashboard = () => {
  const [submissions, setSubmissions] = useState<FormSubmission[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();
  const { isAuthenticated, isValidating, validateSession } = useAdminAuth();

  const fetchSubmissions = async () => {
    try {
      // Validate session before any database operations
      const sessionValid = await validateSession();
      if (!sessionValid) {
        throw new Error('Admin authentication required');
      }

      // Use the admin edge function to get all submissions
      const { data, error } = await supabase.functions.invoke('get-admin-submissions', {
        body: { 
          session_token: localStorage.getItem('adminSessionToken') 
        }
      });

      if (error) throw error;
      setSubmissions(data?.submissions || []);
    } catch (error) {
      console.error('Error fetching submissions:', error);
      toast({
        title: "Error",
        description: "Failed to fetch form submissions. Please check your authentication.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const updateSubmission = async (
    id: string, 
    updates: { 
      status?: string; 
      admin_notes?: string;
      property_type?: string;
      property_ownership?: string;
      current_heating_system?: string;
      epc_score?: string;
    }
  ) => {
    console.log('📝 updateSubmission called with:', { id, updates });
    try {
      // Validate session before any database operations
      const sessionValid = await validateSession();
      if (!sessionValid) {
        throw new Error('Admin authentication required');
      }

      // Input sanitization
      const sanitizedUpdates: any = {};
      Object.entries(updates).forEach(([key, value]) => {
        if (value !== undefined) {
          // Basic sanitization - remove potential XSS
          sanitizedUpdates[key] = typeof value === 'string' 
            ? value.trim().replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
            : value;
        }
      });
      
      // Update contacted_at for survey_booked status
      if (sanitizedUpdates.status === 'survey_booked') {
        sanitizedUpdates.contacted_at = new Date().toISOString();
      }

      console.log('📤 About to update submission via edge function:', sanitizedUpdates);
      
      const sessionToken = localStorage.getItem('adminSessionToken');
      if (!sessionToken) {
        throw new Error('No session token found');
      }
      
      // Use edge function for update to bypass RLS issues
      const { data, error } = await supabase.functions.invoke('update-admin-submission', {
        body: {
          session_token: sessionToken,
          submission_id: id,
          updates: sanitizedUpdates
        }
      });

      console.log('🔄 Edge function update result:', { data, error });
      
      if (error) {
        console.error('💥 Edge function error:', error);
        throw new Error(error.message || 'Failed to update submission');
      }
      
      if (!data?.success) {
        throw new Error(data?.error || 'Update failed');
      }

      await fetchSubmissions();
      
      toast({
        title: "Success",
        description: "Submission updated successfully",
      });
    } catch (error) {
      console.error('Error updating submission:', error);
      toast({
        title: "Error",
        description: "Failed to update submission",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (isAuthenticated && !isValidating) {
      fetchSubmissions();
    }
  }, [isAuthenticated, isValidating]);

  return {
    submissions,
    loading: loading || isValidating,
    isAuthenticated,
    fetchSubmissions,
    updateSubmission
  };
};
