import { useState, useEffect, lazy, Suspense } from 'react';
import { useToast } from '@/hooks/use-toast';
import type { Database } from '@/integrations/supabase/types';
import { supabase } from '@/integrations/supabase/client';

// Keep lightweight components as regular imports
import { AdminDashboardHeader } from './admin/AdminDashboardHeader';
import { QuickStats } from './admin/QuickStats';
import { AdvancedFilters } from './admin/AdvancedFilters';
import { SubmissionsTable } from './admin/SubmissionsTable';
import { PaginationControls } from './admin/PaginationControls';
import { TestEmailButton } from './admin/TestEmailButton';

// Lazy load the HEAVY components
const DashboardAnalytics = lazy(() => 
  import('./admin/DashboardAnalytics').then(module => ({ 
    default: module.DashboardAnalytics 
  }))
);
const TrafficAnalytics = lazy(() => 
  import('./admin/TrafficAnalytics').then(module => ({ 
    default: module.TrafficAnalytics 
  }))
);

const SubmissionDetailModal = lazy(() => 
  import('./admin/SubmissionDetailModal').then(module => ({ 
    default: module.SubmissionDetailModal 
  }))
);

// Import hooks
import { useAdminDashboard } from '@/hooks/useAdminDashboard';
import { useAdminFilters } from '@/hooks/useAdminFilters';

interface AdminDashboardProps {
  onLogout: () => void;
}

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];

const AdminDashboard = ({ onLogout }: AdminDashboardProps) => {
  const { 
    submissions, 
    loading, 
    isAuthenticated,
    fetchSubmissions, 
    updateSubmission 
  } = useAdminDashboard();
  
  const {
    statusFilter,
    serviceFilter,  
    epcFilter,
    dateRange,
    searchQuery,
    currentPage,
    pageSize,
    paginatedSubmissions,
    setStatusFilter,
    setServiceFilter,
    setEpcFilter,
    setDateRange,
    setSearchQuery,
    setCurrentPage,
    setPageSize,
    handleClearAllFilters
  } = useAdminFilters(submissions);

  const [selectedSubmission, setSelectedSubmission] = useState<FormSubmission | null>(null);
  const [editingNotes, setEditingNotes] = useState<string>('');
  const [editingStatus, setEditingStatus] = useState<string>('new');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const { toast } = useToast();

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      onLogout();
    }
  }, [loading, isAuthenticated, onLogout]);

  const deleteSubmission = async (id: string) => {
    try {
      const { error } = await supabase
        .from('form_submissions')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchSubmissions();
      if (selectedSubmission?.id === id) {
        setSelectedSubmission(null);
      }
      
      toast({
        title: "Success",
        description: "Enquiry deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting submission:', error);
      toast({
        title: "Error",
        description: "Failed to delete enquiry",
        variant: "destructive",
      });
    }
  };

  const handleStatusUpdate = (submissionId: string, status: string) => {
    updateSubmission(submissionId, { status });
  };

  const handleLogout = () => {
    if (typeof window !== 'undefined') {
      // Clear all admin session data
      localStorage.removeItem('adminAuthenticated');
      localStorage.removeItem('adminAuthTime');
      localStorage.removeItem('adminSessionToken');
      localStorage.removeItem('adminId');
      localStorage.removeItem('adminEmail');
      localStorage.removeItem('adminUser');
    }
    onLogout();
  };

  const handleViewDetails = (submission: FormSubmission) => {
    setSelectedSubmission(submission);
    setEditingNotes(submission.admin_notes || '');
    setEditingStatus(submission.status);
  };

  const handleEmailSent = (submissionId: string) => {
    updateSubmission(submissionId, { status: 'survey_booked' });
  };

  const handleSaveSubmission = async (updates: {
    status: string;
    admin_notes: string;
    property_type?: string;
    property_ownership?: string;
    current_heating_system?: string;
    epc_score?: string;
  }) => {
    if (selectedSubmission) {
      console.log('💾 AdminDashboard handleSaveSubmission called with:', updates);
      await updateSubmission(selectedSubmission.id, updates);
      setSelectedSubmission(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-lg">Loading submissions...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminDashboardHeader
        showAnalytics={showAnalytics}
        onToggleAnalytics={() => setShowAnalytics(!showAnalytics)}
        onLogout={handleLogout}
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Test Email Button */}
        <div className="mb-6 flex justify-end">
          <TestEmailButton />
        </div>

        {/* Analytics Dashboard - LAZY LOADED */}
        {showAnalytics && (
          <Suspense fallback={<div className="mb-8 h-64 bg-gray-200 animate-pulse rounded-lg"></div>}>
            <div className="mb-8 space-y-8">
              <div>
                <h2 className="text-xl font-semibold mb-4">Form Submissions Analytics</h2>
                <DashboardAnalytics submissions={submissions} />
              </div>
              <div>
                <h2 className="text-xl font-semibold mb-4">Website Traffic Analytics</h2>
                <TrafficAnalytics />
              </div>
            </div>
          </Suspense>
        )}

        {/* Quick Stats Overview */}
        <QuickStats submissions={submissions} />

        {/* Advanced Filters */}
        <AdvancedFilters
          statusFilter={statusFilter}
          serviceFilter={serviceFilter}
          epcFilter={epcFilter}
          dateRange={dateRange}
          searchQuery={searchQuery}
          onStatusFilterChange={setStatusFilter}
          onServiceFilterChange={setServiceFilter}
          onEpcFilterChange={setEpcFilter}
          onDateRangeChange={setDateRange}
          onSearchChange={setSearchQuery}
          onClearAll={handleClearAllFilters}
        />

        {/* Submissions Table */}
        <SubmissionsTable
          submissions={submissions}
          filteredSubmissions={paginatedSubmissions.items}
          selectedIds={selectedIds}
          statusFilter={statusFilter}
          dateRange={dateRange}
          onSelectionChange={setSelectedIds}
          onStatusFilterChange={setStatusFilter}
          onDateRangeChange={setDateRange}
          onBulkUpdate={fetchSubmissions}
          onViewDetails={handleViewDetails}
          onEmailSent={handleEmailSent}
          onStatusUpdate={handleStatusUpdate}
          onDelete={deleteSubmission}
        />

        {/* Pagination */}
        {paginatedSubmissions.totalItems > 0 && (
          <PaginationControls
            currentPage={currentPage}
            totalPages={paginatedSubmissions.totalPages}
            pageSize={pageSize}
            totalItems={paginatedSubmissions.totalItems}
            onPageChange={setCurrentPage}
            onPageSizeChange={setPageSize}
          />
        )}
      </div>

      {/* Detail Modal - LAZY LOADED */}
      {selectedSubmission && (
        <Suspense fallback={<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"><div className="bg-white p-4 rounded">Loading...</div></div>}>
          <SubmissionDetailModal
            submission={selectedSubmission}
            editingNotes={editingNotes}
            editingStatus={editingStatus}
            onClose={() => setSelectedSubmission(null)}
            onNotesChange={setEditingNotes}
            onStatusChange={setEditingStatus}
            onSave={handleSaveSubmission}
          />
        </Suspense>
      )}
    </div>
  );
};

export default AdminDashboard;
