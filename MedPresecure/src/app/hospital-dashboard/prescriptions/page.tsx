'use client';

import React, { useState } from 'react';
import {
    Search,
    UserPlus,
    FileText,
    Plus,
    Check,
    AlertCircle,
    User,
    Pill,
    Activity,
    Clock,
    ClipboardList,
    Archive
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function HospitalPrescriptionsPage() {
    const [patientQuery, setPatientQuery] = useState('');
    const [isIssuing, setIsIssuing] = useState(false);
    const [selectedPatient, setSelectedPatient] = useState<any>(null);

    const patients = [
        { id: 'P-552', name: 'Rahul Sharma', age: 32, gender: 'Male', mobile: '9876543210' },
        { id: 'P-912', name: 'Priya Patel', age: 28, gender: 'Female', mobile: '9988776655' },
        { id: 'P-104', name: 'Karan Singh', age: 45, gender: 'Male', mobile: '9123456789' },
    ];

    const filteredPatients = patients.filter(p =>
        p.name.toLowerCase().includes(patientQuery.toLowerCase()) ||
        p.id.includes(patientQuery.toUpperCase())
    );

    const handleIssuePrescription = (e: React.FormEvent) => {
        e.preventDefault();
        setIsIssuing(true);
        // Simulate API call
        setTimeout(() => {
            setIsIssuing(false);
            setSelectedPatient(null);
            setPatientQuery('');
            alert('Prescription issued successfully!');
        }, 1500);
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in">
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
                {/* Left Column: Patient Search */}
                <Card className="xl:col-span-1 border-none shadow-premium bg-white">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Search className="w-5 h-5 text-teal-600" />
                            Find Patient
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                            <Input
                                placeholder="Search by ID or Name..."
                                value={patientQuery}
                                onChange={(e) => setPatientQuery(e.target.value)}
                                className="pl-10 rounded-xl border-slate-200 bg-slate-50 focus:bg-white transition-smooth"
                            />
                        </div>

                        <div className="space-y-3 h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                            {filteredPatients.map((p) => (
                                <div
                                    key={p.id}
                                    onClick={() => setSelectedPatient(p)}
                                    className={`p-4 rounded-xl border cursor-pointer transition-all ${selectedPatient?.id === p.id
                                        ? 'bg-teal-50 border-teal-200'
                                        : 'bg-white border-slate-100 hover:bg-slate-50'
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <Avatar className="h-10 w-10 border border-white">
                                            <AvatarFallback className="bg-slate-200 text-slate-600 font-bold">
                                                {p.name.split(' ').map(n => n[0]).join('')}
                                            </AvatarFallback>
                                        </Avatar>
                                        <div className="flex-1">
                                            <p className="font-bold text-slate-900">{p.name}</p>
                                            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">ID: {p.id}</p>
                                        </div>
                                        {selectedPatient?.id === p.id && <Check className="w-4 h-4 text-teal-600" />}
                                    </div>
                                </div>
                            ))}
                            {filteredPatients.length === 0 && (
                                <div className="text-center py-10">
                                    <Activity className="w-8 h-8 text-slate-200 mx-auto" />
                                    <p className="text-sm text-slate-400 mt-2">No patients found</p>
                                </div>
                            )}
                        </div>
                    </CardContent>
                </Card>

                {/* Right Column: Prescription Form */}
                <Card className="xl:col-span-2 border-none shadow-premium bg-white">
                    <CardHeader className="border-b border-slate-50 pb-6">
                        <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold flex items-center gap-2">
                                <FileText className="w-5 h-5 text-teal-600" />
                                New Prescription
                            </CardTitle>
                            {selectedPatient && (
                                <Badge className="bg-teal-50 text-teal-600 border-teal-100 rounded-lg px-3 py-1 scale-110">
                                    Issuing for {selectedPatient.name}
                                </Badge>
                            )}
                        </div>
                    </CardHeader>
                    <CardContent className="pt-8">
                        {!selectedPatient ? (
                            <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
                                <div className="p-6 rounded-full bg-slate-50">
                                    <UserPlus className="w-12 h-12 text-slate-300" />
                                </div>
                                <h3 className="text-xl font-bold text-slate-900 mt-4">Select a patient</h3>
                                <p className="text-slate-500 max-w-xs mt-2">Search and click on a patient from the left panel to begin issuing a prescription.</p>
                            </div>
                        ) : (
                            <form onSubmit={handleIssuePrescription} className="space-y-8">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="font-bold text-slate-700">Diagnosis / Condition</Label>
                                            <Input placeholder="e.g. Chronic Hypertension" className="rounded-xl border-slate-200" required />
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold text-slate-700">Medicine Name</Label>
                                            <div className="relative">
                                                <Pill className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <Input placeholder="e.g. Amoxicillin 500mg" className="pl-10 rounded-xl border-slate-200" required />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-2">
                                                <Label className="font-bold text-slate-700">Dosage</Label>
                                                <Input placeholder="1 tablet" className="rounded-xl border-slate-200" required />
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-slate-700">Frequency</Label>
                                                <Select defaultValue="twice">
                                                    <SelectTrigger className="rounded-xl border-slate-200">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="once">Once daily</SelectItem>
                                                        <SelectItem value="twice">Twice daily</SelectItem>
                                                        <SelectItem value="thrice">Thrice daily</SelectItem>
                                                        <SelectItem value="needed">As needed</SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <Label className="font-bold text-slate-700">Duration</Label>
                                            <div className="relative">
                                                <Clock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                <Input placeholder="e.g. 7 days" className="pl-10 rounded-xl border-slate-200" required />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label className="font-bold text-slate-700">Instructions</Label>
                                            <div className="relative">
                                                <ClipboardList className="absolute left-3 top-3 w-4 h-4 text-slate-400" />
                                                <Textarea
                                                    placeholder="e.g. Take after meals. Avoid dairy products..."
                                                    className="pl-10 rounded-xl border-slate-200 min-h-[120px]"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="p-4 bg-amber-50 border border-amber-100 rounded-xl flex gap-3 text-amber-700 text-sm">
                                    <AlertCircle className="w-5 h-5 flex-shrink-0" />
                                    <p>By issuing this prescription, it will be immediately available in the patient's dashboard profile.</p>
                                </div>

                                <div className="flex justify-end gap-3 pt-4">
                                    <Button type="button" variant="ghost" onClick={() => setSelectedPatient(null)} className="rounded-xl px-6">Cancel</Button>
                                    <Button
                                        type="submit"
                                        disabled={isIssuing}
                                        className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl h-12 px-10 font-bold shadow-lg shadow-teal-500/20 hover:shadow-xl transition-smooth"
                                    >
                                        {isIssuing ? (
                                            <span className="flex items-center gap-2">
                                                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                Issuing...
                                            </span>
                                        ) : (
                                            <span className="flex items-center gap-2">
                                                <Archive className="w-4 h-4" />
                                                Issue Prescription
                                            </span>
                                        )}
                                    </Button>
                                </div>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
