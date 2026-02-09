'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import {
  collection,
  query
} from 'firebase/firestore';
import { useUser, useFirestore, useCollection, useMemoFirebase } from '@/firebase';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Shield,
  Settings,
  Search,
  Star,
  SlidersHorizontal,
  X,
  MapPin,
  Briefcase,
  LogOut,
} from 'lucide-react';

import type { Doctor } from '@/lib/doctors';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';

export default function DoctorsPage() {
  const { user, isUserLoading, auth } = useUser();
  const firestore = useFirestore();
  const router = useRouter();

  const doctorsQuery = useMemoFirebase(() => {
    if (!firestore) return null;
    return query(collection(firestore, 'doctors'));
  }, [firestore]);

  const { data: doctors, isLoading: areDoctorsLoading } = useCollection<Doctor>(doctorsQuery);

  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    specialty: 'all',
    gender: 'all',
    isAvailableToday: false,
    acceptingNewPatients: false,
    experience: [0, 50],
  });

  const specialties = useMemo(() => {
    if (!doctors) return [];
    const allSpecialties = doctors.map((d) => d.specialty);
    return ['all', ...Array.from(new Set(allSpecialties))];
  }, [doctors]);

  const filteredDoctors = useMemo(() => {
    if (!doctors) return [];
    return doctors.filter((doctor) => {
      const nameMatch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase());
      const specialtySearchMatch = doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase());
      const searchMatch = nameMatch || specialtySearchMatch;

      const specialtyMatch = filters.specialty === 'all' || doctor.specialty === filters.specialty;
      const genderMatch = filters.gender === 'all' || doctor.gender === filters.gender;
      const availabilityMatch = !filters.isAvailableToday || doctor.isAvailableToday;
      const newPatientsMatch = !filters.acceptingNewPatients || doctor.acceptingNewPatients;
      const experienceMatch =
        doctor.experience >= filters.experience[0] &&
        doctor.experience <= filters.experience[1];

      return searchMatch && specialtyMatch && genderMatch && availabilityMatch && newPatientsMatch && experienceMatch;
    });
  }, [doctors, searchTerm, filters]);

  const handleFilterChange = (key: keyof typeof filters, value: any) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const resetFilters = () => {
    setSearchTerm('');
    setFilters({
      specialty: 'all',
      gender: 'all',
      isAvailableToday: false,
      acceptingNewPatients: false,
      experience: [0, 50],
    });
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

  const renderFilters = () => (
    <div className="flex flex-col gap-6">
      <div>
        <Label className="text-sm font-semibold">Specialty</Label>
        <div className="flex flex-wrap gap-2 mt-2">
          {specialties.map((specialty) => (
            <Button
              key={specialty}
              variant={filters.specialty === specialty ? 'default' : 'outline'}
              size="sm"
              onClick={() => handleFilterChange('specialty', specialty)}
              className="capitalize"
            >
              {specialty}
            </Button>
          ))}
        </div>
      </div>
      <div>
        <Label className="text-sm font-semibold">Gender</Label>
        <RadioGroup
          value={filters.gender}
          onValueChange={(value) => handleFilterChange('gender', value)}
          className="mt-2"
        >
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="all" id="gender-all" />
            <Label htmlFor="gender-all">All</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Male" id="gender-male" />
            <Label htmlFor="gender-male">Male</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="Female" id="gender-female" />
            <Label htmlFor="gender-female">Female</Label>          </div>
        </RadioGroup>
      </div>
      <div>
        <Label className="text-sm font-semibold">Experience</Label>
        <div className="flex items-center gap-4 mt-2">
          <span>{filters.experience[0]} yrs</span>
          <Slider
            value={filters.experience}
            onValueChange={(value) => handleFilterChange('experience', value)}
            max={50}
            step={1}
          />
          <span>{filters.experience[1]} yrs</span>
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="available-today" className="text-sm">Available Today</Label>
          <Switch
            id="available-today"
            checked={filters.isAvailableToday}
            onCheckedChange={(checked) => handleFilterChange('isAvailableToday', checked)}
          />
        </div>
        <div className="flex items-center justify-between">
          <Label htmlFor="new-patients" className="text-sm">Accepting New Patients</Label>
          <Switch
            id="new-patients"
            checked={filters.acceptingNewPatients}
            onCheckedChange={(checked) => handleFilterChange('acceptingNewPatients', checked)}
          />
        </div>
      </div>
      <Button variant="ghost" onClick={resetFilters} className="justify-start p-0 h-auto text-primary">
        <X className="mr-2 h-4 w-4" />
        Reset All Filters
      </Button>
    </div>
  );

  const renderDoctorCard = (doctor: Doctor) => (
    <Card key={doctor.id} className="overflow-hidden border-none shadow-premium hover:shadow-premium-lg transition-smooth hover:-translate-y-1">
      <CardContent className="p-6">
        <div className="flex items-start gap-4">
          <Avatar className="w-20 h-20 border-2 border-white shadow-md">
            <AvatarImage src={doctor.avatar} alt={doctor.name} />
            <AvatarFallback className="bg-gradient-primary text-white text-lg">{doctor.name.split(' ').map((n: string) => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <h3 className="font-bold text-lg text-slate-900">{doctor.name}</h3>
            <p className="text-primary font-semibold">{doctor.specialty}</p>
            <div className="flex items-center gap-1 text-sm text-slate-600 mt-2">
              <MapPin className="w-4 h-4" /> {doctor.location}
            </div>
            <div className="flex items-center gap-1 text-sm text-slate-600">
              <Briefcase className="w-4 h-4" /> {doctor.experience} years
            </div>
          </div>
        </div>
        <div className="flex items-center justify-between mt-5 pt-5 border-t border-slate-100">
          <div className="flex items-center gap-1 text-amber-500">
            <Star className="w-5 h-5 fill-current" />
            <span className="font-bold text-lg text-slate-900">{doctor.rating.toFixed(1)}</span>
          </div>
          <Button size="sm" className="bg-gradient-primary hover:shadow-lg transition-smooth">View Profile</Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderSkeletonCard = (i: number) => (
    <Card key={i} className="overflow-hidden">
      <CardContent className="p-4">
        <div className="flex items-start gap-4">
          <Skeleton className="w-20 h-20 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-6 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-1/3" />
          </div>
        </div>
        <div className="flex items-center justify-between mt-4">
          <Skeleton className="h-6 w-1/4" />
          <Skeleton className="h-9 w-1/3" />
        </div>
      </CardContent>
    </Card>
  )

  return (
    <SidebarProvider>
      <Sidebar />
      <SidebarInset>
        <div className="flex flex-col min-h-screen bg-slate-50">
          <Header title="Doctor Directory" user={user} />

          <main className="flex-1 p-6">
            <div className="flex gap-8">
              <aside className="hidden md:block w-80 flex-shrink-0">
                <div className="sticky top-24">
                  <h2 className="text-xl font-bold mb-6 text-slate-900">Filters</h2>
                  {renderFilters()}
                </div>
              </aside>
              <div className="flex-1">
                <div className="mb-6">
                  <h3 className="text-2xl font-bold text-slate-900">{filteredDoctors.length} doctors available</h3>
                  <p className="text-sm text-slate-600 mt-1">Find the right healthcare provider for your needs</p>
                </div>
                {areDoctorsLoading ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => renderSkeletonCard(i))}
                  </div>
                ) : filteredDoctors.length > 0 ? (
                  <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                    {filteredDoctors.map(renderDoctorCard)}
                  </div>
                ) : (
                  <div className="text-center py-20">
                    <div className="flex flex-col items-center gap-3">
                      <Search className="w-16 h-16 text-slate-300" />
                      <p className="text-xl font-bold text-slate-900">No doctors match your criteria</p>
                      <p className="text-slate-600">Try adjusting your filters or search term</p>
                      <Button variant="outline" onClick={resetFilters} className="mt-4">
                        <X className="w-4 h-4 mr-2" />
                        Reset Filters
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </main>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
