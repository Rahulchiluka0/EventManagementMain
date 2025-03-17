
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Edit, User } from "lucide-react";

const mockManagers = [
  {
    id: 1,
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1 234 567 890",
    activeStalls: 3,
    totalRevenue: "$1,500",
    status: "active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane.smith@example.com",
    phone: "+1 234 567 891",
    activeStalls: 2,
    totalRevenue: "$1,200",
    status: "active",
  },
  {
    id: 3,
    name: "Mike Johnson",
    email: "mike.johnson@example.com",
    phone: "+1 234 567 892",
    activeStalls: 0,
    totalRevenue: "$800",
    status: "inactive",
  },
];

const StallManagersList = () => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Stall Managers</CardTitle>
            <Button>Add New Manager</Button>
          </div>
          <div className="flex items-center space-x-2 mt-4">
            <div className="relative flex-1">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search managers..." className="pl-8" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockManagers.map((manager) => (
              <div
                key={manager.id}
                className="flex items-center justify-between p-4 border rounded-lg"
              >
                <div className="flex items-center space-x-4">
                  <div className="bg-gray-100 p-2 rounded-full">
                    <User className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-medium">{manager.name}</h3>
                    <p className="text-sm text-muted-foreground">{manager.email}</p>
                    <p className="text-sm text-muted-foreground">{manager.phone}</p>
                  </div>
                </div>
                <div className="text-right space-y-1">
                  <p className="text-sm font-medium">
                    Active Stalls: {manager.activeStalls}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Revenue: {manager.totalRevenue}
                  </p>
                  <span
                    className={`inline-block px-2 py-1 rounded-full text-xs ${
                      manager.status === "active"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {manager.status.charAt(0).toUpperCase() + manager.status.slice(1)}
                  </span>
                </div>
                <Button variant="outline" size="sm">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StallManagersList;
