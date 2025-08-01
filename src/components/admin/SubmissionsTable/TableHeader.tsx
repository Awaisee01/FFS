
import { Checkbox } from '@/components/ui/checkbox';
import { TableHead, TableHeader, TableRow } from '@/components/ui/table';

interface TableHeaderProps {
  submissions: any[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export const SubmissionsTableHeader = ({ submissions, selectedIds, onSelectionChange }: TableHeaderProps) => {
  return (
    <TableHeader>
      <TableRow>
        <TableHead className="w-12">
          <Checkbox
            checked={submissions.length > 0 && selectedIds.length === submissions.length}
            onCheckedChange={(checked) => {
              onSelectionChange(checked ? submissions.map(s => s.id) : []);
            }}
          />
        </TableHead>
        <TableHead className="min-w-[250px]">Contact Information</TableHead>
        <TableHead className="min-w-[120px]">Service</TableHead>
        <TableHead className="min-w-[100px]">Status</TableHead>
        <TableHead className="min-w-[120px]">Submitted</TableHead>
        <TableHead className="text-right">Actions</TableHead>
      </TableRow>
    </TableHeader>
  );
};
