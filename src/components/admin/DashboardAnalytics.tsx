
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import type { Database } from '@/integrations/supabase/types';

type FormSubmission = Database['public']['Tables']['form_submissions']['Row'];

interface DashboardAnalyticsProps {
  submissions: FormSubmission[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const DashboardAnalytics = ({ submissions }: DashboardAnalyticsProps) => {
  // Status distribution
  const statusData = submissions.reduce((acc, submission) => {
    acc[submission.status] = (acc[submission.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const statusChartData = Object.entries(statusData).map(([status, count]) => ({
    status: status.charAt(0).toUpperCase() + status.slice(1),
    count,
  }));

  // Service type distribution
  const serviceData = submissions.reduce((acc, submission) => {
    const service = submission.service_type.replace('_', ' ').toUpperCase();
    acc[service] = (acc[service] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const serviceChartData = Object.entries(serviceData).map(([service, count]) => ({
    service,
    count,
  }));

  // Submissions over time (last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  const timelineData = last30Days.map(date => {
    const count = submissions.filter(sub => 
      sub.created_at.split('T')[0] === date
    ).length;
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      submissions: count,
    };
  });

  // Conversion rate - now includes survey_booked as converted
  const totalSubmissions = submissions.length;
  const convertedSubmissions = submissions.filter(s => s.status === 'converted' || s.status === 'survey_booked').length;
  const conversionRate = totalSubmissions > 0 ? (convertedSubmissions / totalSubmissions * 100).toFixed(1) : '0';

  const chartConfig = {
    submissions: { label: "Submissions", color: "#8884d8" },
    status: { label: "Status", color: "#82ca9d" },
    service: { label: "Service", color: "#ffc658" },
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      <Card>
        <CardHeader>
          <CardTitle>Conversion Rate</CardTitle>
          <CardDescription>Overall lead conversion performance</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-green-600">{conversionRate}%</div>
          <p className="text-sm text-muted-foreground">
            {convertedSubmissions} of {totalSubmissions} leads converted
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Submissions by Status</CardTitle>
          <CardDescription>Distribution of lead statuses</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <BarChart data={statusChartData}>
              <XAxis dataKey="status" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="count" fill="#8884d8" />
            </BarChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Service Distribution</CardTitle>
          <CardDescription>Enquiries by service type</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[200px]">
            <PieChart>
              <Pie
                data={serviceChartData}
                cx="50%"
                cy="50%"
                outerRadius={60}
                fill="#8884d8"
                dataKey="count"
                label={({ service, percent }) => `${service} ${(percent * 100).toFixed(0)}%`}
              >
                {serviceChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
            </PieChart>
          </ChartContainer>
        </CardContent>
      </Card>

      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle>Submissions Timeline</CardTitle>
          <CardDescription>Daily submissions over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={timelineData}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="submissions" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};
