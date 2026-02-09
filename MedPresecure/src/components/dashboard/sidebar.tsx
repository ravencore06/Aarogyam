'use client';

import {
    Sidebar as SidebarContainer,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarSeparator,
} from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    Shield,
    LayoutDashboard,
    FileText,
    Calendar,
    Users,
    MessageSquare,
    Settings,
    LogOut,
    FolderOpen,
} from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useUser } from '@/firebase';

export function Sidebar() {
    const router = useRouter();
    const pathname = usePathname();
    const { user, auth } = useUser();

    const handleNavigation = (path: string) => {
        router.push(path);
    };

    const isActive = (path: string) => pathname === path;

    return (
        <SidebarContainer className="border-r shadow-sm">
            <SidebarHeader>
                <div className="flex items-center gap-3 px-4 py-6">
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-primary shadow-lg">
                        <Shield className="w-6 h-6 text-white fill-white" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-primary bg-clip-text text-transparent">Aarogyam</span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu className="px-3 space-y-1">
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => handleNavigation('/dashboard')}
                            isActive={isActive('/dashboard')}
                            tooltip="Dashboard"
                            className={`
                                transition-smooth rounded-lg px-3 py-2.5 
                                ${isActive('/dashboard')
                                    ? 'bg-gradient-primary text-white shadow-md hover:shadow-lg'
                                    : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                                }
                            `}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            <span className="font-medium">Dashboard</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => handleNavigation('/dashboard/prescriptions')}
                            isActive={isActive('/dashboard/prescriptions')}
                            tooltip="Prescriptions"
                            className={`
                                transition-smooth rounded-lg px-3 py-2.5 
                                ${isActive('/dashboard/prescriptions')
                                    ? 'bg-gradient-primary text-white shadow-md hover:shadow-lg'
                                    : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                                }
                            `}
                        >
                            <FileText className="w-5 h-5" />
                            <span className="font-medium">Prescriptions</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => handleNavigation('/dashboard/appointments')}
                            isActive={isActive('/dashboard/appointments')}
                            tooltip="Appointments"
                            className={`
                                transition-smooth rounded-lg px-3 py-2.5 
                                ${isActive('/dashboard/appointments')
                                    ? 'bg-gradient-primary text-white shadow-md hover:shadow-lg'
                                    : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                                }
                            `}
                        >
                            <Calendar className="w-5 h-5" />
                            <span className="font-medium">Appointments</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => handleNavigation('/dashboard/doctors')}
                            isActive={isActive('/dashboard/doctors')}
                            tooltip="Doctors"
                            className={`
                                transition-smooth rounded-lg px-3 py-2.5 
                                ${isActive('/dashboard/doctors')
                                    ? 'bg-gradient-primary text-white shadow-md hover:shadow-lg'
                                    : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                                }
                            `}
                        >
                            <Users className="w-5 h-5" />
                            <span className="font-medium">Doctors</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => handleNavigation('/dashboard/documents')}
                            isActive={isActive('/dashboard/documents')}
                            tooltip="Documents"
                            className={`
                                transition-smooth rounded-lg px-3 py-2.5 
                                ${isActive('/dashboard/documents')
                                    ? 'bg-gradient-primary text-white shadow-md hover:shadow-lg'
                                    : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                                }
                            `}
                        >
                            <FolderOpen className="w-5 h-5" />
                            <span className="font-medium">Documents</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu className="px-3 mb-2">
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => handleNavigation('/dashboard/settings')}
                            isActive={isActive('/dashboard/settings')}
                            tooltip="Settings"
                            className={`
                                transition-smooth rounded-lg px-3 py-2.5 
                                ${isActive('/dashboard/settings')
                                    ? 'bg-gradient-primary text-white shadow-md hover:shadow-lg'
                                    : 'hover:bg-slate-50 text-slate-700 hover:text-slate-900'
                                }
                            `}
                        >
                            <Settings className="w-5 h-5" />
                            <span className="font-medium">Settings</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                <SidebarSeparator className="my-2" />

                <div className="flex items-center gap-3 p-4 mx-3 mb-4 rounded-xl bg-slate-50 hover:bg-slate-100 transition-smooth">
                    <Avatar className="border-2 border-white shadow-sm">
                        <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email}`} alt="User avatar" />
                        <AvatarFallback className="bg-gradient-primary text-white">U</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                            {user?.email?.split('@')[0] || 'User'}
                        </p>
                        <p className="text-xs text-slate-500 truncate">
                            ID: {user?.uid.slice(0, 7)}
                        </p>
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => auth?.signOut()}
                        className="text-slate-500 hover:text-red-600 hover:bg-red-50 transition-smooth"
                    >
                        <LogOut className="w-5 h-5" />
                    </Button>
                </div>
            </SidebarFooter>
        </SidebarContainer>
    );
}
