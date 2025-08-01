
import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { debounce } from 'lodash';

interface SearchFilterProps {
  onSearch: (query: string) => void;
  placeholder?: string;
}

export const SearchFilter = ({ onSearch, placeholder = "Search submissions..." }: SearchFilterProps) => {
  const [searchQuery, setSearchQuery] = useState('');

  const debouncedSearch = useCallback(
    debounce((query: string) => {
      onSearch(query);
    }, 300),
    [onSearch]
  );

  const handleSearch = (value: string) => {
    setSearchQuery(value);
    debouncedSearch(value);
  };

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        type="text"
        placeholder={placeholder}
        value={searchQuery}
        onChange={(e) => handleSearch(e.target.value)}
        className="pl-10"
      />
    </div>
  );
};
