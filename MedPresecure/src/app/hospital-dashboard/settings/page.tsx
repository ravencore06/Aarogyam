'use client';

import React from 'react';
import {
    Building2,
    MapPin,
    Phone,
    Mail,
    Globe,
    Clock,
    ShieldCheck,
    Save,
    Camera,
    Upload
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

export default function HospitalSettingsPage() {
    return (
        <div className="p-8 space-y-8 animate-fade-in max-w-5xl mx-auto">
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                <div className="flex items-center gap-6">
                    <div className="relative group">
                        <Avatar className="w-32 h-32 border-4 border-white shadow-xl ring-2 ring-teal-50 group-hover:opacity-90 transition-smooth">
                            <AvatarImage src="https://api.dicebear.com/7.x/shapes/svg?seed=hospital" />
                            <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white text-3xl font-bold">CH</AvatarFallback>
                        </Avatar>
                        <button className="absolute bottom-1 right-1 p-2.5 bg-white rounded-full shadow-lg border border-slate-100 text-teal-600 hover:scale-110 transition-smooth">
                            <Camera className="w-5 h-5" />
                        </button>
                    </div>
                    <div>
                        <h2 className="text-3xl font-bold text-slate-900">City General Hospital</h2>
                        <p className="text-slate-500 font-medium">Hospital ID: H-9932-AX</p>
                        <div className="flex gap-2 mt-3">
                            <span className="px-3 py-1 bg-emerald-50 text-emerald-600 border border-emerald-100 rounded-lg text-xs font-bold uppercase tracking-wider">Verified Institution</span>
                        </div>
                    </div>
                </div>
                <Button className="bg-gradient-to-r from-teal-500 to-emerald-600 text-white rounded-xl h-12 px-8 font-bold shadow-teal-500/20 shadow-lg hover:shadow-xl transition-smooth gap-2">
                    <Save className="w-4 h-4" />
                    Save Changes
                </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Basic Details */}
                <Card className="md:col-span-2 border-none shadow-premium bg-white">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-teal-600" />
                            General Information
                        </CardTitle>
                        <CardDescription>Manage your hospital's public profile and contact info.</CardDescription>
                    </CardHeader>
                    <Separator className="bg-slate-50" />
                    <CardContent className="pt-8 space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Hospital Name</Label>
                                <Input defaultValue="City General Hospital" className="rounded-xl border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Official Email</Label>
                                <Input defaultValue="contact@citygeneral.com" className="rounded-xl border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Phone Number</Label>
                                <Input defaultValue="+91 11 2345 6789" className="rounded-xl border-slate-200" />
                            </div>
                            <div className="space-y-2">
                                <Label className="font-bold text-slate-700">Website</Label>
                                <Input defaultValue="www.citygeneral.hospital" className="rounded-xl border-slate-200" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label className="font-bold text-slate-700">Full Address</Label>
                            <Textarea
                                defaultValue="Building 4-B, Health City Avenue, Sector 12, Palam Vihar, Gurugram, Haryana - 122017"
                                className="rounded-xl border-slate-200 min-h-[100px]"
                            />
                        </div>
                    </CardContent>
                </Card>

                {/* Sidebar Info */}
                <div className="space-y-8">
                    {/* Operational Hours */}
                    <Card className="border-none shadow-premium bg-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <Clock className="w-5 h-5 text-teal-600" />
                                Operational Hours
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div className="flex justify-between items-center py-2 border-b border-slate-50 italic text-sm">
                                <span className="text-slate-500">Mon - Fri</span>
                                <span className="font-bold text-slate-900">24 Hours / Open</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-50 italic text-sm">
                                <span className="text-slate-500">Saturday</span>
                                <span className="font-bold text-slate-900">08:00 AM - 10:00 PM</span>
                            </div>
                            <div className="flex justify-between items-center py-2 border-b border-slate-50 italic text-sm">
                                <span className="text-slate-500">Sunday</span>
                                <span className="font-bold text-slate-900 text-rose-500 flex items-center gap-1">
                                    <ShieldCheck className="w-3.5 h-3.5" /> Emergency Only
                                </span>
                            </div>
                            <Button variant="outline" className="w-full mt-2 rounded-xl border-slate-200 text-teal-600 font-bold hover:bg-teal-50 transition-smooth">
                                Edit Timing
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Security & Access */}
                    <Card className="border-none shadow-premium bg-gradient-to-br from-slate-800 to-slate-900 text-white">
                        <CardHeader>
                            <CardTitle className="text-lg font-bold flex items-center gap-2">
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                                Security Settings
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <p className="text-xs text-slate-400">Regularly update your medical institution's digital credentials for safe patient data handling.</p>
                            <Button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl transition-smooth">
                                Change Password
                            </Button>
                            <Button className="w-full bg-white/10 hover:bg-white/20 border border-white/10 text-white rounded-xl transition-smooth">
                                Revoke API Access
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
