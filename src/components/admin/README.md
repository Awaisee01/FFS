
# Admin Dashboard Components

This directory contains all the components and utilities for the admin dashboard functionality.

## Core Components

### AdminDashboardHeader
- Main header with navigation and analytics toggle
- Logout functionality
- Props: `showAnalytics`, `onToggleAnalytics`, `onLogout`

### StatsOverview
- Displays key metrics cards
- Props: `totalSubmissions`, `newSubmissions`, `processedSubmissions`, `todaySubmissions`

### SubmissionsTable
- Main data table with filtering and bulk actions
- Handles status filtering, date range filtering
- Props: `submissions`, `filteredSubmissions`, `selectedIds`, `statusFilter`, `dateRange`, etc.

### SubmissionDetailModal
- Modal for viewing and editing individual submissions
- Props: `submission`, `editingNotes`, `editingStatus`, etc.

## Utility Components

### SearchFilter
- Debounced search input component
- Props: `onSearch`, `placeholder`

### PaginationControls
- Pagination component with page size controls
- Props: `currentPage`, `totalPages`, `pageSize`, `totalItems`, etc.

### ConfirmationDialog
- Reusable confirmation dialog for destructive actions
- Props: `isOpen`, `onClose`, `onConfirm`, `title`, `description`, etc.

### BulkActions
- Bulk action controls with header and buttons
- Integrates with BulkActionHeader and BulkActionButtons

### BulkEmailDialog
- Dialog for sending bulk emails to selected submissions
- Props: `isOpen`, `onClose`, `selectedSubmissions`, `onEmailSent`

### WorkflowTrigger
- Component for triggering automated workflows
- Props: `isOpen`, `onClose`, `selectedSubmissions`, `onWorkflowTriggered`

## Hooks

### useAdminDashboard
- Custom hook that manages dashboard state and operations
- Returns: `submissions`, `loading`, `fetchSubmissions`, `updateSubmission`

## File Structure

```
src/components/admin/
├── README.md
├── AdminDashboardHeader.tsx
├── StatsOverview.tsx
├── SubmissionsTable.tsx
├── SubmissionDetailModal.tsx
├── SearchFilter.tsx
├── PaginationControls.tsx
├── ConfirmationDialog.tsx
├── BulkActions.tsx
├── BulkEmailDialog.tsx
├── WorkflowTrigger.tsx
├── BulkActions/
│   ├── BulkActionHeader.tsx
│   └── BulkActionButtons.tsx
└── [other components...]
```

## Key Features

1. **Performance Optimizations**:
   - Debounced search (300ms delay)
   - Pagination with configurable page sizes
   - Memoized filtering and sorting

2. **Bulk Operations**:
   - Select all/none functionality
   - Bulk status updates
   - Bulk email sending
   - Automated workflow triggers

3. **Confirmation Dialogs**:
   - All destructive actions require confirmation
   - Customizable dialog variants (default/destructive)

4. **Search & Filtering**:
   - Real-time search across multiple fields
   - Status filtering
   - Date range filtering

## Usage Example

```tsx
import AdminDashboard from '@/components/AdminDashboard';

function AdminPage() {
  const handleLogout = () => {
    // Handle logout logic
  };

  return <AdminDashboard onLogout={handleLogout} />;
}
```

## Testing

To add unit tests for these components, you would need to install testing dependencies:

```bash
npm install --save-dev @testing-library/react @testing-library/jest-dom vitest @vitest/ui jsdom
```

Then configure your test setup and add test files in the `__tests__` directory.

## Dependencies

The admin components use the following key dependencies:
- React & React Hooks
- Tailwind CSS for styling
- Shadcn/UI components
- Supabase for data operations
- Lodash for utility functions
- Date-fns for date manipulation
- Lucide React for icons
