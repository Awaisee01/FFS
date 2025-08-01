
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody } from '@/components/ui/table';
import { DateRange } from 'react-day-picker';
import type { Database } from '@/integrations/supabase/types';
import { ExportControls } from './ExportControls';
import { BulkActions } from './BulkActions';
import { SubmissionsTableHeader } from './SubmissionsTable/TableHeader';
import { SubmissionRow } from './SubmissionsTable/SubmissionRow';
import { EmptyState } from './SubmissionsTable/EmptyState';

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];

interface SubmissionsTableProps {
  submissions: FormSubmission[];
  filteredSubmissions: FormSubmission[];
  selectedIds: string[];
  statusFilter: string | 'all';
  dateRange: DateRange | undefined;
  onSelectionChange: (ids: string[]) => void;
  onStatusFilterChange: (status: string | 'all') => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onBulkUpdate: () => void;
  onViewDetails: (submission: FormSubmission) => void;
  onEmailSent: (submissionId: string) => void;
  onStatusUpdate: (submissionId: string, status: string) => void;
  onDelete?: (submissionId: string) => void;
}

export const SubmissionsTable = ({
  submissions,
  filteredSubmissions,
  selectedIds,
  onSelectionChange,
  onBulkUpdate,
  onViewDetails,
  onEmailSent,
  onStatusUpdate,
  onDelete
}: SubmissionsTableProps) => {
  const handleRowSelect = (id: string, checked: boolean) => {
    if (checked) {
      onSelectionChange([...selectedIds, id]);
    } else {
      onSelectionChange(selectedIds.filter(selectedId => selectedId !== id));
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Lead Management</CardTitle>
            <CardDescription>
              {filteredSubmissions.length} {filteredSubmissions.length === 1 ? 'lead' : 'leads'} 
              {filteredSubmissions.length !== submissions.length && ` (filtered from ${submissions.length} total)`}
            </CardDescription>
          </div>
          <ExportControls 
            submissions={submissions}
            filteredSubmissions={filteredSubmissions}
          />
        </div>
      </CardHeader>
      <CardContent>
        <BulkActions
          submissions={filteredSubmissions}
          selectedIds={selectedIds}
          onSelectionChange={onSelectionChange}
          onBulkUpdate={onBulkUpdate}
        />
        
        {filteredSubmissions.length === 0 ? (
          <EmptyState />
        ) : (
          <div className="rounded-md border overflow-x-auto">
            <Table>
              <SubmissionsTableHeader
                submissions={filteredSubmissions}
                selectedIds={selectedIds}
                onSelectionChange={onSelectionChange}
              />
              <TableBody>
                {filteredSubmissions.map((submission) => (
                  <SubmissionRow
                    key={submission.id}
                    submission={submission}
                    isSelected={selectedIds.includes(submission.id)}
                    onSelect={handleRowSelect}
                    onViewDetails={onViewDetails}
                    onStatusUpdate={onStatusUpdate}
                    onDelete={onDelete}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
