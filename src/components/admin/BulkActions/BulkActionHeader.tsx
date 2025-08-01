
import { Checkbox } from '@/components/ui/checkbox';

interface BulkActionHeaderProps {
  submissions: any[];
  selectedIds: string[];
  onSelectionChange: (ids: string[]) => void;
}

export const BulkActionHeader = ({ submissions, selectedIds, onSelectionChange }: BulkActionHeaderProps) => {
  const allSelected = submissions.length > 0 && selectedIds.length === submissions.length;
  const someSelected = selectedIds.length > 0 && selectedIds.length < submissions.length;

  const handleSelectAll = () => {
    if (allSelected) {
      onSelectionChange([]);
    } else {
      onSelectionChange(submissions.map(s => s.id));
    }
  };

  return (
    <div className="flex items-center space-x-2">
      <Checkbox
        checked={allSelected}
        onCheckedChange={handleSelectAll}
        className={someSelected && !allSelected ? "data-[state=checked]:bg-orange-500" : ""}
      />
      <span className="text-sm font-medium">
        {selectedIds.length > 0 ? `${selectedIds.length} selected` : "Select all"}
      </span>
    </div>
  );
};
