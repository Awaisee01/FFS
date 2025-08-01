
import { Mail, Phone, MapPin, Home } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];

interface ContactInfoProps {
  submission: FormSubmission;
}

export const ContactInfo = ({ submission }: ContactInfoProps) => {
  return (
    <div className="space-y-1">
      <div className="font-medium text-gray-900">{submission.name}</div>
      {submission.email && (
        <div className="flex items-center text-sm text-gray-600">
          <Mail className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">{submission.email}</span>
        </div>
      )}
      {submission.phone && (
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-3 h-3 mr-1 flex-shrink-0" />
          {submission.phone}
        </div>
      )}
      {submission.form_data && typeof submission.form_data === 'object' && 'address' in submission.form_data && (
        <div className="flex items-center text-sm text-gray-600">
          <Home className="w-3 h-3 mr-1 flex-shrink-0" />
          <span className="truncate">{submission.form_data.address as string}</span>
        </div>
      )}
      {submission.postcode && (
        <div className="flex items-center text-sm text-gray-600">
          <MapPin className="w-3 h-3 mr-1 flex-shrink-0" />
          {submission.postcode}
        </div>
      )}
    </div>
  );
};
