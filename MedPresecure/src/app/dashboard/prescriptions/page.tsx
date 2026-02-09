'use client';

import React, { useState, useMemo } from 'react';
import {
  collection,
  query,
  where,
  orderBy,
  Timestamp,
} from 'firebase/firestore';
import { sub, formatISO } from 'date-fns';
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
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Bell,
  MoreVertical,
  Plus,
  Search,
  Settings,
  Shield,
  SlidersHorizontal,
  Upload,
  X,
  FileSearch,
  LogOut,
  Bot,
  AlertTriangle,
  Info,
  ListChecks,
  Siren,
  Loader2,
} from 'lucide-react';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { AddPrescriptionModal } from '@/components/dashboard/add-prescription-modal';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { analyzePrescription, PrescriptionInsightsOutput } from '@/ai/flows/prescription-insights-flow';
import { Skeleton } from '@/components/ui/skeleton';

type Status = 'Active' | 'Completed' | 'Emergency';

const statusColors: Record<Status, string> = {
  Active: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  Completed: 'bg-blue-50 text-blue-700 border border-blue-200',
  Emergency: 'bg-rose-50 text-rose-700 border border-rose-200',
};

type Prescription = {
  id: string;
  medicineName: string;
  dosage: string;
  frequency: string;
  status: Status;
  notes?: string;
  createdAt: Timestamp;
};

