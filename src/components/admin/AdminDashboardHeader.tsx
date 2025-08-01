
import { Button } from '@/components/ui/button';
import { LogOut, BarChart3 } from 'lucide-react';

interface AdminDashboardHeaderProps {
  showAnalytics: boolean;
  onToggleAnalytics: () => void;
  onLogout: () => void;
}

export const AdminDashboardHeader = ({ 
  showAnalytics, 
  onToggleAnalytics, 
  onLogout 
}: AdminDashboardHeaderProps) => {
  return (
    <div className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Admin Panel</h1>
            <p className="text-sm text-gray-600">Funding For Scotland</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={onToggleAnalytics} 
              variant="outline" 
              size="sm"
            >
              <BarChart3 className="w-4 h-4 mr-2" />
              {showAnalytics ? 'Hide' : 'Show'} Analytics
            </Button>
            <Button onClick={onLogout} variant="outline" size="sm">
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};
