import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { useState } from "react";
import { Calendar } from "@/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { cn } from "@/utils/misc";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";

export const Route = createFileRoute("/_app/_auth/admin/appointment-dispatch/_layout")({
  component: AppointmentDispatch,
});

function AppointmentDispatch() {
  const [date, setDate] = useState<Date>();
  const [startTime, setStartTime] = useState<string>("");
  const [client, setClient] = useState<string>("");
  const [appointmentType, setAppointmentType] = useState<string>("outcall");
  const [location, setLocation] = useState<string>("");
  const [duration, setDuration] = useState<string>("1");
  const [services, setServices] = useState<string>("");
  const [rate, setRate] = useState<string>("");
  
  const [showLocationField, setShowLocationField] = useState(true);
  
  const handleAppointmentTypeChange = (value: string) => {
    setAppointmentType(value);
    setShowLocationField(value === "outcall");
  };
  
  return (
    <div className="mx-auto w-full max-w-screen-xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Appointment Dispatch</h1>
        <p className="text-primary/60">
          Create and manage appointment requests for clients
        </p>
      </div>
      
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">Create New Appointment</h2>
          
          <div className="space-y-4">
            {/* Client Selection */}
            <div>
              <Label htmlFor="client" className="block text-sm font-medium text-primary/80">
                1. Client Selection
              </Label>
              <Select value={client} onValueChange={setClient}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select client" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="client1">John Doe</SelectItem>
                  <SelectItem value="client2">Jane Smith</SelectItem>
                  <SelectItem value="client3">Alex Johnson</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Appointment Type */}
            <div>
              <Label htmlFor="appointmentType" className="block text-sm font-medium text-primary/80">
                2. Appointment Type
              </Label>
              <Select value={appointmentType} onValueChange={handleAppointmentTypeChange}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="incall">Incall</SelectItem>
                  <SelectItem value="outcall">Outcall</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            {/* Location Address - Conditional */}
            {showLocationField && (
              <div>
                <Label htmlFor="location" className="block text-sm font-medium text-primary/80">
                  3. Location Address
                </Label>
                <Textarea
                  id="location"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Enter address for outcall"
                  className="mt-1"
                  rows={2}
                />
              </div>
            )}
            
            {/* Appointment Date */}
            <div>
              <Label htmlFor="date" className="block text-sm font-medium text-primary/80">
                4. Appointment Date
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal mt-1",
                      !date && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {date ? format(date, "PPP") : <span>Pick a date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </div>
            
            {/* Start Time */}
            <div>
              <Label htmlFor="startTime" className="block text-sm font-medium text-primary/80">
                5. Start Time
              </Label>
              <div className="flex items-center mt-1">
                <Button variant="outline" className="w-full justify-start text-left font-normal">
                  <Clock className="mr-2 h-4 w-4" />
                  <Input
                    type="time"
                    id="startTime"
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="border-none p-0 focus-visible:ring-0"
                  />
                </Button>
              </div>
            </div>
            
            {/* Duration */}
            <div>
              <Label htmlFor="duration" className="block text-sm font-medium text-primary/80">
                6. Duration
              </Label>
              <Select value={duration} onValueChange={setDuration}>
                <SelectTrigger className="w-full mt-1">
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour</SelectItem>
                  <SelectItem value="2">2 hours</SelectItem>
                  <SelectItem value="3">3 hours</SelectItem>
                  <SelectItem value="4">4 hours</SelectItem>
                  <SelectItem value="travel">Travel Companion</SelectItem>
                  <SelectItem value="overnight">Overnight</SelectItem>
                  <SelectItem value="other">Other (Specify)</SelectItem>
                </SelectContent>
              </Select>
              
              {duration === "other" && (
                <Input
                  className="mt-2"
                  placeholder="Specify duration or details"
                />
              )}
            </div>
            
            {/* Services */}
            <div>
              <Label htmlFor="services" className="block text-sm font-medium text-primary/80">
                7. Services to be Provided
              </Label>
              <Textarea
                id="services"
                value={services}
                onChange={(e) => setServices(e.target.value)}
                placeholder="Detail agreed services"
                className="mt-1"
                rows={3}
              />
            </div>
            
            {/* Rate/Price */}
            <div>
              <Label htmlFor="rate" className="block text-sm font-medium text-primary/80">
                8. Agreed Rate/Price
              </Label>
              <div className="relative mt-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-gray-500 sm:text-sm">$</span>
                </div>
                <Input
                  type="number"
                  id="rate"
                  value={rate}
                  onChange={(e) => setRate(e.target.value)}
                  className="pl-7"
                  placeholder="0.00"
                />
              </div>
            </div>
            
            <Button className="w-full mt-4">
              Create Appointment Request
            </Button>
          </div>
        </div>
        
        <div className="rounded-lg border border-border bg-card p-6">
          <h2 className="text-xl font-semibold text-primary mb-4">Pending Appointment Requests</h2>
          <div className="text-center py-12">
            <p className="text-primary/60">No pending appointment requests</p>
          </div>
        </div>
      </div>
    </div>
  );
}

