
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { parse } from 'papaparse';
import type { Database } from '@/integrations/supabase/types';

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];

interface ExportControlsProps {
  submissions: FormSubmission[];
  filteredSubmissions: FormSubmission[];
}

export const ExportControls = ({ submissions, filteredSubmissions }: ExportControlsProps) => {
  const exportToCSV = (data: FormSubmission[], filename: string) => {
    const csvData = data.map(submission => ({
      Name: submission.name,
      Email: submission.email || '',
      Phone: submission.phone || '',
      Postcode: submission.postcode || '',
      Service: submission.service_type,
      Status: submission.status,
      'Property Type': submission.property_type || '',
      'Property Ownership': submission.property_ownership || '',
      'Heating System': submission.current_heating_system || '',
      'Admin Notes': submission.admin_notes || '',
      'Created Date': new Date(submission.created_at).toLocaleDateString(),
      'Contacted Date': submission.contacted_at ? new Date(submission.contacted_at).toLocaleDateString() : '',
      'Converted Date': submission.converted_at ? new Date(submission.converted_at).toLocaleDateString() : '',
      'UTM Source': submission.utm_source || '',
      'UTM Medium': submission.utm_medium || '',
      'UTM Campaign': submission.utm_campaign || '',
    }));

    const csv = [
      Object.keys(csvData[0] || {}).join(','),
      ...csvData.map(row => Object.values(row).map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportToCSV(filteredSubmissions, `filtered-leads-${new Date().toISOString().split('T')[0]}.csv`)}
        disabled={filteredSubmissions.length === 0}
      >
        <Download className="w-4 h-4 mr-2" />
        Export Filtered ({filteredSubmissions.length})
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => exportToCSV(submissions, `all-leads-${new Date().toISOString().split('T')[0]}.csv`)}
        disabled={submissions.length === 0}
      >
        <Download className="w-4 h-4 mr-2" />
        Export All ({submissions.length})
      </Button>
    </div>
  );
};