export default function PrescriptionsPage() {
  const { user, isUserLoading, auth } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Status | 'all'>('all');
  const [dateRange, setDateRange] = useState('all');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [insights, setInsights] = useState<PrescriptionInsightsOutput | null>(null);
  const [isLoadingInsights, setIsLoadingInsights] = useState(false);


  const prescriptionsQuery = useMemoFirebase(() => {
    if (!user) return null;

    let q = query(
      collection(firestore, `patients/${user.uid}/prescriptions`),
      orderBy('createdAt', 'desc')
    );

    if (statusFilter !== 'all') {
      q = query(q, where('status', '==', statusFilter));
    }

    if (dateRange !== 'all') {
      let startDate;
      const now = new Date();
      if (dateRange === '30d') {
        startDate = sub(now, { days: 30 });
      } else if (dateRange === '6m') {
        startDate = sub(now, { months: 6 });
      }
      if (startDate) {
        q = query(q, where('createdAt', '>=', Timestamp.fromDate(startDate)));
      }
    }

    return q;
  }, [firestore, user, statusFilter, dateRange]);

  const { data: allPrescriptions, isLoading } = useCollection<Prescription>(
    prescriptionsQuery
  );

  const filteredPrescriptions = useMemo(() => {
    if (!allPrescriptions) return [];
    return allPrescriptions.filter((p) =>
      p.medicineName.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [allPrescriptions, searchTerm]);

  const handleViewDetails = async (prescription: Prescription) => {
    setSelectedPrescription(prescription);
    setIsLoadingInsights(true);
    setInsights(null); // Clear previous insights
    try {
      const pastPrescriptions = allPrescriptions
        ?.filter(p => p.id !== prescription.id && p.createdAt.toDate() < prescription.createdAt.toDate())
        .map(p => ({
          medicineName: p.medicineName,
          dosage: p.dosage,
          startDate: p.createdAt.toDate().toISOString(),
        })) || [];

      const result = await analyzePrescription({
        medicineName: prescription.medicineName,
        dosage: prescription.dosage,
        frequency: prescription.frequency,
        notes: prescription.notes,
        pastPrescriptions,
      });
      setInsights(result);
    } catch (error) {
      console.error("Error fetching AI insights:", error);
      // You could set an error state here to show in the UI
    } finally {
      setIsLoadingInsights(false);
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setStatusFilter('all');
    setDateRange('all');
  };

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

  const renderFilters = (isMobile = false) => (
    <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'flex-row items-center space-x-3'}`}>
      <Select value={dateRange} onValueChange={setDateRange}>
        <SelectTrigger className="w-full md:w-[180px] rounded-xl shadow-sm">
          <SelectValue placeholder="Date Range" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Time</SelectItem>
          <SelectItem value="30d">Last 30 Days</SelectItem>
          <SelectItem value="6m">Last 6 Months</SelectItem>
        </SelectContent>
      </Select>
      <div className="flex items-center gap-2">
        {(['all', 'Active', 'Completed', 'Emergency'] as const).map(
          (status) => (
            <Button
              key={status}
              variant="outline"
              size="sm"
              onClick={() => setStatusFilter(status)}
              className={`capitalize rounded-lg transition-smooth ${statusFilter === status
                  ? 'bg-gradient-primary text-white border-none shadow-md hover:shadow-lg'
                  : 'hover:bg-slate-50'
                }`}
            >
              {status}
            </Button>
          )
        )}
      </div>
      <Button variant="ghost" size="sm" onClick={resetFilters} className="text-slate-600 hover:text-slate-900">
        <X className="mr-2 h-4 w-4" />
        Clear
      </Button>
    </div>
  );

  return (
    <SidebarProvider>
      <AddPrescriptionModal isOpen={isModalOpen} onOpenChange={setIsModalOpen} />
      <Sidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-slate-50">
          <Header title="Prescription Archive" user={user} />

          <main className="flex-1 p-6 space-y-6">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Prescription Archive</h2>
                <p className="text-sm text-slate-600 mt-1">Manage, track, and refill your medical history securely.</p>
              </div>
              <Button onClick={() => setIsModalOpen(true)} className="bg-gradient-primary hover:shadow-lg transition-smooth">
                <Plus className="mr-2 h-4 w-4" /> Add New Prescription
              </Button>
            </div>

            {/* Filters */}
            <Card className="border-none shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <Input
                      placeholder="Search by medicine, doctor, or condition..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-11 h-11 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 transition-smooth shadow-sm"
                    />
                  </div>
                  <div className="hidden md:flex items-center gap-3">
                    {renderFilters()}
                  </div>
                  <div className="md:hidden">
                    <Sheet>
                      <SheetTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full rounded-xl">
                          <SlidersHorizontal className="mr-2 h-4 w-4" />
                          Filters
                        </Button>
                      </SheetTrigger>
                      <SheetContent>
                        <SheetHeader>
                          <SheetTitle>Filter Prescriptions</SheetTitle>
                          <SheetDescription>
                            Refine your search criteria.
                          </SheetDescription>
                        </SheetHeader>
                        <div className="py-4">
                          {renderFilters(true)}
                        </div>
                      </SheetContent>
                    </Sheet>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Table */}
            <Card className="border-none shadow-premium">
              <CardHeader>
                <CardTitle className="text-xl font-bold text-slate-900">Prescription History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-hidden rounded-xl border border-slate-100">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-slate-50 hover:bg-slate-50">
                        <TableHead className="font-semibold text-slate-700">Medicine</TableHead>
                        <TableHead className="font-semibold text-slate-700">Dosage</TableHead>
                        <TableHead className="font-semibold text-slate-700">Frequency</TableHead>
                        <TableHead className="font-semibold text-slate-700">Date</TableHead>
                        <TableHead className="font-semibold text-slate-700">Status</TableHead>
                        <TableHead className="text-right font-semibold text-slate-700">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-24 text-center text-slate-500">
                            Loading prescriptions...
                          </TableCell>
                        </TableRow>
                      ) : filteredPrescriptions.length > 0 ? (
                        filteredPrescriptions.map((p) => (
                          <TableRow key={p.id} className="hover:bg-slate-50 transition-smooth">
                            <TableCell className="font-medium text-slate-900">
                              {p.medicineName}
                            </TableCell>
                            <TableCell className="text-slate-600">{p.dosage}</TableCell>
                            <TableCell className="text-slate-600">{p.frequency}</TableCell>
                            <TableCell className="text-slate-600">
                              {p.createdAt?.toDate().toLocaleDateString()}
                            </TableCell>
                            <TableCell>
                              <Badge
                                className={
                                  statusColors[p.status as Status] ||
                                  'bg-slate-100 text-slate-700 border-slate-200'
                                }
                              >
                                {p.status}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="icon" className="hover:bg-slate-100 rounded-lg">
                                    <MoreVertical className="w-4 h-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end" className="rounded-xl shadow-lg">
                                  <DropdownMenuItem onClick={() => handleViewDetails(p)} className="rounded-lg">
                                    <Bot className="w-4 h-4 mr-2" />
                                    View AI Insights
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </TableCell>
                          </TableRow>
                        ))
                      ) : (
                        <TableRow>
                          <TableCell
                            colSpan={6}
                            className="h-32 text-center"
                          >
                            <div className="flex flex-col items-center justify-center space-y-3">
                              <FileSearch className="h-12 w-12 text-slate-300" />
                              <p className="font-semibold text-slate-900">No prescriptions found</p>
                              <p className="text-sm text-slate-500">
                                Try adjusting your filters or add a new prescription.
                              </p>
                            </div>
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </main>
        </div>

        <Sheet open={!!selectedPrescription} onOpenChange={(open) => !open && setSelectedPrescription(null)}>
          <SheetContent className="sm:max-w-lg overflow-y-auto">
            <SheetHeader className="space-y-3">
              <SheetTitle className="flex items-center gap-2 text-xl">
                <div className="p-2 bg-gradient-primary rounded-lg">
                  <Bot className="w-5 h-5 text-white" />
                </div>
                AI-Powered Insights
              </SheetTitle>
              <SheetDescription className="text-slate-600">
                This AI analysis is for informational purposes only and is not a substitute for professional medical advice.
              </SheetDescription>
            </SheetHeader>
            <div className="py-6 space-y-6">
              {isLoadingInsights ? (
                <div className="space-y-6">
                  <Skeleton className="h-8 w-1/2" />
                  <Skeleton className="h-16 w-full" />
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-12 w-full" />
                  <Skeleton className="h-8 w-1/3" />
                  <Skeleton className="h-12 w-full" />
                </div>
              ) : insights ? (
                <>
                  <div className="bg-slate-50 rounded-xl p-5 border border-slate-100">
                    <h3 className="font-semibold text-lg mb-3 text-slate-900">Medication Details</h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-slate-500 block mb-1">Medicine</span>
                        <span className="text-slate-900 font-medium">{selectedPrescription?.medicineName}</span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-500 block mb-1">Dosage</span>
                        <span className="text-slate-900 font-medium">{selectedPrescription?.dosage}</span>
                      </div>
                      <div>
                        <span className="font-medium text-slate-500 block mb-1">Frequency</span>
                        <span className="text-slate-900 font-medium">{selectedPrescription?.frequency}</span>
                      </div>
                    </div>
                  </div>

                  {insights.alerts && insights.alerts.length > 0 && (
                    <div className="p-4 bg-amber-50 border-l-4 border-amber-400 rounded-r-xl">
                      <h3 className="font-semibold flex items-center gap-2 text-amber-800 mb-2">
                        <Siren size={18} /> AI-Detected Alerts
                      </h3>
                      <ul className="mt-2 space-y-2 text-sm text-amber-700">
                        {insights.alerts.map((alert, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <span className="font-semibold">({alert.level})</span>
                            <span>{alert.message}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="space-y-5">
                    <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                      <h3 className="font-semibold flex items-center gap-2 mb-2 text-blue-900">
                        <Info size={18} /> Medicine Purpose
                      </h3>
                      <p className="text-sm text-blue-700">{insights.medicinePurpose}</p>
                    </div>
                    <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
                      <h3 className="font-semibold flex items-center gap-2 mb-2 text-emerald-900">
                        <ListChecks size={18} /> Intake Schedule
                      </h3>
                      <p className="text-sm text-emerald-700">{insights.intakeSchedule}</p>
                    </div>
                    <div className="p-4 bg-rose-50 rounded-xl border border-rose-100">
                      <h3 className="font-semibold flex items-center gap-2 mb-2 text-rose-900">
                        <AlertTriangle size={18} /> Common Side Effects
                      </h3>
                      <ul className="list-disc list-inside text-sm text-rose-700 space-y-1">
                        {insights.commonSideEffects.map((effect, i) => <li key={i}>{effect}</li>)}
                      </ul>
                    </div>
                    <div className="p-4 bg-purple-50 rounded-xl border border-purple-100">
                      <h3 className="font-semibold flex items-center gap-2 mb-2 text-purple-900">
                        <Bell size={18} /> Follow-up Suggestions
                      </h3>
                      <ul className="list-disc list-inside text-sm text-purple-700 space-y-1">
                        {insights.followUpSuggestions.map((suggestion, i) => <li key={i}>{suggestion}</li>)}
                      </ul>
                    </div>
                  </div>
                </>
              ) : (
                <div className="text-center py-10">
                  <p className="text-gray-500">No insights available for this prescription.</p>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </SidebarInset>
    </SidebarProvider>
  );
}
