
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Download, Check, X } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

const mockBookings = [
  {
    id: 1,
    eventName: "Summer Music Festival",
    customerName: "John Doe",
    email: "john@example.com",
    tickets: 2,
    status: "confirmed",
    date: "2024-06-15",
    amount: "$120",
  },
  {
    id: 2,
    eventName: "Food & Wine Expo",
    customerName: "Jane Smith",
    email: "jane@example.com",
    tickets: 1,
    status: "pending",
    date: "2024-05-20",
    amount: "$75",
  },
  // Add more mock bookings
];

const BookingsManagement = () => {
  const { toast } = useToast();

  const handleStatusChange = (bookingId: number, newStatus: string) => {
    toast({
      title: "Booking Updated",
      description: `Booking status changed to ${newStatus}`,
    });
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Bookings Overview</CardTitle>
        <div className="flex space-x-2">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search bookings..."
              className="pl-8"
            />
          </div>
          <Button variant="outline">
            <Download className="h-4 w-4 mr-1" />
            Export
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {mockBookings.map((booking) => (
            <div
              key={booking.id}
              className="flex items-center justify-between p-4 border rounded-lg"
            >
              <div className="space-y-1">
                <h3 className="font-medium">{booking.eventName}</h3>
                <p className="text-sm text-muted-foreground">
                  {booking.customerName} • {booking.email}
                </p>
                <p className="text-sm">
                  {booking.tickets} tickets • {booking.amount}
                </p>
                <p className="text-sm text-muted-foreground">{booking.date}</p>
              </div>
              <div className="flex flex-col items-end space-y-2">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${booking.status === "confirmed"
                      ? "bg-green-100 text-green-800"
                      : "bg-yellow-100 text-yellow-800"
                    }`}
                >
                  {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BookingsManagement;
