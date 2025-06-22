import { createFileRoute } from "@tanstack/react-router";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { Calendar, Clock, MapPin, DollarSign, CheckCircle, XCircle } from "lucide-react";

export const Route = createFileRoute("/_app/_auth/client/appointment-approval/_layout")({
  component: AppointmentApproval,
});

// Sample appointment data
const sampleAppointments = [
  {
    id: "apt1",
    date: "2025-07-01",
    time: "14:00",
    duration: "2 hours",
    location: "123 Main St, New York, NY",
    type: "Outcall",
    services: "Standard session with additional time for conversation",
    rate: 300,
    status: "pending"
  },
  {
    id: "apt2",
    date: "2025-07-03",
    time: "19:00",
    duration: "3 hours",
    location: "Client's location",
    type: "Outcall",
    services: "Dinner date followed by private session",
    rate: 450,
    status: "pending"
  }
];

function AppointmentApproval() {
  return (
    <div className="mx-auto w-full max-w-screen-xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Appointment Approval</h1>
        <p className="text-primary/60">
          Review and approve appointment requests from your admin
        </p>
      </div>
      
      <div className="space-y-6">
        {sampleAppointments.length > 0 ? (
          sampleAppointments.map((appointment) => (
            <AppointmentCard key={appointment.id} appointment={appointment} />
          ))
        ) : (
          <div className="rounded-lg border border-border bg-card p-6">
            <div className="text-center py-12">
              <p className="text-primary/60">No pending appointment requests</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

interface AppointmentProps {
  appointment: {
    id: string;
    date: string;
    time: string;
    duration: string;
    location: string;
    type: string;
    services: string;
    rate: number;
    status: string;
  };
}

function AppointmentCard({ appointment }: AppointmentProps) {
  // Format date for display
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };
  
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-primary">
              {appointment.type} Appointment
            </h3>
            <p className="text-sm text-primary/60">ID: {appointment.id}</p>
          </div>
          <Badge variant={appointment.status === "pending" ? "outline" : "default"}>
            {appointment.status === "pending" ? "Pending Approval" : appointment.status}
          </Badge>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary/60" />
            <span className="text-primary">{formatDate(appointment.date)}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary/60" />
            <span className="text-primary">{appointment.time} ({appointment.duration})</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary/60" />
            <span className="text-primary">{appointment.location}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <DollarSign className="h-4 w-4 text-primary/60" />
            <span className="text-primary">${appointment.rate}</span>
          </div>
          
          <div className="pt-2">
            <h4 className="text-sm font-medium text-primary mb-1">Services:</h4>
            <p className="text-sm text-primary/80 bg-primary/5 p-2 rounded">
              {appointment.services}
            </p>
          </div>
        </div>
        
        {appointment.status === "pending" && (
          <div className="flex gap-3 mt-6">
            <Button className="flex-1" variant="default">
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </Button>
            <Button className="flex-1" variant="outline">
              <XCircle className="mr-2 h-4 w-4" />
              Decline
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

