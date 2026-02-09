'use client';

import React, { useState } from 'react';
import {
    Calendar,
    Clock,
    User,
    Check,
    X,
    ExternalLink,
    Filter,
    ArrowRight,
    Stethoscope,
    Phone,
    MapPin,
    AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogDescription,
    DialogFooter
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

export default function HospitalAppointmentsPage() {
    const [activeTab, setActiveTab] = useState('pending');
    const [selectedAppointment, setSelectedAppointment] = useState<any>(null);
    const [rejectReason, setRejectReason] = useState('');

    const appointments = [
        {
            id: 'APT-001',
            patient: 'Rahul Sharma',
            patientId: 'P-552',
            doctor: 'Dr. Anita Desai',
            specialty: 'Pediatrician',
            date: '2026-02-10',
            time: '10:30 AM',
            type: 'In-Person',
            reason: 'Routine checkup for 5 year old',
            status: 'Pending',
            phone: '+91 99887 76655',
            email: 'rahul.s@example.com'
        },
        {
            id: 'APT-002',
            patient: 'Priya Patel',
            patientId: 'P-912',
            doctor: 'Dr. Sameer Khan',
            specialty: 'Cardiologist',
            date: '2026-02-10',
            time: '11:15 AM',
            type: 'Video',
            reason: 'Follow up on heart palpitations',
            status: 'Pending',
            phone: '+91 99887 76656',
            email: 'priya.p@example.com'
        },
        {
            id: 'APT-003',
            patient: 'Karan Singh',
            patientId: 'P-104',
            doctor: 'Dr. Anita Desai',
            specialty: 'Pediatrician',
            date: '2026-02-11',
            time: '09:00 AM',
            type: 'In-Person',
            reason: 'Vaccination',
            status: 'Scheduled',
            phone: '+91 99887 76657',
            email: 'karan.s@example.com'
        },
    ];

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'Pending': return 'bg-amber-50 text-amber-600 border-amber-100';
            case 'Scheduled': return 'bg-blue-50 text-blue-600 border-blue-100';
            case 'Completed': return 'bg-emerald-50 text-emerald-600 border-emerald-100';
            case 'Cancelled': return 'bg-rose-50 text-rose-600 border-rose-100';
            default: return 'bg-slate-50 text-slate-600 border-slate-100';
        }
    };

    const renderAppointmentCard = (apt: any) => (
        <Card key={apt.id} className="border-none shadow-premium hover:shadow-premium-lg transition-smooth group bg-white overflow-hidden">
            <CardContent className="p-0">
                <div className="flex flex-col md:flex-row items-stretch">
                    {/* Left: Time & Info */}
                    <div className="md:w-64 p-6 bg-slate-50 border-r border-slate-100">
                        <div className="flex items-center gap-2 text-teal-600 font-bold">
                            <Calendar className="w-4 h-4" />
                            <span>{apt.date}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2 text-slate-900 font-black text-xl">
                            <Clock className="w-5 h-5 text-slate-400" />
                            <span>{apt.time}</span>
                        </div>
                        <Badge variant="outline" className={`mt-4 rounded-lg px-3 py-1 font-bold tracking-wide uppercase text-[10px] ${getStatusColor(apt.status)}`}>
                            {apt.status}
                        </Badge>
                        <div className="flex items-center gap-2 mt-6 text-xs text-slate-400">
                            <AlertCircle className="w-3.5 h-3.5" />
                            <span>ID: {apt.id}</span>
                        </div>
                    </div>

                    {/* Right: Patient & Doctor */}
                    <div className="flex-1 p-6 flex flex-col justify-between">
                        <div className="flex justify-between items-start gap-4">
                            <div className="flex items-center gap-4">
                                <Avatar className="h-14 w-14 border-2 border-white shadow-md ring-2 ring-teal-50">
                                    <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${apt.patient}`} />
                                    <AvatarFallback>{apt.patient.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
                                </Avatar>
                                <div>
                                    <h3 className="text-xl font-bold text-slate-900">{apt.patient}</h3>
                                    <p className="text-sm text-slate-500 font-medium">Patient ID: {apt.patientId}</p>
                                </div>
                            </div>
                            <Badge className={`${apt.type === 'Video' ? 'bg-indigo-50 text-indigo-600 border-indigo-100' : 'bg-slate-100 text-slate-600 border-slate-200'} border flex gap-1.5 items-center font-bold px-3 py-1.5 rounded-xl`}>
                                {apt.type === 'Video' ? <ExternalLink className="w-3.5 h-3.5" /> : <MapPin className="w-3.5 h-3.5" />}
                                {apt.type}
                            </Badge>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                            <div className="flex flex-col p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Assigned Doctor</span>
                                <p className="font-bold text-slate-800 flex items-center gap-2">
                                    <Stethoscope className="w-4 h-4 text-teal-500" />
                                    {apt.doctor}
                                </p>
                                <p className="text-xs text-slate-500 ml-6">{apt.specialty}</p>
                            </div>
                            <div className="flex flex-col p-4 rounded-xl bg-slate-50 border border-slate-100">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-none mb-1">Reason for visit</span>
                                <p className="text-sm text-slate-700 italic">"{apt.reason}"</p>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 mt-8">
                            {apt.status === 'Pending' ? (
                                <>
                                    <Dialog>
                                        <DialogTrigger asChild>
                                            <Button variant="ghost" className="text-rose-500 hover:bg-rose-50 rounded-xl px-6 font-bold transition-smooth ring-1 ring-inset ring-rose-100">
                                                <X className="w-4 h-4 mr-2" /> Reject
                                            </Button>
                                        </DialogTrigger>
                                        <DialogContent className="border-none shadow-2xl rounded-2xl">
                                            <DialogHeader>
                                                <DialogTitle className="text-2xl font-bold text-slate-900">Reject Appointment</DialogTitle>
                                                <DialogDescription>
                                                    Please provide a reason for rejecting this appointment. The patient will be notified.
                                                </DialogDescription>
                                            </DialogHeader>
                                            <div className="py-4">
                                                <Label htmlFor="reason" className="font-bold text-slate-700 mb-2 block">Rejection Reason</Label>
                                                <Textarea
                                                    id="reason"
                                                    placeholder="e.g. Doctor unavailable on this time slot..."
                                                    className="rounded-xl border-slate-200 bg-slate-50 focus:ring-rose-500/20"
                                                    value={rejectReason}
                                                    onChange={(e) => setRejectReason(e.target.value)}
                                                />
                                            </div>
                                            <DialogFooter>
                                                <Button className="w-full bg-rose-500 hover:bg-rose-600 text-white rounded-xl h-12 font-bold shadow-lg transition-smooth">
                                                    Cancel Appointment
                                                </Button>
                                            </DialogFooter>
                                        </DialogContent>
                                    </Dialog>
                                    <Button className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl px-8 font-bold shadow-md hover:shadow-lg transition-smooth h-11 border-none">
                                        <Check className="w-4 h-4 mr-2" /> Accept Appointment
                                    </Button>
                                </>
                            ) : (
                                <Button variant="ghost" className="text-teal-600 hover:bg-teal-50 rounded-xl font-bold gap-2">
                                    View Details <ArrowRight className="w-4 h-4" />
                                </Button>
                            )}
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <Tabs defaultValue="pending" className="w-full" onValueChange={setActiveTab}>
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
                    <TabsList className="bg-slate-100 p-1.5 border border-slate-200 rounded-2xl h-auto">
                        <TabsTrigger
                            value="pending"
                            className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm font-bold transition-smooth"
                        >
                            Pending
                            <Badge className="ml-2 bg-amber-500 text-white border-none text-[10px]">2</Badge>
                        </TabsTrigger>
                        <TabsTrigger
                            value="scheduled"
                            className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm font-bold transition-smooth"
                        >
                            Scheduled
                        </TabsTrigger>
                        <TabsTrigger
                            value="past"
                            className="rounded-xl px-8 py-3 data-[state=active]:bg-white data-[state=active]:text-teal-600 data-[state=active]:shadow-sm font-bold transition-smooth"
                        >
                            Past
                        </TabsTrigger>
                    </TabsList>

                    <div className="flex gap-2">
                        <Button variant="outline" className="rounded-xl h-12 border-slate-200 font-bold text-slate-600 bg-white hover:bg-slate-50 transition-smooth">
                            <Filter className="w-4 h-4 mr-2" /> Filter
                        </Button>
                    </div>
                </div>

                <TabsContent value="pending" className="space-y-6 animate-slide-in-up">
                    {appointments.filter(a => a.status === 'Pending').map(renderAppointmentCard)}
                </TabsContent>

                <TabsContent value="scheduled" className="space-y-6 animate-slide-in-up">
                    {appointments.filter(a => a.status === 'Scheduled').map(renderAppointmentCard)}
                    {appointments.filter(a => a.status === 'Scheduled').length === 0 && (
                        <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                            <Calendar className="w-12 h-12 text-slate-200 mx-auto" />
                            <h3 className="text-xl font-bold text-slate-900 mt-4">No scheduled appointments</h3>
                            <p className="text-slate-500 mt-2">All upcoming appointments have been handled.</p>
                        </div>
                    )}
                </TabsContent>

                <TabsContent value="past" className="space-y-6 animate-slide-in-up">
                    <div className="py-20 text-center bg-white rounded-3xl border border-slate-100 shadow-sm">
                        <Calendar className="w-12 h-12 text-slate-200 mx-auto" />
                        <h3 className="text-xl font-bold text-slate-900 mt-4">No past history</h3>
                        <p className="text-slate-500 mt-2">Historical appointments will appear here.</p>
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}
