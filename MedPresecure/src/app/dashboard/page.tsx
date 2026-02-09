'use client';

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import {
  Bell,
  Download,
  FileText,
  HeartPulse,
  MoreVertical,
  Pill,
  Plus,
  Search,
  Settings,
  Stethoscope,
  Upload,
  User,
  Video,
  LogOut,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarProvider,
  SidebarInset,
  SidebarFooter,
  SidebarGroup,
  SidebarSeparator,
  SidebarTrigger,
  SidebarGroupLabel,
} from '@/components/ui/sidebar';
import { Shield } from 'lucide-react';
import React, { useState } from 'react';
import { AddPrescriptionModal } from '@/components/dashboard/add-prescription-modal';
import { collection } from 'firebase/firestore';
import Link from 'next/link';

const appointments = [
  {
    doctor: 'Dr. John Doe',
    specialty: 'Cardiologist',
    date: 'Oct 24, 2024',
    time: '10:30 AM',
    type: 'Video Consultation',
    icon: <Video className="text-blue-500" />,
  },
  {
    doctor: 'Dr. Jane Smith',
    specialty: 'Dermatologist',
    date: 'Nov 12, 2024',
    time: '02:00 PM',
    type: 'In-Person',
    icon: <Stethoscope className="text-green-500" />,
  },
];


const uploads = [
  { name: 'Blood Test Results.pdf', date: '2024-07-15', icon: <FileText /> },
  { name: 'MRI Scan.jpg', date: '2024-07-10', icon: <FileText /> },
];

