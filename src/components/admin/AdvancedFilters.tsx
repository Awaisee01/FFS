
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { X, Filter } from 'lucide-react';
import { DateRangeFilter } from './DateRangeFilter';
import { SearchFilter } from './SearchFilter';
import { DateRange } from 'react-day-picker';
import type { Database } from '@/integrations/supabase/types';

type ServiceType = Database['public']['Enums']['service_type'];

interface AdvancedFiltersProps {
  statusFilter: string | 'all';
  serviceFilter: ServiceType | 'all';
  epcFilter: string;
  dateRange: DateRange | undefined;
  searchQuery: string;
  onStatusFilterChange: (status: string | 'all') => void;
  onServiceFilterChange: (service: ServiceType | 'all') => void;
  onEpcFilterChange: (epc: string) => void;
  onDateRangeChange: (range: DateRange | undefined) => void;
  onSearchChange: (query: string) => void;
  onClearAll: () => void;
}

export const AdvancedFilters = ({
  statusFilter,
  serviceFilter,
  epcFilter,
  dateRange,
  searchQuery,
  onStatusFilterChange,
  onServiceFilterChange,
  onEpcFilterChange,
  onDateRangeChange,
  onSearchChange,
  onClearAll
}: AdvancedFiltersProps) => {
  const hasActiveFilters = statusFilter !== 'all' || serviceFilter !== 'all' || 
                          epcFilter !== 'all' || dateRange?.from || searchQuery.trim();

  const formatServiceType = (serviceType: ServiceType) => {
    const formatted = {
      eco4: 'ECO4',
      solar: 'Solar',
      gas_boilers: 'Gas Boilers',
      home_improvements: 'Home Improvements'
    };
    return formatted[serviceType];
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <Filter className="w-5 h-5" />
            Filters & Search
          </CardTitle>
          {hasActiveFilters && (
            <Button 
              variant="ghost" 
              size="sm" 
              onClick={onClearAll}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="w-4 h-4 mr-2" />
              Clear All
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <SearchFilter 
          onSearch={onSearchChange}
          placeholder="Search by name, email, phone, postcode, address, property details, heating system, or notes..."
        />
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="text-sm font-medium mb-2 block">Status</label>
            <Select value={statusFilter} onValueChange={onStatusFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Statuses" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="survey_booked">Survey Booked</SelectItem>
                <SelectItem value="lost">Lost</SelectItem>
                <SelectItem value="doesnt_qualify">Doesn't Qualify</SelectItem>
                <SelectItem value="no_contact">No Contact</SelectItem>
                <SelectItem value="contacted">Contacted</SelectItem>
                <SelectItem value="qualified">Qualified</SelectItem>
                <SelectItem value="converted">Converted</SelectItem>
                <SelectItem value="closed">Closed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Service</label>
            <Select value={serviceFilter} onValueChange={onServiceFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All Services" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Services</SelectItem>
                <SelectItem value="eco4">ECO4</SelectItem>
                <SelectItem value="solar">Solar</SelectItem>
                <SelectItem value="gas_boilers">Gas Boilers</SelectItem>
                <SelectItem value="home_improvements">Home Improvements</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">EPC Score</label>
            <Select value={epcFilter} onValueChange={onEpcFilterChange}>
              <SelectTrigger>
                <SelectValue placeholder="All EPC Scores" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All EPC Scores</SelectItem>
                <SelectItem value="A">A</SelectItem>
                <SelectItem value="B">B</SelectItem>
                <SelectItem value="C">C</SelectItem>
                <SelectItem value="D">D</SelectItem>
                <SelectItem value="E">E</SelectItem>
                <SelectItem value="F">F</SelectItem>
                <SelectItem value="G">G</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="text-sm font-medium mb-2 block">Date Range</label>
            <DateRangeFilter 
              dateRange={dateRange}
              onDateRangeChange={onDateRangeChange}
            />
          </div>
        </div>

        {/* Active Filters Display */}
        {hasActiveFilters && (
          <div className="flex flex-wrap gap-2 pt-4 border-t">
            <span className="text-sm text-muted-foreground">Active filters:</span>
            {statusFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Status: {statusFilter}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => onStatusFilterChange('all')}
                />
              </Badge>
            )}
            {serviceFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                Service: {formatServiceType(serviceFilter)}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => onServiceFilterChange('all')}
                />
              </Badge>
            )}
            {epcFilter !== 'all' && (
              <Badge variant="secondary" className="gap-1">
                EPC Score: {epcFilter}
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => onEpcFilterChange('all')}
                />
              </Badge>
            )}
            {dateRange?.from && (
              <Badge variant="secondary" className="gap-1">
                Date Range
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => onDateRangeChange(undefined)}
                />
              </Badge>
            )}
            {searchQuery.trim() && (
              <Badge variant="secondary" className="gap-1">
                Search: "{searchQuery.trim()}"
                <X 
                  className="w-3 h-3 cursor-pointer" 
                  onClick={() => onSearchChange('')}
                />
              </Badge>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
