import React from "react";
import { Button } from "@/ui/button";
import { Badge } from "@/ui/badge";
import { Calendar, Clock, MapPin, DollarSign, User, Phone, Mail, FileText, MessageSquare } from "lucide-react";
import { format } from "date-fns";

interface AppointmentDetailsProps {
  appointment: any;
  onApprove?: () => void;
  onReject?: () => void;
  isAdmin?: boolean;
  isClient?: boolean;
}

export function AppointmentDetails({
  appointment,
  onApprove,
  onReject,
  isAdmin = false,
  isClient = false,
}: AppointmentDetailsProps) {
  // Helper function to format date
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "PPP");
    } catch (error) {
      return dateString;
    }
  };
  
  // Helper function to get status badge color
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline">Pending Approval</Badge>;
      case "approved":
        return <Badge variant="success">Confirmed</Badge>;
      case "rejected":
        return <Badge variant="destructive">Rejected</Badge>;
      case "completed":
        return <Badge variant="default">Completed</Badge>;
      case "cancelled":
        return <Badge variant="secondary">Cancelled</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Helper function to get screening status badge
  const getScreeningBadge = (status: string) => {
    switch (status) {
      case "screening-complete":
        return <Badge variant="success">Screening Complete</Badge>;
      case "pending-screening":
        return <Badge variant="outline">Pending Screening</Badge>;
      case "screening-waived":
        return <Badge variant="secondary">Screening Waived</Badge>;
      case "screening-failed":
        return <Badge variant="destructive">Screening Failed</Badge>;
      case "further-info-required":
        return <Badge variant="warning">Further Info Required</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };
  
  // Format duration for display
  const formatDuration = (duration: string, details?: string) => {
    switch (duration) {
      case "1":
        return "1 hour";
      case "2":
        return "2 hours";
      case "3":
        return "3 hours";
      case "4":
        return "4 hours";
      case "travel-companion":
        return "Travel Companion";
      case "overnight":
        return "Overnight";
      case "other":
        return details || "Custom";
      default:
        return duration;
    }
  };
  
  return (
    <div className="rounded-lg border border-border bg-card overflow-hidden">
      <div className="p-6">
        {/* Header with status */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-primary">
              {appointment.appointmentType === "incall" ? "Incall" : "Outcall"} Appointment
            </h3>
            <p className="text-sm text-primary/60">ID: {appointment._id || "New Appointment"}</p>
          </div>
          {getStatusBadge(appointment.status || "pending")}
        </div>
        
        {/* Main appointment details */}
        <div className="space-y-4">
          {/* Date and Time */}
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary/60" />
            <span className="text-primary">
              {appointment.appointmentDate ? formatDate(appointment.appointmentDate) : "Date not set"}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary/60" />
            <span className="text-primary">
              {appointment.startTime || "Time not set"} 
              {appointment.duration && ` (${formatDuration(appointment.duration, appointment.durationDetails)})`}
            </span>
          </div>
          
          {/* Location (if outcall) */}
          {appointment.appointmentType === "outcall" && appointment.locationAddress && (
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-primary/60" />
              <span className="text-primary">{appointment.locationAddress}</span>
            </div>
          )}
          
          {/* Rate */}
          {appointment.rate && (
            <div className="flex items-center gap-2">
              <DollarSign className="h-4 w-4 text-primary/60" />
              <span className="text-primary">${appointment.rate}</span>
            </div>
          )}
          
          {/* Services */}
          {appointment.services && (
            <div className="pt-2">
              <h4 className="text-sm font-medium text-primary mb-1">Services:</h4>
              <p className="text-sm text-primary/80 bg-primary/5 p-2 rounded">
                {appointment.services}
              </p>
            </div>
          )}
          
          {/* Client Notes (if admin view) */}
          {isAdmin && appointment.clientNotes && (
            <div className="pt-2">
              <h4 className="text-sm font-medium text-primary mb-1">Notes for Client:</h4>
              <p className="text-sm text-primary/80 bg-primary/5 p-2 rounded">
                {appointment.clientNotes}
              </p>
            </div>
          )}
          
          {/* Internal Notes (if admin view) */}
          {isAdmin && appointment.internalNotes && (
            <div className="pt-2">
              <h4 className="text-sm font-medium text-primary mb-1">Internal Notes:</h4>
              <p className="text-sm text-primary/80 bg-yellow-50 p-2 rounded border border-yellow-200">
                {appointment.internalNotes}
              </p>
            </div>
          )}
          
          {/* Screening Information (if admin view) */}
          {isAdmin && (
            <div className="pt-2 border-t border-border mt-4">
              <h4 className="text-sm font-medium text-primary mb-2 mt-4">Screening Information:</h4>
              
              <div className="flex items-center gap-2 mb-2">
                <span className="text-sm text-primary/60">Status:</span>
                {getScreeningBadge(appointment.screeningStatus || "pending-screening")}
              </div>
              
              {appointment.screeningNotes && (
                <div>
                  <h5 className="text-xs font-medium text-primary/80 mb-1">Screening Notes:</h5>
                  <p className="text-sm text-primary/80 bg-primary/5 p-2 rounded">
                    {appointment.screeningNotes}
                  </p>
                </div>
              )}
            </div>
          )}
          
          {/* Contact Information (if admin view) */}
          {isAdmin && (
            <div className="pt-2 border-t border-border mt-4">
              <h4 className="text-sm font-medium text-primary mb-2 mt-4">Booking Contact Information:</h4>
              
              {appointment.contactName && (
                <div className="flex items-center gap-2 mb-1">
                  <User className="h-4 w-4 text-primary/60" />
                  <span className="text-sm text-primary">{appointment.contactName}</span>
                </div>
              )}
              
              {appointment.contactPhone && (
                <div className="flex items-center gap-2 mb-1">
                  <Phone className="h-4 w-4 text-primary/60" />
                  <span className="text-sm text-primary">{appointment.contactPhone}</span>
                </div>
              )}
              
              {appointment.contactEmail && (
                <div className="flex items-center gap-2 mb-1">
                  <Mail className="h-4 w-4 text-primary/60" />
                  <span className="text-sm text-primary">{appointment.contactEmail}</span>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Action buttons for client */}
        {isClient && appointment.status === "pending" && (
          <div className="flex gap-3 mt-6">
            {onApprove && (
              <Button className="flex-1" variant="default" onClick={onApprove}>
                Approve
              </Button>
            )}
            {onReject && (
              <Button className="flex-1" variant="outline" onClick={onReject}>
                Decline
              </Button>
            )}
          </div>
        )}
        
        {/* Communication log button */}
        <div className="mt-6">
          <Button variant="outline" className="w-full flex items-center justify-center gap-2">
            <MessageSquare className="h-4 w-4" />
            View Communication Log
          </Button>
        </div>
      </div>
    </div>
  );
}

