import { Header } from "@/components/Header";
import { MetricChart } from "@/components/MetricChart";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Server, MapPin } from "lucide-react";

// Mock data generators
const generateTimeSeriesData = (points: number, baseValue: number, variance: number) => {
  const data = [];
  const now = new Date();
  
  for (let i = points - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 5 * 60 * 1000); // 5-minute intervals
    const value = Math.max(0, Math.min(100, baseValue + (Math.random() - 0.5) * variance));
    data.push({
      time: time.toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      value: Math.round(value)
    });
  }
  
  return data;
};

const diskData = generateTimeSeriesData(12, 45, 20).map(item => ({
  ...item,
  value: Math.round(item.value * 0.8) // Disk usage typically lower
}));

const serverData = {
  "server-001": {
    name: "Web Server 01",
    location: "US East - Virginia",
    status: "online" as const,
    cpuData: generateTimeSeriesData(12, 45, 30),
    gpuData: generateTimeSeriesData(12, 62, 25),
    memoryData: generateTimeSeriesData(12, 67, 20),
    diskData
  },
  "server-002": {
    name: "Database Server",
    location: "US West - California", 
    status: "online" as const,
    cpuData: generateTimeSeriesData(12, 78, 15),
    gpuData: generateTimeSeriesData(12, 45, 30),
    memoryData: generateTimeSeriesData(12, 52, 25),
    diskData
  },
  "server-003": {
    name: "API Gateway",
    location: "EU West - Ireland",
    status: "warning" as const,
    cpuData: generateTimeSeriesData(12, 89, 10),
    gpuData: generateTimeSeriesData(12, 91, 8),
    memoryData: generateTimeSeriesData(12, 91, 12),
    diskData
  }
};

export const ServerDetail = () => {
  const { serverId } = useParams<{ serverId: string }>();
  const navigate = useNavigate();
  
  const server = serverId ? serverData[serverId as keyof typeof serverData] : null;

  if (!server) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-6 py-8 text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">Server Not Found</h1>
          <Button onClick={() => navigate('/')}>Return to Dashboard</Button>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'offline':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/servers')}
            className="mb-4 text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Servers
          </Button>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-primary/10 rounded-lg">
                <Server className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">{server.name}</h1>
                <div className="flex items-center space-x-3 mt-2">
                  <div className="flex items-center space-x-1 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{server.location}</span>
                  </div>
                  <Badge className={`${getStatusColor(server.status)} capitalize`}>
                    {server.status}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-xl font-semibold text-foreground mb-2">Real-time Analytics</h2>
          <p className="text-muted-foreground">
            Monitor critical system metrics and performance indicators in real-time.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MetricChart
            title="CPU Usage"
            data={server.cpuData}
            color="hsl(var(--chart-1))"
            unit="%"
          />
          
          <MetricChart
            title="GPU Usage"
            data={server.gpuData}
            color="hsl(var(--chart-2))"
            unit="%"
          />
          
          <MetricChart
            title="Memory Usage"
            data={server.memoryData}
            color="hsl(var(--chart-3))"
            unit="%"
          />
          
          <MetricChart
            title="Disk Process"
            data={server.diskData}
            color="hsl(var(--chart-4))"
            unit="%"
          />
        </div>

        <div className="mt-8 p-6 bg-card border border-border rounded-lg">
          <h3 className="text-lg font-semibold text-foreground mb-2">Performance Summary</h3>
          <p className="text-muted-foreground">
            Server is operating within normal parameters. All metrics are being monitored continuously 
            to ensure optimal performance and early detection of potential issues.
          </p>
        </div>
      </main>
    </div>
  );
};