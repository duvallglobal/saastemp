import React, { useState, useEffect } from "react";
import { Button } from "@/ui/button";
import { Input } from "@/ui/input";
import { Label } from "@/ui/label";
import { Textarea } from "@/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/ui/select";
import { RadioGroup, RadioGroupItem } from "@/ui/radio-group";
import { Calendar } from "@/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/ui/popover";
import { cn } from "@/utils/misc";
import { format } from "date-fns";
import { CalendarIcon, Clock } from "lucide-react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { convexQuery, convexMutation } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";

interface AppointmentFormProps {
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
  isAdmin?: boolean;
}

export function AppointmentForm({ onSubmit, onCancel, isAdmin = true }: AppointmentFormProps) {
  // Get clients list if admin
  const { data: clients } = useQuery(
    convexQuery(api.app.getClients, {}),
    {
      enabled: isAdmin,
    }
  );
  
  const [formData, setFormData] = useState({
    // 1. Client Selection
    clientId: "",
    
    // 2. Appointment Type
    appointmentType: "outcall",
    
    // 3. Location Address (Conditional)
    locationAddress: "",
    
    // 4. Appointment Date
    appointmentDate: null as Date | null,
    
    // 5. Start Time
    startTime: "",
    
    // 6. Duration
    duration: "1",
    durationDetails: "",
    
    // 7. Services to be Provided
    services: "",
    
    // 8. Agreed Rate/Price
    rate: "",
    
    // 9. Booking Contact Name
    contactName: "",
    
    // 10. Booking Contact Phone
    contactPhone: "",
    
    // 11. Booking Contact Email
    contactEmail: "",
    
    // 12. Screening Status
    screeningStatus: "pending-screening",
    
    // 13. Screening Notes
    screeningNotes: "",
    
    // 14. Communication Logs & Attachments
    // (This would be handled separately)
    
    // 15. Internal Notes
    internalNotes: "",
    
    // 16. Notes for Client
    clientNotes: "",
  });
  
  const [showLocationField, setShowLocationField] = useState(
    formData.appointmentType === "outcall"
  );
  
  const [showDurationDetails, setShowDurationDetails] = useState(
    formData.duration === "other"
  );
  
  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Handle conditional fields
    if (name === "appointmentType") {
      setShowLocationField(value === "outcall");
    }
    
    if (name === "duration") {
      setShowDurationDetails(value === "other");
    }
  };
  
  const handleDateChange = (date: Date | null) => {
    setFormData(prev => ({ ...prev, appointmentDate: date }));
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate required fields
    if (!formData.clientId && isAdmin) {
      alert("Please select a client");
      return;
    }
    
    if (!formData.appointmentDate) {
      alert("Please select an appointment date");
      return;
    }
    
    if (!formData.startTime) {
      alert("Please select a start time");
      return;
    }
    
    if (!formData.duration) {
      alert("Please select a duration");
      return;
    }
    
    if (formData.appointmentType === "outcall" && !formData.locationAddress) {
      alert("Please enter a location address for outcall");
      return;
    }
    
    if (!formData.rate) {
      alert("Please enter an agreed rate");
      return;
    }
    
    // Format data for submission
    const submissionData = {
      ...formData,
      appointmentDate: formData.appointmentDate ? format(formData.appointmentDate, "yyyy-MM-dd") : null,
    };
    
    // Call onSubmit callback if provided
    if (onSubmit) {
      onSubmit(submissionData);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* 1. Client Selection (Admin only) */}
      {isAdmin && (
        <div>
          <Label htmlFor="clientId" className="block text-sm font-medium text-primary/80">
            1. Client Selection <span className="text-red-500">*</span>
          </Label>
          <Select 
            value={formData.clientId} 
            onValueChange={(value) => handleSelectChange("clientId", value)}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select client" />
            </SelectTrigger>
            <SelectContent>
              {clients?.map((client: any) => (
                <SelectItem key={client._id} value={client._id}>
                  {client.name || client.email || "Unknown Client"}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <p className="text-xs text-primary/60 mt-1">
            Purpose: To select the specific Rent.Men client for whom the appointment is being scheduled.
          </p>
        </div>
      )}
      
      {/* 2. Appointment Type */}
      <div>
        <Label htmlFor="appointmentType" className="block text-sm font-medium text-primary/80">
          2. Appointment Type <span className="text-red-500">*</span>
        </Label>
        <RadioGroup 
          value={formData.appointmentType} 
          onValueChange={(value) => handleSelectChange("appointmentType", value)}
          className="flex space-x-4 mt-1"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="incall" id="incall" />
            <Label htmlFor="incall">Incall</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="outcall" id="outcall" />
            <Label htmlFor="outcall">Outcall</Label>
          </div>
        </RadioGroup>
        <p className="text-xs text-primary/60 mt-1">
          Purpose: Specify whether the appointment is at the client's location (incall) or an external location (outcall).
        </p>
      </div>
      
      {/* 3. Location Address (Conditional) */}
      {showLocationField && (
        <div>
          <Label htmlFor="locationAddress" className="block text-sm font-medium text-primary/80">
            3. Location Address <span className="text-red-500">*</span>
          </Label>
          <Textarea
            id="locationAddress"
            name="locationAddress"
            value={formData.locationAddress}
            onChange={handleChange}
            placeholder="Enter address for outcall"
            className="mt-1"
            rows={2}
            required={formData.appointmentType === "outcall"}
          />
          <p className="text-xs text-primary/60 mt-1">
            Purpose: To specify the exact address of the outcall appointment.
          </p>
        </div>
      )}
      
      {/* 4. Appointment Date */}
      <div>
        <Label htmlFor="appointmentDate" className="block text-sm font-medium text-primary/80">
          4. Appointment Date <span className="text-red-500">*</span>
        </Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal mt-1",
                !formData.appointmentDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {formData.appointmentDate ? format(formData.appointmentDate, "PPP") : <span>Pick a date</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={formData.appointmentDate}
              onSelect={handleDateChange}
              initialFocus
            />
          </PopoverContent>
        </Popover>
        <p className="text-xs text-primary/60 mt-1">
          Purpose: To set the proposed date for the appointment.
        </p>
      </div>
      
      {/* 5. Start Time */}
      <div>
        <Label htmlFor="startTime" className="block text-sm font-medium text-primary/80">
          5. Start Time <span className="text-red-500">*</span>
        </Label>
        <div className="flex items-center mt-1">
          <Button variant="outline" className="w-full justify-start text-left font-normal">
            <Clock className="mr-2 h-4 w-4" />
            <Input
              type="time"
              id="startTime"
              name="startTime"
              value={formData.startTime}
              onChange={handleChange}
              className="border-none p-0 focus-visible:ring-0"
              required
            />
          </Button>
        </div>
        <p className="text-xs text-primary/60 mt-1">
          Purpose: To set the proposed start time of the appointment.
        </p>
      </div>
      
      {/* 6. Duration */}
      <div>
        <Label htmlFor="duration" className="block text-sm font-medium text-primary/80">
          6. Duration <span className="text-red-500">*</span>
        </Label>
        <Select 
          value={formData.duration} 
          onValueChange={(value) => handleSelectChange("duration", value)}
        >
          <SelectTrigger className="w-full mt-1">
            <SelectValue placeholder="Select duration" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="1">1 hour</SelectItem>
            <SelectItem value="2">2 hours</SelectItem>
            <SelectItem value="3">3 hours</SelectItem>
            <SelectItem value="4">4 hours</SelectItem>
            <SelectItem value="travel-companion">Travel Companion</SelectItem>
            <SelectItem value="overnight">Overnight</SelectItem>
            <SelectItem value="other">Other (Specify)</SelectItem>
          </SelectContent>
        </Select>
        
        {showDurationDetails && (
          <Input
            id="durationDetails"
            name="durationDetails"
            value={formData.durationDetails}
            onChange={handleChange}
            placeholder="Specify duration or details"
            className="mt-2"
            required={formData.duration === "other"}
          />
        )}
        <p className="text-xs text-primary/60 mt-1">
          Purpose: Define length/nature of booking.
        </p>
      </div>
      
      {/* 7. Services to be Provided */}
      <div>
        <Label htmlFor="services" className="block text-sm font-medium text-primary/80">
          7. Services to be Provided
        </Label>
        <Textarea
          id="services"
          name="services"
          value={formData.services}
          onChange={handleChange}
          placeholder="Detail agreed services (free-form)"
          className="mt-1"
          rows={3}
        />
        <p className="text-xs text-primary/60 mt-1">
          Purpose: Detail agreed services (free-form).
        </p>
      </div>
      
      {/* 8. Agreed Rate/Price */}
      <div>
        <Label htmlFor="rate" className="block text-sm font-medium text-primary/80">
          8. Agreed Rate/Price <span className="text-red-500">*</span>
        </Label>
        <div className="relative mt-1">
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
            <span className="text-gray-500 sm:text-sm">$</span>
          </div>
          <Input
            type="number"
            id="rate"
            name="rate"
            value={formData.rate}
            onChange={handleChange}
            className="pl-7"
            placeholder="0.00"
            required
          />
        </div>
        <p className="text-xs text-primary/60 mt-1">
          Purpose: Specify financial terms.
        </p>
      </div>
      
      {/* 9. Booking Contact Name */}
      <div>
        <Label htmlFor="contactName" className="block text-sm font-medium text-primary/80">
          9. Booking Contact Name
        </Label>
        <Input
          id="contactName"
          name="contactName"
          value={formData.contactName}
          onChange={handleChange}
          placeholder="Enter contact name"
          className="mt-1"
        />
        <p className="text-xs text-primary/60 mt-1">
          Purpose: For internal records – the name or alias of the individual booking the client.
        </p>
      </div>
      
      {/* 10. Booking Contact Phone */}
      <div>
        <Label htmlFor="contactPhone" className="block text-sm font-medium text-primary/80">
          10. Booking Contact Phone
        </Label>
        <Input
          id="contactPhone"
          name="contactPhone"
          value={formData.contactPhone}
          onChange={handleChange}
          placeholder="Enter contact phone"
          className="mt-1"
        />
        <p className="text-xs text-primary/60 mt-1">
          Purpose: For internal records and potential follow-up – phone number of the individual booking the client.
        </p>
      </div>
      
      {/* 11. Booking Contact Email */}
      <div>
        <Label htmlFor="contactEmail" className="block text-sm font-medium text-primary/80">
          11. Booking Contact Email
        </Label>
        <Input
          id="contactEmail"
          name="contactEmail"
          type="email"
          value={formData.contactEmail}
          onChange={handleChange}
          placeholder="Enter contact email"
          className="mt-1"
        />
        <p className="text-xs text-primary/60 mt-1">
          Purpose: For internal records and potential follow-up – email address of the individual booking the client.
        </p>
      </div>
      
      {/* 12. Screening Status */}
      {isAdmin && (
        <div>
          <Label htmlFor="screeningStatus" className="block text-sm font-medium text-primary/80">
            12. Screening Status
          </Label>
          <Select 
            value={formData.screeningStatus} 
            onValueChange={(value) => handleSelectChange("screeningStatus", value)}
          >
            <SelectTrigger className="w-full mt-1">
              <SelectValue placeholder="Select screening status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="screening-complete">Screening Complete</SelectItem>
              <SelectItem value="pending-screening">Pending Screening</SelectItem>
              <SelectItem value="screening-waived">Screening Waived - Repeat Client</SelectItem>
              <SelectItem value="screening-failed">Screening Failed</SelectItem>
              <SelectItem value="further-info-required">Further Information Required</SelectItem>
            </SelectContent>
          </Select>
          <p className="text-xs text-primary/60 mt-1">
            Purpose: To quickly categorize the screening status of the end-customer.
          </p>
        </div>
      )}
      
      {/* 13. Screening Notes */}
      {isAdmin && (
        <div>
          <Label htmlFor="screeningNotes" className="block text-sm font-medium text-primary/80">
            13. Screening Notes
          </Label>
          <Textarea
            id="screeningNotes"
            name="screeningNotes"
            value={formData.screeningNotes}
            onChange={handleChange}
            placeholder="Enter screening notes"
            className="mt-1"
            rows={2}
          />
          <p className="text-xs text-primary/60 mt-1">
            Purpose: For internal tracking – detailed notes about the screening process, observations, or information gathered about the end-customer.
          </p>
        </div>
      )}
      
      {/* 15. Internal Notes (Admin Only) */}
      {isAdmin && (
        <div>
          <Label htmlFor="internalNotes" className="block text-sm font-medium text-primary/80">
            15. Internal Notes (Admin Only)
          </Label>
          <Textarea
            id="internalNotes"
            name="internalNotes"
            value={formData.internalNotes}
            onChange={handleChange}
            placeholder="Enter internal notes"
            className="mt-1"
            rows={2}
          />
          <p className="text-xs text-primary/60 mt-1">
            Purpose: A private field for the Administrator to add notes about the appointment, the booker, or any other relevant details that the Rent.Men client will not see.
          </p>
        </div>
      )}
      
      {/* 16. Notes for Client (Visible to Client in Proposal) */}
      {isAdmin && (
        <div>
          <Label htmlFor="clientNotes" className="block text-sm font-medium text-primary/80">
            16. Notes for Client (Visible to Client in Proposal)
          </Label>
          <Textarea
            id="clientNotes"
            name="clientNotes"
            value={formData.clientNotes}
            onChange={handleChange}
            placeholder="Enter notes for client"
            className="mt-1"
            rows={2}
          />
          <p className="text-xs text-primary/60 mt-1">
            Purpose: To include any specific instructions, reminders, or messages that the Administrator wants the Rent.Men client to see when they review the proposal.
          </p>
        </div>
      )}
      
      {/* Form Actions */}
      <div className="flex justify-end space-x-2 pt-4">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancel
          </Button>
        )}
        <Button type="submit">
          {isAdmin ? "Create Appointment Request" : "Submit"}
        </Button>
      </div>
    </form>
  );
}

