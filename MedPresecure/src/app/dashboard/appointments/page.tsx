'use client';

import React, { useState, useMemo } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Bell,
  CalendarCheck,
  CalendarClock,
  CalendarX,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Shield,
  SlidersHorizontal,
  Upload,
  Video,
  Building,
  LogOut,
} from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { useRouter } from 'next/navigation';
import { subDays, startOfDay, endOfDay } from 'date-fns';
import { doctors } from '@/lib/doctors';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';


type Status = 'Confirmed' | 'Pending' | 'Cancelled' | 'Completed';

const statusColors: Record<Status, string> = {
  Confirmed: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Pending: 'bg-amber-50 text-amber-700 border border-amber-200',
  Cancelled: 'bg-rose-50 text-rose-700 border border-rose-200',
  Completed: 'bg-blue-50 text-blue-700 border border-blue-200',
};

export default function AppointmentsPage() {
  const { user, isUserLoading, auth } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [dateRange, setDateRange] = useState('all');

  const appointmentsQuery = useMemoFirebase(() => {
    if (!user) return null;

    let q = query(
      collection(firestore, `patients/${user.uid}/appointments`),
      orderBy('appointmentDateTime', 'desc')
    );

    if (statusFilter !== 'all') {
      q = query(q, where('status', '==', statusFilter));
    }

    if (dateRange !== 'all') {
      let startDate;
      const now = new Date();
      if (dateRange === 'today') {
        startDate = startOfDay(now);
      } else if (dateRange === 'this_week') {
        startDate = subDays(now, 7);
      }
      if (startDate) {
        const endDate = endOfDay(now);
        q = query(q, where('appointmentDateTime', '>=', Timestamp.fromDate(startDate)), where('appointmentDateTime', '<=', Timestamp.fromDate(endDate)));
      }
    }

    return q;
  }, [firestore, user, statusFilter, dateRange]);

  const { data: appointments, isLoading } = useCollection(appointmentsQuery);

  const filteredAppointments = useMemo(() => {
    if (!appointments) return [];
    return appointments.filter(
      (a) =>
        doctors.find(d => d.id === a.doctorId)?.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [appointments, searchTerm]);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  if (isUserLoading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    router.push('/');
    return null;
  }

  const upcomingCount = appointments?.filter(a => a.status === 'Confirmed' && a.appointmentDateTime.toDate() > new Date()).length || 0;
  const completedTodayCount = appointments?.filter(a => a.status === 'Completed' && a.appointmentDateTime.toDate() >= startOfDay(new Date())).length || 0;
  const cancelledCount = appointments?.filter(a => a.status === 'Cancelled').length || 0;

  const getDoctorInfo = (doctorId: string) => {
    return doctors.find(d => d.id === doctorId);
  }

  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-slate-50">
          <Header title="Appointments Management" user={user} />

          <main className="flex-1 p-6 space-y-6">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-3xl font-bold text-slate-900">Appointments Management</h2>
                <p className="text-sm text-slate-600 mt-1">Schedule, manage, and track your healthcare appointments</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="relative w-full md:w-80">
                  <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                  <Input
                    placeholder="Search appointments..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-11 h-11 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 transition-smooth shadow-sm"
                  />
                </div>
                <Button onClick={() => router.push('/dashboard/book-appointment')} className="bg-gradient-primary hover:shadow-lg transition-smooth whitespace-nowrap">
                  <Plus className="mr-2 h-4 w-4" /> New Appointment
                </Button>
              </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4 animate-fade-in">
              <Card className="overflow-hidden border-none shadow-premium hover:shadow-premium-lg transition-smooth">
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500 opacity-10 rounded-bl-full"></div>
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                  <CardTitle className="text-sm font-medium text-slate-600">Total Appointments</CardTitle>
                  <div className="p-3 bg-blue-50 rounded-xl">
                    <CalendarClock className="w-6 h-6 text-blue-600" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-4xl font-bold text-slate-900">{appointments?.length || 0}</div>
                  <p className="text-sm text-blue-600 mt-2 font-medium">+12% from last month</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-none shadow-premium hover:shadow-premium-lg transition-smooth">
                <div className="absolute top-0 right-0 w-24 h-24 bg-primary opacity-10 rounded-bl-full"></div>
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                  <CardTitle className="text-sm font-medium text-slate-600">Upcoming</CardTitle>
                  <div className="p-3 bg-primary/10 rounded-xl">
                    <CalendarClock className="w-6 h-6 text-primary" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-4xl font-bold text-slate-900">{upcomingCount}</div>
                  <p className="text-sm text-slate-500 mt-2">Today: {completedTodayCount}</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-none shadow-premium hover:shadow-premium-lg transition-smooth">
                <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500 opacity-10 rounded-bl-full"></div>
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                  <CardTitle className="text-sm font-medium text-slate-600">Completed</CardTitle>
                  <div className="p-3 bg-emerald-50 rounded-xl">
                    <CalendarCheck className="w-6 h-6 text-emerald-600" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-4xl font-bold text-slate-900">{completedTodayCount}</div>
                  <p className="text-sm text-emerald-600 mt-2 font-medium">This month</p>
                </CardContent>
              </Card>
              <Card className="overflow-hidden border-none shadow-premium hover:shadow-premium-lg transition-smooth">
                <div className="absolute top-0 right-0 w-24 h-24 bg-rose-500 opacity-10 rounded-bl-full"></div>
                <CardHeader className="flex flex-row items-center justify-between pb-2 relative">
                  <CardTitle className="text-sm font-medium text-slate-600">Cancelled</CardTitle>
                  <div className="p-3 bg-rose-50 rounded-xl">
                    <CalendarX className="w-6 h-6 text-rose-600" />
                  </div>
                </CardHeader>
                <CardContent className="relative">
                  <div className="text-4xl font-bold text-slate-900">{cancelledCount}</div>
                  <p className="text-sm text-slate-500 mt-2">All time</p>
                </CardContent>
              </Card>
            </div>

            {/* Appointments Table */}
            <Card className="border-none shadow-premium">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">Appointment History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-xl border border-slate-100">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead className="font-semibold text-slate-700">Patient</TableHead>
                        <TableHead className="font-semibold text-slate-700">Doctor</TableHead>
                        <TableHead className="font-semibold text-slate-700">Date & Time</TableHead>
                        <TableHead className="font-semibold text-slate-700">Type</TableHead>
                        <TableHead className="font-semibold text-slate-700">Status</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow><TableCell colSpan={6} className="h-24 text-center text-slate-500">Loading...</TableCell></TableRow>
                      ) : filteredAppointments.length > 0 ? (
                        filteredAppointments.map((appt) => {
                          const doctor = getDoctorInfo(appt.doctorId);
                          return (
                            <TableRow key={appt.id} className="hover:bg-slate-50 transition-smooth">
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="border-2 border-white shadow-sm">
                                    <AvatarImage src="https://i.pravatar.cc/300" />
                                    <AvatarFallback className="bg-gradient-primary text-white">SN</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-semibold text-slate-900">Sarah Noor</p>
                                    <p className="text-sm text-slate-500">{user.email}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-3">
                                  <Avatar className="border-2 border-white shadow-sm">
                                    <AvatarImage src={doctor?.avatar} />
                                    <AvatarFallback className="bg-primary/10 text-primary">{doctor?.name.charAt(0)}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="font-semibold text-slate-900">{doctor?.name}</p>
                                    <p className="text-sm text-primary">{doctor?.specialty}</p>
                                  </div>
                                </div>
                              </TableCell>
                              <TableCell className="text-slate-600">{appt.appointmentDateTime.toDate().toLocaleString()}</TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2 text-slate-600">
                                  {appt.type === 'Video' ? <Video className="h-4 w-4 text-blue-500" /> : <Building className="h-4 w-4 text-purple-500" />}
                                  <span className="font-medium">{appt.type}</span>
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge className={statusColors[appt.status as Status] || 'bg-slate-100 text-slate-700 border-slate-200'}>{appt.status}</Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <DropdownMenu>
                                  <DropdownMenuTrigger asChild>
                                    <Button variant="ghost" size="icon" className="hover:bg-slate-100 rounded-lg">
                                      <MoreVertical className="w-4 h-4" />
                                    </Button>
                                  </DropdownMenuTrigger>
                                  <DropdownMenuContent align="end" className="rounded-xl shadow-lg">
                                    <DropdownMenuItem className="rounded-lg">Edit</DropdownMenuItem>
                                    <DropdownMenuItem className="rounded-lg">Reschedule</DropdownMenuItem>
                                    <DropdownMenuItem className="text-rose-600 rounded-lg">Cancel</DropdownMenuItem>
                                  </DropdownMenuContent>
                                </DropdownMenu>
                              </TableCell>
                            </TableRow>
                          )
                        })
                      ) : (
                        <TableRow><TableCell colSpan={6} className="h-32 text-center">
                          <div className="flex flex-col items-center gap-2">
                            <CalendarX className="w-12 h-12 text-slate-300" />
                            <p className="font-semibold text-slate-900">No appointments found</p>
                            <p className="text-sm text-slate-500">Book your first appointment to get started</p>
                          </div>
                        </TableCell></TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
