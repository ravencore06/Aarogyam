'use client';

import React, { useState } from 'react';
import {
    Users,
    Search,
    Plus,
    MoreVertical,
    Edit2,
    Trash2,
    Star,
    Mail,
    Phone,
    MapPin,
    Stethoscope
} from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';

export default function HospitalDoctorsPage() {
    const [searchQuery, setSearchQuery] = useState('');

    const [doctors, setDoctors] = useState([
        {
            id: 1,
            name: 'Dr. Anita Desai',
            specialty: 'Pediatrician',
            experience: '12 years',
            email: 'anita.desai@carehub.com',
            phone: '+91 98765 43210',
            rating: 4.8,
            status: 'Active',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Anita'
        },
        {
            id: 2,
            name: 'Dr. Sameer Khan',
            specialty: 'Cardiologist',
            experience: '15 years',
            email: 'sameer.khan@carehub.com',
            phone: '+91 98765 43211',
            rating: 4.9,
            status: 'Active',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sameer'
        },
        {
            id: 3,
            name: 'Dr. Rajesh Gupta',
            specialty: 'Dermatologist',
            experience: '8 years',
            email: 'rajesh.gupta@carehub.com',
            phone: '+91 98765 43212',
            rating: 4.7,
            status: 'On Leave',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Rajesh'
        }
    ]);

    const filteredDoctors = doctors.filter(doc =>
        doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        doc.specialty.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            {/* Header with Search and ADD button */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <Input
                        placeholder="Search doctors by name or specialty..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-11 h-12 bg-white border-slate-200 rounded-xl focus:ring-2 focus:ring-teal-500/20 shadow-sm transition-smooth"
                    />
                </div>

                <Dialog>
                    <DialogTrigger asChild>
                        <Button className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl shadow-md hover:shadow-lg transition-smooth h-12 px-6 gap-2">
                            <Plus className="w-5 h-5" />
                            Add New Doctor
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] border-none shadow-2xl rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold text-slate-900">Add New Doctor</DialogTitle>
                            <DialogDescription className="text-slate-500">
                                Enter the details of the doctor to add them to your hospital directory.
                            </DialogDescription>
                        </DialogHeader>
                        <div className="grid gap-6 py-4">
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="name" className="text-right font-semibold text-slate-700">Full Name</Label>
                                <Input id="name" placeholder="Dr. John Doe" className="col-span-3 rounded-xl bg-slate-50 border-slate-200" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="specialty" className="text-right font-semibold text-slate-700">Specialty</Label>
                                <Input id="specialty" placeholder="e.g. Cardiologist" className="col-span-3 rounded-xl bg-slate-50 border-slate-200" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="experience" className="text-right font-semibold text-slate-700">Experience</Label>
                                <Input id="experience" placeholder="e.g. 10 years" className="col-span-3 rounded-xl bg-slate-50 border-slate-200" />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="email" className="text-right font-semibold text-slate-700">Email</Label>
                                <Input id="email" type="email" placeholder="doctor@hospital.com" className="col-span-3 rounded-xl bg-slate-50 border-slate-200" />
                            </div>
                        </div>
                        <DialogFooter>
                            <Button type="submit" className="w-full bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl h-12 font-bold shadow-lg hover:shadow-xl transition-smooth">
                                Register Doctor
                            </Button>
                        </DialogFooter>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Doctors Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {filteredDoctors.map((doctor) => (
                    <Card key={doctor.id} className="border-none shadow-premium hover:shadow-premium-lg transition-smooth group relative overflow-hidden bg-white">
                        {/* Status Badge */}
                        <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${doctor.status === 'Active' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' : 'bg-slate-100 text-slate-500 border border-slate-200'
                            }`}>
                            {doctor.status}
                        </div>

                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <Avatar className="w-20 h-20 border-2 border-teal-50 shadow-md group-hover:scale-105 transition-smooth ring-4 ring-white">
                                    <AvatarImage src={doctor.avatar} />
                                    <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white font-bold text-xl">
                                        {doctor.name.split(' ').map(n => n[0]).join('').replace('Dr', '')}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <h3 className="text-xl font-bold text-slate-900 truncate">{doctor.name}</h3>
                                    <p className="text-teal-600 font-semibold text-sm flex items-center gap-1.5 mt-1">
                                        <Stethoscope className="w-3.5 h-3.5" />
                                        {doctor.specialty}
                                    </p>
                                    <div className="flex items-center gap-1 mt-2">
                                        {[...Array(5)].map((_, i) => (
                                            <Star key={i} className={`w-3.5 h-3.5 ${i < Math.floor(doctor.rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200'}`} />
                                        ))}
                                        <span className="text-xs font-bold text-slate-500 ml-1">{doctor.rating}</span>
                                    </div>
                                </div>
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-slate-400 hover:text-slate-900 hover:bg-slate-50 rounded-lg">
                                            <MoreVertical className="w-5 h-5" />
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent align="end" className="border-none shadow-xl rounded-xl">
                                        <DropdownMenuItem className="gap-2 cursor-pointer focus:bg-teal-50 focus:text-teal-600">
                                            <Edit2 className="w-4 h-4" /> Edit Profile
                                        </DropdownMenuItem>
                                        <DropdownMenuItem className="gap-2 cursor-pointer text-rose-500 focus:bg-rose-50 focus:text-rose-600">
                                            <Trash2 className="w-4 h-4" /> Remove Doctor
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>

                            <div className="mt-6 pt-6 border-t border-slate-100 grid grid-cols-2 gap-4">
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Mail className="w-3.5 h-3.5 text-slate-400" />
                                        <span className="truncate">{doctor.email}</span>
                                    </div>
                                    <div className="flex items-center gap-2 text-xs text-slate-500">
                                        <Phone className="w-3.5 h-3.5 text-slate-400" />
                                        <span>{doctor.phone}</span>
                                    </div>
                                </div>
                                <div className="flex flex-col justify-end items-end">
                                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Experience</p>
                                    <p className="text-sm font-bold text-slate-700">{doctor.experience}</p>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            {filteredDoctors.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-slate-200">
                    <div className="p-4 rounded-full bg-slate-50">
                        <Search className="w-12 h-12 text-slate-300" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mt-4">No doctors found</h3>
                    <p className="text-slate-500 mt-1">Try adjusting your search query</p>
                    <Button
                        variant="link"
                        onClick={() => setSearchQuery('')}
                        className="text-teal-600 mt-2"
                    >
                        Clear search
                    </Button>
                </div>
            )}
        </div>
    );
}
