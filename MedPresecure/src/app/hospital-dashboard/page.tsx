'use client';

import React from 'react';
import {
    Users,
    Calendar,
    FileText,
    TrendingUp,
    Clock,
    CheckCircle2,
    XCircle,
    ArrowRight,
    Settings
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export default function HospitalOverviewPage() {
    const stats = [
        {
            title: 'Active Doctors',
            count: 24,
            icon: Users,
            color: 'bg-teal-500',
            trend: '+2 this month',
            gradient: 'from-teal-500 to-emerald-500'
        },
        {
            title: 'Pending Appointments',
            count: 12,
            icon: Clock,
            color: 'bg-amber-500',
            trend: 'Needs urgent review',
            gradient: 'from-amber-400 to-orange-500'
        },
        {
            title: 'Prescriptions Issued',
            count: 156,
            icon: FileText,
            color: 'bg-emerald-500',
            trend: '+12% from last week',
            gradient: 'from-emerald-500 to-cyan-500'
        },
        {
            title: 'Completion Rate',
            count: '98%',
            icon: TrendingUp,
            color: 'bg-blue-500',
            trend: 'High performance',
            gradient: 'from-blue-500 to-indigo-500'
        }
    ];

    const recentAppointments = [
        { id: 1, patient: 'Rahul Sharma', doctor: 'Dr. Anita Desai', time: '10:30 AM', status: 'Pending' },
        { id: 2, patient: 'Priya Patel', doctor: 'Dr. Sameer Khan', time: '11:15 AM', status: 'Pending' },
        { id: 3, patient: 'Karan Singh', doctor: 'Dr. Anita Desai', time: '12:00 PM', status: 'Confirmed' },
    ];

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            {/* Header Section */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold text-slate-900">Welcome back, Admin</h2>
                    <p className="text-slate-500 mt-1">Here is what's happening at your hospital today.</p>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {stats.map((stat, index) => (
                    <Card key={index} className="border-none shadow-premium hover:shadow-premium-lg transition-smooth overflow-hidden group">
                        <CardContent className="p-6 relative">
                            {/* Decorative background element */}
                            <div className={`absolute -right-4 -top-4 w-24 h-24 rounded-full opacity-10 bg-gradient-to-br ${stat.gradient} group-hover:scale-110 transition-smooth`} />

                            <div className="flex justify-between items-start">
                                <div className={`p-3 rounded-xl bg-gradient-to-br ${stat.gradient} text-white shadow-lg`}>
                                    <stat.icon className="w-6 h-6" />
                                </div>
                            </div>

                            <div className="mt-4">
                                <p className="text-sm font-medium text-slate-500">{stat.title}</p>
                                <h3 className="text-3xl font-bold text-slate-900 mt-1">{stat.count}</h3>
                                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                                    <TrendingUp className="w-3 h-3 text-emerald-500" />
                                    {stat.trend}
                                </p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Appointments */}
                <Card className="lg:col-span-2 border-none shadow-premium bg-white/80 backdrop-blur-sm">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-xl font-bold text-slate-900">Recent Appointments</CardTitle>
                        <Button variant="ghost" className="text-teal-600 hover:text-teal-700 hover:bg-teal-50 gap-2">
                            View All <ArrowRight className="w-4 h-4" />
                        </Button>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {recentAppointments.map((apt) => (
                                <div key={apt.id} className="flex items-center justify-between p-4 rounded-xl border border-slate-100 hover:bg-slate-50 transition-smooth group">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-full ${apt.status === 'Pending' ? 'bg-amber-100 text-amber-600' : 'bg-emerald-100 text-emerald-600'}`}>
                                            {apt.status === 'Pending' ? <Clock className="w-5 h-5" /> : <CheckCircle2 className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <p className="font-bold text-slate-900">{apt.patient}</p>
                                            <p className="text-sm text-slate-500">{apt.doctor} • {apt.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-smooth">
                                        {apt.status === 'Pending' && (
                                            <>
                                                <Button size="sm" className="bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg px-3">Accept</Button>
                                                <Button size="sm" variant="ghost" className="text-rose-500 hover:bg-rose-50 rounded-lg px-3">Reject</Button>
                                            </>
                                        )}
                                        {apt.status === 'Confirmed' && (
                                            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">Confirmed</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                {/* Quick Actions / Activity */}
                <Card className="border-none shadow-premium bg-teal-600 text-white overflow-hidden relative">
                    {/* Decorative background bubbles */}
                    <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/2 w-64 h-64 bg-white/10 rounded-full blur-3xl" />
                    <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/2 w-48 h-48 bg-emerald-400/20 rounded-full blur-2xl" />

                    <CardHeader>
                        <CardTitle className="text-xl font-bold">Quick Tasks</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4 relative z-10">
                        <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-smooth text-left">
                            <div className="flex items-center gap-3">
                                <Users className="w-5 h-5" />
                                <span>Add New Doctor</span>
                            </div>
                            <PlusCircle className="w-4 h-4 opacity-70" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-smooth text-left">
                            <div className="flex items-center gap-3">
                                <FileText className="w-5 h-5" />
                                <span>Issue Prescription</span>
                            </div>
                            <PlusCircle className="w-4 h-4 opacity-70" />
                        </button>
                        <button className="w-full flex items-center justify-between p-4 bg-white/10 hover:bg-white/20 rounded-xl border border-white/10 transition-smooth text-left">
                            <div className="flex items-center gap-3">
                                <Settings className="w-5 h-5" />
                                <span>Setup Schedule</span>
                            </div>
                            <PlusCircle className="w-4 h-4 opacity-70" />
                        </button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function PlusCircle(props: React.SVGProps<SVGSVGElement>) {
    return (
        <svg
            {...props}
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <circle cx="12" cy="12" r="10" />
            <path d="M8 12h8" />
            <path d="M12 8v8" />
        </svg>
    )
}
