import { useAuth } from "@/hooks/use-auth";
import { useAppointments, useUpdateAppointmentStatus } from "@/hooks/use-appointments";
import { Navbar } from "@/components/layout-navbar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, CheckCircle2, Clock, XCircle, Users, Activity } from "lucide-react";
import { format } from "date-fns";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DoctorDashboard() {
  const { user } = useAuth();
  const { data: appointments, isLoading } = useAppointments();
  const { mutate: updateStatus } = useUpdateAppointmentStatus();

  if (isLoading) return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  const pendingAppointments = appointments?.filter((app) => app.status === "pending") || [];
  const upcomingAppointments = appointments?.filter((app) => app.status === "accepted").sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) || [];
  const historyAppointments = appointments?.filter((app) => ["completed", "rejected", "cancelled"].includes(app.status)) || [];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container py-8 space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-display tracking-tight">Dr. {user?.doctor?.fullName}</h1>
          <p className="text-muted-foreground">Overview of your appointments and patients.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <StatCard icon={<Clock />} label="Pending Requests" value={pendingAppointments.length} />
          <StatCard icon={<Calendar />} label="Upcoming Appointments" value={upcomingAppointments.length} />
          <StatCard icon={<Users />} label="Total Patients" value={new Set(appointments?.map(a => a.patientId)).size || 0} />
        </div>

        <Tabs defaultValue="requests" className="w-full">
          <TabsList className="grid w-full grid-cols-3 lg:w-[400px]">
            <TabsTrigger value="requests">Requests ({pendingAppointments.length})</TabsTrigger>
            <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          <TabsContent value="requests" className="space-y-4 mt-6">
            {pendingAppointments.length === 0 ? (
              <p className="text-muted-foreground text-center py-8">No pending appointment requests.</p>
            ) : (
              pendingAppointments.map((app) => (
                <Card key={app.id}>
                  <CardContent className="p-6 flex flex-col md:flex-row justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">{app.patient?.fullName}</h3>
                      <div className="text-sm text-muted-foreground space-y-1 mt-1">
                        <p>{format(new Date(app.date), "PPP p")}</p>
                        <p className="bg-muted inline-block px-2 py-1 rounded text-xs mt-2">
                          Symptoms: {app.symptoms}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        className="text-destructive border-destructive/20 hover:bg-destructive/5"
                        onClick={() => updateStatus({ id: app.id, status: "rejected" })}
                      >
                        Decline
                      </Button>
                      <Button 
                        size="sm"
                        onClick={() => updateStatus({ id: app.id, status: "accepted" })}
                      >
                        Accept Request
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4 mt-6">
            {upcomingAppointments.map((app) => (
              <Card key={app.id}>
                <CardContent className="p-6 flex flex-col md:flex-row justify-between gap-4">
                  <div>
                    <h3 className="font-semibold text-lg">{app.patient?.fullName}</h3>
                    <div className="flex items-center gap-2 text-muted-foreground text-sm mt-1">
                      <Calendar className="h-4 w-4" />
                      <span>{format(new Date(app.date), "PPP p")}</span>
                    </div>
                  </div>
                  <Button 
                    size="sm" 
                    variant="secondary"
                    onClick={() => updateStatus({ id: app.id, status: "completed" })}
                  >
                    Mark Complete
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
           <TabsContent value="history" className="space-y-4 mt-6">
            {historyAppointments.map((app) => (
              <Card key={app.id} className="bg-muted/30">
                <CardContent className="p-6">
                   <div className="flex justify-between">
                     <h3 className="font-medium">{app.patient?.fullName}</h3>
                     <Badge variant="outline">{app.status}</Badge>
                   </div>
                   <p className="text-sm text-muted-foreground">{format(new Date(app.date), "PPP")}</p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

function StatCard({ icon, label, value }: { icon: any, label: string, value: number }) {
  return (
    <Card>
      <CardContent className="p-6 flex items-center gap-4">
        <div className="p-3 bg-primary/10 rounded-full text-primary">
          {icon}
        </div>
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="text-2xl font-bold">{value}</p>
        </div>
      </CardContent>
    </Card>
  );
}
