
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Mail, FileText, Calendar } from 'lucide-react';

interface StatsOverviewProps {
  totalSubmissions: number;
  newSubmissions: number;
  processedSubmissions: number;
  todaySubmissions: number;
}

export const StatsOverview = ({
  totalSubmissions,
  newSubmissions,
  processedSubmissions,
  todaySubmissions
}: StatsOverviewProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
          <Users className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{totalSubmissions}</div>
          <p className="text-xs text-muted-foreground">All time submissions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">New Submissions</CardTitle>
          <Mail className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{newSubmissions}</div>
          <p className="text-xs text-muted-foreground">Awaiting response</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Converted</CardTitle>
          <FileText className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{processedSubmissions}</div>
          <p className="text-xs text-muted-foreground">Successful conversions</p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Today</CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{todaySubmissions}</div>
          <p className="text-xs text-muted-foreground">Submissions today</p>
        </CardContent>
      </Card>
    </div>
  );
};
