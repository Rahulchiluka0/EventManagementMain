
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Download } from "lucide-react";

const salesData = [
  { date: "2024-01", tickets: 4000, stalls: 2400, total: 6400 },
  { date: "2024-02", tickets: 3000, stalls: 1398, total: 4398 },
  { date: "2024-03", tickets: 2000, stalls: 9800, total: 11800 },
  { date: "2024-04", tickets: 2780, stalls: 3908, total: 6688 },
  { date: "2024-05", tickets: 1890, stalls: 4800, total: 6690 },
  { date: "2024-06", tickets: 2390, stalls: 3800, total: 6190 },
];

const topEvents = [
  {
    id: 1,
    name: "Summer Music Festival",
    revenue: "$12,450",
    ticketsSold: 450,
    stallsSold: 15,
  },
  {
    id: 2,
    name: "Food & Wine Expo",
    revenue: "$8,920",
    ticketsSold: 320,
    stallsSold: 25,
  },
  // Add more mock data as needed
];

const SalesTracking = () => {
  return (
    <div className="space-y-6 ml-4">
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">$45,231.89</div>
            <p className="text-xs text-muted-foreground">+20.1% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Tickets Sold</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,234</div>
            <p className="text-xs text-muted-foreground">+12.4% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">Stalls Booked</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">89</div>
            <p className="text-xs text-muted-foreground">+4.3% from last month</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Sales Trends</CardTitle>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </CardHeader>
        <CardContent>
          <div className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={salesData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="tickets"
                  stroke="#D40915"
                  strokeWidth={2}
                />
                <Line
                  type="monotone"
                  dataKey="stalls"
                  stroke="#1F2937"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Top Performing Events</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-4">
              {topEvents.map((event) => (
                <div
                  key={event.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <h4 className="font-medium">{event.name}</h4>
                    <p className="text-sm text-muted-foreground">
                      Tickets: {event.ticketsSold} | Stalls: {event.stallsSold}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold">{event.revenue}</p>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};

export default SalesTracking;
