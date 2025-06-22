import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { convexQuery, convexMutation } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";
import { Button } from "@/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { AppointmentDetails } from "@/components/appointments/AppointmentDetails";
import { RefreshCw } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/ui/dialog";
import { Textarea } from "@/ui/textarea";
import { Label } from "@/ui/label";

export const Route = createFileRoute("/_app/_auth/client/appointment-approval/_layout")({
  component: AppointmentApproval,
});

function AppointmentApproval() {
  const [activeTab, setActiveTab] = useState("pending");
  const [responseNotes, setResponseNotes] = useState("");
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  const [showApproveDialog, setShowApproveDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  
  // Get appointments
  const { data: appointments, refetch: refetchAppointments } = useQuery(
    convexQuery(api.app.getClientAppointments, {})
  );
  
  // Respond to appointment mutation
  const respondToAppointmentMutation = useMutation(
    convexMutation(api.app.respondToAppointment)
  );
  
  // Handle appointment approval
  const handleApprove = async () => {
    if (!selectedAppointment) return;
    
    try {
      await respondToAppointmentMutation.mutateAsync({
        appointmentId: selectedAppointment._id,
        approved: true,
        responseNotes,
      });
      
      setShowApproveDialog(false);
      setResponseNotes("");
      setSelectedAppointment(null);
      refetchAppointments();
    } catch (error) {
      console.error("Error approving appointment:", error);
      alert("There was an error approving the appointment. Please try again.");
    }
  };
  
  // Handle appointment rejection
  const handleReject = async () => {
    if (!selectedAppointment) return;
    
    try {
      await respondToAppointmentMutation.mutateAsync({
        appointmentId: selectedAppointment._id,
        approved: false,
        responseNotes,
      });
      
      setShowRejectDialog(false);
      setResponseNotes("");
      setSelectedAppointment(null);
      refetchAppointments();
    } catch (error) {
      console.error("Error rejecting appointment:", error);
      alert("There was an error rejecting the appointment. Please try again.");
    }
  };
  
  // Filter appointments by status
  const pendingAppointments = appointments?.filter((apt: any) => apt.status === "pending") || [];
  const approvedAppointments = appointments?.filter((apt: any) => apt.status === "approved") || [];
  const rejectedAppointments = appointments?.filter((apt: any) => apt.status === "rejected") || [];
  const completedAppointments = appointments?.filter((apt: any) => apt.status === "completed") || [];
  
  return (
    <div className="mx-auto w-full max-w-screen-xl p-6">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-primary">Appointment Approval</h1>
        <p className="text-primary/60">
          Review and approve appointment requests from your admin
        </p>
      </div>
      
      <Tabs defaultValue="pending" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="pending">
              Pending
              {pendingAppointments.length > 0 && (
                <span className="ml-2 bg-primary/10 text-primary text-xs px-2 py-0.5 rounded-full">
                  {pendingAppointments.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="approved">
              Approved
              {approvedAppointments.length > 0 && (
                <span className="ml-2 bg-green-100 text-green-800 text-xs px-2 py-0.5 rounded-full">
                  {approvedAppointments.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="rejected">
              Rejected
              {rejectedAppointments.length > 0 && (
                <span className="ml-2 bg-red-100 text-red-800 text-xs px-2 py-0.5 rounded-full">
                  {rejectedAppointments.length}
                </span>
              )}
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed
              {completedAppointments.length > 0 && (
                <span className="ml-2 bg-blue-100 text-blue-800 text-xs px-2 py-0.5 rounded-full">
                  {completedAppointments.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>
          
          <Button 
            size="sm" 
            variant="outline" 
            onClick={() => refetchAppointments()}
            className="flex items-center gap-1"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
        
        <TabsContent value="pending" className="mt-4">
          {pendingAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingAppointments.map((appointment: any) => (
                <AppointmentDetails
                  key={appointment._id}
                  appointment={appointment}
                  isClient={true}
                  onApprove={() => {
                    setSelectedAppointment(appointment);
                    setShowApproveDialog(true);
                  }}
                  onReject={() => {
                    setSelectedAppointment(appointment);
                    setShowRejectDialog(true);
                  }}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="text-center py-12">
                <p className="text-primary/60">No pending appointment requests</p>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="approved" className="mt-4">
          {approvedAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {approvedAppointments.map((appointment: any) => (
                <AppointmentDetails
                  key={appointment._id}
                  appointment={appointment}
                  isClient={true}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="text-center py-12">
                <p className="text-primary/60">No approved appointments</p>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="rejected" className="mt-4">
          {rejectedAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {rejectedAppointments.map((appointment: any) => (
                <AppointmentDetails
                  key={appointment._id}
                  appointment={appointment}
                  isClient={true}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="text-center py-12">
                <p className="text-primary/60">No rejected appointments</p>
              </div>
            </div>
          )}
        </TabsContent>
        
        <TabsContent value="completed" className="mt-4">
          {completedAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedAppointments.map((appointment: any) => (
                <AppointmentDetails
                  key={appointment._id}
                  appointment={appointment}
                  isClient={true}
                />
              ))}
            </div>
          ) : (
            <div className="rounded-lg border border-border bg-card p-6">
              <div className="text-center py-12">
                <p className="text-primary/60">No completed appointments</p>
              </div>
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      {/* Approve Dialog */}
      <Dialog open={showApproveDialog} onOpenChange={setShowApproveDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Approve Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to approve this appointment? You can add optional notes below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="responseNotes" className="block text-sm font-medium text-primary/80 mb-2">
              Response Notes (Optional)
            </Label>
            <Textarea
              id="responseNotes"
              value={responseNotes}
              onChange={(e) => setResponseNotes(e.target.value)}
              placeholder="Add any notes or special requests..."
              rows={4}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowApproveDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleApprove}>
              Approve Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Reject Dialog */}
      <Dialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Decline Appointment</DialogTitle>
            <DialogDescription>
              Are you sure you want to decline this appointment? Please provide a reason below.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <Label htmlFor="responseNotes" className="block text-sm font-medium text-primary/80 mb-2">
              Reason for Declining <span className="text-red-500">*</span>
            </Label>
            <Textarea
              id="responseNotes"
              value={responseNotes}
              onChange={(e) => setResponseNotes(e.target.value)}
              placeholder="Please provide a reason for declining..."
              rows={4}
              required
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowRejectDialog(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleReject} disabled={!responseNotes.trim()}>
              Decline Appointment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

