'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useUser, useProfile } from '@/firebase';
import { Loader2 } from 'lucide-react';

interface RoleGuardProps {
    children: React.ReactNode;
    requiredRole: 'patient' | 'hospital';
    fallbackPath?: string;
}

export function RoleGuard({
    children,
    requiredRole,
    fallbackPath
}: RoleGuardProps) {
    const { user, isUserLoading: isAuthLoading } = useUser();
    const { profile, isUserLoading: isProfileLoading } = useProfile();
    const router = useRouter();

    const isLoading = isAuthLoading || isProfileLoading;

    useEffect(() => {
        if (!isLoading) {
            if (!user) {
                router.push('/');
            } else if (profile && profile.userType !== requiredRole) {
                const defaultFallback = requiredRole === 'patient' ? '/hospital-dashboard' : '/dashboard';
                router.push(fallbackPath || defaultFallback);
            }
        }
    }, [user, profile, isLoading, requiredRole, fallbackPath, router]);

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-slate-50">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="w-10 h-10 text-teal-600 animate-spin" />
                    <p className="text-slate-500 font-medium animate-pulse">Verifying credentials...</p>
                </div>
            </div>
        );
    }

    if (!user || (profile && profile.userType !== requiredRole)) {
        return null;
    }

    return <>{children}</>;
}
