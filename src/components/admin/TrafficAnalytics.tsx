import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from '@/components/ui/chart';
import { BarChart, Bar, XAxis, YAxis, PieChart, Pie, Cell, LineChart, Line } from 'recharts';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

export const TrafficAnalytics = () => {
  const [pageVisits, setPageVisits] = useState<any[]>([]);
  const [visitorSessions, setVisitorSessions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchTrafficData();
  }, []);

  const fetchTrafficData = async () => {
    try {
      // Fetch page visits
      const { data: visits, error: visitsError } = await supabase
        .from('page_visits')
        .select('*')
        .order('created_at', { ascending: false });

      if (visitsError) throw visitsError;

      // Fetch visitor sessions
      const { data: sessions, error: sessionsError } = await supabase
        .from('visitor_sessions')
        .select('*')
        .order('created_at', { ascending: false });

      if (sessionsError) throw sessionsError;

      setPageVisits(visits || []);
      setVisitorSessions(sessions || []);
    } catch (error) {
      console.error('Error fetching traffic data:', error);
      toast({
        title: "Error",
        description: "Failed to fetch traffic analytics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="text-center py-8">Loading traffic analytics...</div>;
  }

  // Page visits over time (last 30 days)
  const last30Days = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (29 - i));
    return date.toISOString().split('T')[0];
  });

  const visitsTimelineData = last30Days.map(date => {
    const count = pageVisits.filter(visit => 
      visit.created_at.split('T')[0] === date
    ).length;
    return {
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      visits: count,
    };
  });

  // Clean up page paths - remove query parameters and tokens
  const cleanPagePath = (path: string) => {
    // Remove query parameters and tokens
    const cleanPath = path.split('?')[0];
    
    // Map paths to readable names
    const pathMap: Record<string, string> = {
      '/': 'Home',
      '/eco4': 'ECO4 Scheme',
      '/solar': 'Solar Panels',
      '/gas-boilers': 'Gas Boilers',
      '/home-improvements': 'Home Improvements',
      '/contact': 'Contact',
      '/admin': 'Admin'
    };
    
    return pathMap[cleanPath] || cleanPath.replace('/', '') || 'Home';
  };

  // Page path distribution
  const pagePathData = pageVisits.reduce((acc, visit) => {
    const cleanPath = cleanPagePath(visit.page_path || '/');
    acc[cleanPath] = (acc[cleanPath] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const topPages = Object.entries(pagePathData)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .slice(0, 10)
    .map(([path, count]) => ({
      page: path,
      visits: count,
    }));

  // Clean up traffic sources
  const cleanSource = (source: string) => {
    if (!source || source === 'null' || source === 'undefined') return 'Direct';
    
    // Handle common social media domains
    if (source.includes('facebook.com') || source.includes('fb.')) return 'Facebook';
    if (source.includes('google.com') || source.includes('google.')) return 'Google';
    if (source.includes('instagram.com')) return 'Instagram';
    if (source.includes('twitter.com') || source.includes('x.com')) return 'Twitter/X';
    if (source.includes('linkedin.com')) return 'LinkedIn';
    if (source.includes('youtube.com')) return 'YouTube';
    if (source.includes('tiktok.com')) return 'TikTok';
    
    // Handle direct traffic
    if (source === 'Direct' || source.includes('direct')) return 'Direct';
    
    // Handle email sources
    if (source.includes('email') || source.includes('mail')) return 'Email';
    
    // Handle lovable development URLs
    if (source.includes('lovable.dev') || source.includes('lovableproject.com')) return 'Development';
    
    // Extract domain from full URLs
    try {
      const url = new URL(source.startsWith('http') ? source : `https://${source}`);
      const domain = url.hostname.replace('www.', '');
      
      // Capitalize first letter
      return domain.charAt(0).toUpperCase() + domain.slice(1);
    } catch {
      // If not a valid URL, just clean up the string
      return source.length > 15 ? source.substring(0, 15) + '...' : source;
    }
  };

  // Traffic sources
  const sourceData = pageVisits.reduce((acc, visit) => {
    const rawSource = visit.utm_source || visit.referrer || 'Direct';
    const cleanedSource = cleanSource(rawSource);
    acc[cleanedSource] = (acc[cleanedSource] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const sourceChartData = Object.entries(sourceData)
    .sort(([,a], [,b]) => (b as number) - (a as number))
    .map(([source, count]) => ({
      source,
      count: count as number,
      percentage: (((count as number) / pageVisits.length) * 100).toFixed(1)
    }));

  // Today's stats
  const today = new Date().toISOString().split('T')[0];
  const todayVisits = pageVisits.filter(visit => visit.created_at.split('T')[0] === today).length;
  const totalVisits = pageVisits.length;
  const uniqueVisitors = new Set(pageVisits.map(visit => visit.visitor_id)).size;
  const totalSessions = visitorSessions.length;

  const chartConfig = {
    visits: { label: "Visits", color: "#8884d8" },
    source: { label: "Source", color: "#82ca9d" },
    page: { label: "Page", color: "#ffc658" },
  };

  return (
    <div className="space-y-6">
      {/* Traffic Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Today's Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{todayVisits}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Total Visits</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalVisits}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Unique Visitors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{uniqueVisitors}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium">Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSessions}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Traffic Sources */}
        <Card>
          <CardHeader>
            <CardTitle>Traffic Sources</CardTitle>
            <CardDescription>Where your visitors come from</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <PieChart>
                <Pie
                  data={sourceChartData}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="count"
                  label={({ source, percent }) => `${source} ${(percent * 100).toFixed(0)}%`}
                >
                  {sourceChartData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <ChartTooltip content={<ChartTooltipContent />} />
              </PieChart>
            </ChartContainer>
          </CardContent>
        </Card>

        {/* Top Pages */}
        <Card>
          <CardHeader>
            <CardTitle>Top Pages</CardTitle>
            <CardDescription>Most visited pages</CardDescription>
          </CardHeader>
          <CardContent>
            <ChartContainer config={chartConfig} className="h-[300px]">
              <BarChart data={topPages} layout="horizontal">
                <XAxis type="number" />
                <YAxis dataKey="page" type="category" width={80} />
                <ChartTooltip content={<ChartTooltipContent />} />
                <Bar dataKey="visits" fill="#8884d8" />
              </BarChart>
            </ChartContainer>
          </CardContent>
        </Card>
      </div>

      {/* Traffic Timeline */}
      <Card>
        <CardHeader>
          <CardTitle>Traffic Timeline</CardTitle>
          <CardDescription>Daily page visits over the last 30 days</CardDescription>
        </CardHeader>
        <CardContent>
          <ChartContainer config={chartConfig} className="h-[300px]">
            <LineChart data={visitsTimelineData}>
              <XAxis dataKey="date" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Line type="monotone" dataKey="visits" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ChartContainer>
        </CardContent>
      </Card>
    </div>
  );
};