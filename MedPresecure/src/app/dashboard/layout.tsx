'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
import { RoleGuard } from '@/components/auth/role-guard';
// import { usePathname } from 'next/navigation'; // Removing this as it's not used yet, maybe in future for dynamic titles

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <RoleGuard requiredRole="patient">
            <SidebarProvider>
                <Sidebar />
                <SidebarInset>
                    <div className="flex flex-col min-h-screen bg-slate-50">
                        {children}
                    </div>
                </SidebarInset>
            </SidebarProvider>
        </RoleGuard>
    );
}
