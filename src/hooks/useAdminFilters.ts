
import { useState, useMemo, useEffect } from 'react';
import { DateRange } from 'react-day-picker';
import { isWithinInterval, parseISO } from 'date-fns';
import type { Database } from '@/integrations/supabase/types';

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];
type LeadStatus = Database['public']['Enums']['lead_status'];
type ServiceType = Database['public']['Enums']['service_type'];

export const useAdminFilters = (submissions: FormSubmission[]) => {
  const [statusFilter, setStatusFilter] = useState<string | 'all'>('all');
  const [serviceFilter, setServiceFilter] = useState<ServiceType | 'all'>('all');
  const [epcFilter, setEpcFilter] = useState<string>('all');
  const [dateRange, setDateRange] = useState<DateRange | undefined>();
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(20);

  // Memoized filtering and pagination
  const paginatedSubmissions = useMemo(() => {
    let filtered = submissions;

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    // Filter by service type
    if (serviceFilter !== 'all') {
      filtered = filtered.filter(s => s.service_type === serviceFilter);
    }

    // Filter by EPC score
    if (epcFilter !== 'all') {
      filtered = filtered.filter(s => s.epc_score === epcFilter);
    }

    // Filter by date range
    if (dateRange?.from) {
      filtered = filtered.filter(s => {
        const submissionDate = parseISO(s.created_at);
        if (dateRange.to) {
          return isWithinInterval(submissionDate, { start: dateRange.from!, end: dateRange.to });
        } else {
          return submissionDate >= dateRange.from!;
        }
      });
    }

    // Enhanced search functionality (excluding EPC score since it has its own filter)
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.name.toLowerCase().includes(query) ||
        s.email?.toLowerCase().includes(query) ||
        s.phone?.toLowerCase().includes(query) ||
        s.postcode?.toLowerCase().includes(query) ||
        s.service_type.toLowerCase().includes(query) ||
        s.property_type?.toLowerCase().includes(query) ||
        s.property_ownership?.toLowerCase().includes(query) ||
        s.current_heating_system?.toLowerCase().includes(query) ||
        s.admin_notes?.toLowerCase().includes(query) ||
        (s.form_data && typeof s.form_data === 'object' && 'address' in s.form_data && 
         typeof s.form_data.address === 'string' && 
         s.form_data.address.toLowerCase().includes(query))
      );
    }

    // Pagination
    const totalPages = Math.ceil(filtered.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;

    return {
      items: filtered.slice(startIndex, endIndex),
      totalPages,
      totalItems: filtered.length,
      filteredItems: filtered
    };
  }, [submissions, statusFilter, serviceFilter, epcFilter, dateRange, searchQuery, currentPage, pageSize]);

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter, serviceFilter, epcFilter, dateRange, searchQuery, pageSize]);

  const handleClearAllFilters = () => {
    setStatusFilter('all');
    setServiceFilter('all');
    setEpcFilter('all');
    setDateRange(undefined);
    setSearchQuery('');
  };

  return {
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
  };
};
