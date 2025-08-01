
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, Users, Clock, Target, Phone } from 'lucide-react';
import type { Database } from '@/integrations/supabase/types';

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];

interface QuickStatsProps {
  submissions: FormSubmission[];
}

export const QuickStats = ({ submissions }: QuickStatsProps) => {
  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
  const thisWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  
  const todaySubmissions = submissions.filter(s => 
    new Date(s.created_at).toDateString() === today
  ).length;
  
  const yesterdaySubmissions = submissions.filter(s => 
    new Date(s.created_at).toDateString() === yesterday
  ).length;
  
  const thisWeekSubmissions = submissions.filter(s => 
    new Date(s.created_at) >= thisWeek
  ).length;
  
  const newLeads = submissions.filter(s => s.status === 'new').length;
  const converted = submissions.filter(s => s.status === 'converted' || s.status === 'survey_booked').length;
  const contactedToday = submissions.filter(s => 
    s.contacted_at && new Date(s.contacted_at).toDateString() === today
  ).length;
  
  const conversionRate = submissions.length > 0 ? 
    ((converted / submissions.length) * 100).toFixed(1) : '0';

  const dailyTrend = todaySubmissions - yesterdaySubmissions;
  const TrendIcon = dailyTrend >= 0 ? TrendingUp : TrendingDown;
  const trendColor = dailyTrend >= 0 ? 'text-green-600' : 'text-red-600';

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Clock className="w-4 h-4 text-blue-600" />
            Today
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold">{todaySubmissions}</div>
          <div className={`text-xs flex items-center gap-1 ${trendColor}`}>
            <TrendIcon className="w-3 h-3" />
            {dailyTrend >= 0 ? '+' : ''}{dailyTrend} vs yesterday
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-600" />
            This Week
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold">{thisWeekSubmissions}</div>
          <div className="text-xs text-muted-foreground">
            {(thisWeekSubmissions / 7).toFixed(1)} per day avg
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Users className="w-4 h-4 text-blue-600" />
            New Leads
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold">{newLeads}</div>
          <div className="text-xs text-muted-foreground">
            Awaiting contact
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Phone className="w-4 h-4 text-yellow-600" />
            Contacted Today
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold">{contactedToday}</div>
          <div className="text-xs text-muted-foreground">
            Follow-ups made
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <Target className="w-4 h-4 text-green-600" />
            Converted
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold">{converted}</div>
          <div className="text-xs text-muted-foreground">
            Total sales
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-purple-600" />
            Conversion
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold">{conversionRate}%</div>
          <div className="text-xs text-muted-foreground">
            {converted} of {submissions.length}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
