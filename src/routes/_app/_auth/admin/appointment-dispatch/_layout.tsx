import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { convexQuery, convexMutation } from "@convex-dev/react-query";
import { api } from "@cvx/_generated/api";
import { Button } from "@/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/ui/tabs";
import { AppointmentForm } from "@/components/appointments/AppointmentForm";
import { AppointmentDetails } from "@/components/appointments/AppointmentDetails";
import { PlusIcon, RefreshCw } from "lucide-react";

export const Route = createFileRoute("/_app/_auth/admin/appointment-dispatch/_layout")({
  component: AppointmentDispatch,
});

function AppointmentDispatch() {
  const [activeTab, setActiveTab] = useState("create");
  const [showForm, setShowForm] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
  
  // Get appointments
  const { data: appointments, refetch: refetchAppointments } = useQuery(
    convexQuery(api.app.getAdminAppointments, {})
  );
  
  // Create appointment mutation
  const createAppointmentMutation = useMutation(
    convexMutation(api.app.createAppointment)
  );
  
  // Handle form submission
  const handleSubmit = async (formData: any) => {
    try {
      await createAppointmentMutation.mutateAsync(formData);
      setShowForm(false);
      refetchAppointments();
    } catch (error) {
      console.error("Error creating appointment:", error);
      alert("There was an error creating the appointment. Please try again.");
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
        <h1 className="text-2xl font-bold text-primary">Appointment Dispatch</h1>
        <p className="text-primary/60">
          Create and manage appointment requests for clients
        </p>
      </div>
      
      <Tabs defaultValue="create" value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center mb-4">
          <TabsList>
            <TabsTrigger value="create">Create</TabsTrigger>
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
        
        <TabsContent value="create" className="mt-4">
          <div className="rounded-lg border border-border bg-card p-6">
            {showForm ? (
              <div>
                <h2 className="text-xl font-semibold text-primary mb-4">Create New Appointment</h2>
                <AppointmentForm 
                  onSubmit={handleSubmit} 
                  onCancel={() => setShowForm(false)}
                  isAdmin={true}
                />
              </div>
            ) : (
              <div className="text-center py-12">
                <h2 className="text-xl font-semibold text-primary mb-2">Create New Appointment</h2>
                <p className="text-primary/60 mb-6">
                  Create a new appointment request for a client
                </p>
                <Button 
                  onClick={() => setShowForm(true)}
                  className="flex items-center gap-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  Create Appointment Request
                </Button>
              </div>
            )}
          </div>
        </TabsContent>
        
        <TabsContent value="pending" className="mt-4">
          {pendingAppointments.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pendingAppointments.map((appointment: any) => (
                <AppointmentDetails
                  key={appointment._id}
                  appointment={appointment}
                  isAdmin={true}
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
                  isAdmin={true}
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
                  isAdmin={true}
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
                  isAdmin={true}
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
    </div>
  );
}

