import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Ticket, Store } from "lucide-react";

type EventType = "ticket" | "stall" | null;

interface EventTypeSelectorProps {
  onSelect: (type: EventType) => void;
}

const EventTypeSelector = ({ onSelect }: EventTypeSelectorProps) => {
  const [selected, setSelected] = useState<EventType>(null);

  const handleSelect = (type: EventType) => {
    setSelected(type);
    onSelect(type);
  };

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold">Select Event Type</h2>
      <p className="text-muted-foreground">Choose the type of event you want to create</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
        <Card 
          className={`cursor-pointer hover:border-primary transition-all ${
            selected === "ticket" ? "border-2 border-primary" : ""
          }`}
          onClick={() => handleSelect("ticket")}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <Ticket className="mr-2 h-5 w-5" />
              Ticket Event
            </CardTitle>
            <CardDescription>
              Create an event where attendees purchase tickets
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Sell tickets to attendees</li>
              <li>Manage ticket categories and pricing</li>
              <li>Track ticket sales and attendance</li>
            </ul>
          </CardContent>
        </Card>

        <Card 
          className={`cursor-pointer hover:border-primary transition-all ${
            selected === "stall" ? "border-2 border-primary" : ""
          }`}
          onClick={() => handleSelect("stall")}
        >
          <CardHeader>
            <CardTitle className="flex items-center">
              <Store className="mr-2 h-5 w-5" />
              Stall Event
            </CardTitle>
            <CardDescription>
              Create an event with stalls for vendors
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-5 space-y-1 text-sm">
              <li>Create and manage stalls</li>
              <li>Approve stall manager requests</li>
              <li>Track stall bookings and sales</li>
            </ul>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end mt-6">
        <Button 
          disabled={!selected} 
          onClick={() => selected && onSelect(selected)}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};

export default EventTypeSelector;