export default function DashboardPage() {
  const { user, isUserLoading, auth } = useUser();
  const router = useRouter();
  const firestore = useFirestore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const prescriptionsQuery = useMemoFirebase(() => {
    if (!user) return null;
    return collection(firestore, 'patients', user.uid, 'prescriptions');
  }, [firestore, user]);

  const { data: medications, isLoading: medicationsLoading } = useCollection(prescriptionsQuery);


  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push('/');
    return null;
  }

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <SidebarProvider>
      <AddPrescriptionModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2">
            <Shield className="w-6 h-6 text-primary" />
            <span className="text-lg font-semibold">Aarogyam</span>
          </div>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => handleNavigation('/dashboard')} isActive>Dashboard</SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => handleNavigation('/dashboard/prescriptions')}>Prescriptions</SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => handleNavigation('/dashboard/appointments')}>Appointments</SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => handleNavigation('/dashboard/doctors')}>Doctors</SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => handleNavigation('/dashboard/chat')}>AI Health Assistant</SidebarMenuButton>
            </SidebarMenuItem>
            <SidebarMenuItem>
              <SidebarMenuButton onClick={() => handleNavigation('/dashboard/settings')}>Settings</SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter>
          <SidebarSeparator />
          <div className="flex items-center gap-3 p-2">
            <Avatar>
              <AvatarImage src="https://i.pravatar.cc/300" alt="User avatar" />
              <AvatarFallback>SN</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <p className="text-sm font-semibold">Sarah Noor</p>
              <p className="text-xs text-muted-foreground">
                Patient ID: {user.uid.slice(0, 7)}
              </p>
            </div>
            <Button variant="ghost" size="icon" onClick={() => auth?.signOut()}><LogOut className="w-5 h-5" /></Button>
          </div>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <div className="flex flex-col min-h-screen">
          <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 bg-white border-b shadow-sm">
            <div className="flex items-center gap-4">
              <SidebarTrigger />
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  placeholder="Search anything..."
                  className="w-96 pl-11 h-10 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 transition-smooth shadow-sm"
                />
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-smooth relative">
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
              </Button>
              <Button variant="ghost" size="icon" className="text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-smooth">
                <Upload className="w-5 h-5" />
              </Button>
            </div>
          </header>
          <main className="flex-1 p-6 bg-slate-50">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-slate-900">Good Morning, Sarah</h1>
                <p className="text-slate-600 mt-1">Here's your health overview for today</p>
              </div>
              <Button className="bg-gradient-primary hover:shadow-lg transition-smooth shadow-md" onClick={() => setIsModalOpen(true)}>
                <Plus className="w-5 h-5 mr-2" /> Add New Prescription
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-6 mb-8 md:grid-cols-3">
              <Card className="overflow-hidden border-none shadow-premium hover:shadow-premium-lg transition-smooth animate-fade-in">
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-10 rounded-bl-full"></div>
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Total Prescriptions
                  </CardTitle>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <Pill className="w-6 h-6 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-4xl font-bold text-slate-900">{medications?.length || 0}</div>
                  <p className="text-sm text-emerald-600 mt-2 font-medium">+12% from last month</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-none shadow-premium hover:shadow-premium-lg transition-smooth animate-fade-in" style={{ animationDelay: '0.1s' }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-accent opacity-10 rounded-bl-full"></div>
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Active Medicines
                  </CardTitle>
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <HeartPulse className="w-6 h-6 text-emerald-600" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-4xl font-bold text-slate-900">{medications?.filter(m => m.status === 'Active').length || 0}</div>
                  <p className="text-sm text-slate-500 mt-2 font-medium">Currently taking</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-none shadow-premium hover:shadow-premium-lg transition-smooth animate-fade-in" style={{ animationDelay: '0.2s' }}>
                <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-primary opacity-10 rounded-bl-full"></div>
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                  <CardTitle className="text-sm font-medium text-slate-600">
                    Next Appointment
                  </CardTitle>
                  <div className="p-3 bg-rose-50 rounded-xl">
                    <Stethoscope className="w-6 h-6 text-rose-600" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-4xl font-bold text-slate-900">Oct 24</div>
                  <p className="text-sm text-slate-500 mt-2 font-medium">10:30 AM with Dr. John</p>
                </CardContent>
              </Card>
            </div>

            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2">
                <Card className="border-none shadow-premium">
                  <CardHeader className="flex flex-row items-center justify-between">
                    <CardTitle className="text-xl font-bold text-slate-900">Current Medications</CardTitle>
                    <Link href="/dashboard/prescriptions">
                      <Button variant="ghost" className="text-primary hover:text-primary/80 hover:bg-primary/5">View All →</Button>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="overflow-hidden rounded-xl border border-slate-100">
                      <Table>
                        <TableHeader>
                          <TableRow className="bg-slate-50 hover:bg-slate-50">
                            <TableHead className="font-semibold text-slate-700">Medicine</TableHead>
                            <TableHead className="font-semibold text-slate-700">Dosage</TableHead>
                            <TableHead className="font-semibold text-slate-700">Frequency</TableHead>
                            <TableHead className="font-semibold text-slate-700">Status</TableHead>
                            <TableHead className="text-right font-semibold text-slate-700">Action</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {medicationsLoading && (
                            <TableRow>
                              <TableCell colSpan={5} className="text-center py-8 text-slate-500">
                                Loading medications...
                              </TableCell>
                            </TableRow>
                          )}
                          {!medicationsLoading && medications && medications.slice(0, 5).map((med, index) => (
                            <TableRow key={index} className="hover:bg-slate-50 transition-smooth">
                              <TableCell className="font-medium text-slate-900">{med.medicineName}</TableCell>
                              <TableCell className="text-slate-600">{med.dosage}</TableCell>
                              <TableCell className="text-slate-600">{med.frequency}</TableCell>
                              <TableCell>
                                <Badge className={`${med.status === 'Active'
                                    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
                                    : 'bg-red-100 text-red-700 border-red-200'
                                  } border font-medium`}>
                                  {med.status || 'Active'}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="hover:bg-slate-100 rounded-lg transition-smooth">
                                      <MoreVertical className="w-5 h-5 text-slate-500" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent className="rounded-xl shadow-lg border-slate-200">
                                    <DropdownMenuItem className="cursor-pointer">View Details</DropdownMenuItem>
                                    <DropdownMenuItem className="cursor-pointer">
                                      Set Reminder
                                    </DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </div>
                  </CardContent>
                </Card>

                <Card className="mt-6 border-none shadow-premium">
                  <CardHeader>
                    <CardTitle className="text-xl font-bold text-slate-900">Recent Uploads</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {uploads.map((upload, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-4 bg-slate-50 rounded-xl hover:bg-slate-100 transition-smooth border border-slate-100 hover:border-slate-200"
                        >
                          <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-lg shadow-sm border border-slate-200">
                              <FileText className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                              <p className="font-semibold text-slate-900">{upload.name}</p>
                              <p className="text-sm text-slate-500">
                                {upload.date}
                              </p>
                            </div>
                          </div>
                          <Button variant="outline" size="sm" className="rounded-lg border-slate-200 hover:bg-primary hover:text-white hover:border-primary transition-smooth">
                            <Download className="w-4 h-4 mr-2" />
                            Download
                          </Button>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="border-none shadow-premium">
                <CardHeader>
                  <CardTitle className="text-xl font-bold text-slate-900">Upcoming Appointments</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {appointments.map((appt, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-4 p-4 border border-slate-100 rounded-xl hover:border-primary/30 hover:shadow-md transition-smooth bg-white"
                      >
                        <div className="p-3 bg-gradient-to-br from-primary/10 to-accent/10 rounded-xl">
                          {appt.icon}
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-slate-900">{appt.doctor}</p>
                          <p className="text-sm text-slate-500 mt-0.5">
                            {appt.specialty}
                          </p>
                          <div className="mt-3 flex flex-col gap-1">
                            <p className="text-sm font-medium text-slate-700">
                              {appt.date} at {appt.time}
                            </p>
                            <Badge variant="outline" className="w-fit text-xs border-primary/30 text-primary">{appt.type}</Badge>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
