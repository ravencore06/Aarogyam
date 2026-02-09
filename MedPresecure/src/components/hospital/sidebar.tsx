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
    Building2,
    LayoutDashboard,
    FileText,
    Calendar,
    Users,
    Settings,
    LogOut,
    UserPlus,
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
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-600 shadow-lg">
                        <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <span className="text-2xl font-bold bg-gradient-to-r from-teal-600 to-emerald-600 bg-clip-text text-transparent truncate">CareHub</span>
                </div>
            </SidebarHeader>

            <SidebarContent>
                <SidebarMenu className="px-3 space-y-1">
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => handleNavigation('/hospital-dashboard')}
                            isActive={isActive('/hospital-dashboard')}
                            tooltip="Overview"
                            className={`
                                transition-smooth rounded-lg px-3 py-2.5 
                                ${isActive('/hospital-dashboard')
                                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md hover:shadow-lg'
                                    : 'hover:bg-teal-50 text-slate-700 hover:text-teal-900'
                                }
                            `}
                        >
                            <LayoutDashboard className="w-5 h-5" />
                            <span className="font-medium">Overview</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => handleNavigation('/hospital-dashboard/doctors')}
                            isActive={isActive('/hospital-dashboard/doctors')}
                            tooltip="Doctors Management"
                            className={`
                                transition-smooth rounded-lg px-3 py-2.5 
                                ${isActive('/hospital-dashboard/doctors')
                                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md hover:shadow-lg'
                                    : 'hover:bg-teal-50 text-slate-700 hover:text-teal-900'
                                }
                            `}
                        >
                            <Users className="w-5 h-5" />
                            <span className="font-medium">Doctors</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => handleNavigation('/hospital-dashboard/appointments')}
                            isActive={isActive('/hospital-dashboard/appointments')}
                            tooltip="Appointments"
                            className={`
                                transition-smooth rounded-lg px-3 py-2.5 
                                ${isActive('/hospital-dashboard/appointments')
                                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md hover:shadow-lg'
                                    : 'hover:bg-teal-50 text-slate-700 hover:text-teal-900'
                                }
                            `}
                        >
                            <Calendar className="w-5 h-5" />
                            <span className="font-medium">Appointments</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>

                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => handleNavigation('/hospital-dashboard/prescriptions')}
                            isActive={isActive('/hospital-dashboard/prescriptions')}
                            tooltip="Add Prescription"
                            className={`
                                transition-smooth rounded-lg px-3 py-2.5 
                                ${isActive('/hospital-dashboard/prescriptions')
                                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md hover:shadow-lg'
                                    : 'hover:bg-teal-50 text-slate-700 hover:text-teal-900'
                                }
                            `}
                        >
                            <UserPlus className="w-5 h-5" />
                            <span className="font-medium">Prescribe</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarContent>

            <SidebarFooter>
                <SidebarMenu className="px-3 mb-2">
                    <SidebarMenuItem>
                        <SidebarMenuButton
                            onClick={() => handleNavigation('/hospital-dashboard/settings')}
                            isActive={isActive('/hospital-dashboard/settings')}
                            tooltip="Hospital Settings"
                            className={`
                                transition-smooth rounded-lg px-3 py-2.5 
                                ${isActive('/hospital-dashboard/settings')
                                    ? 'bg-gradient-to-r from-teal-500 to-emerald-500 text-white shadow-md hover:shadow-lg'
                                    : 'hover:bg-teal-50 text-slate-700 hover:text-teal-900'
                                }
                            `}
                        >
                            <Settings className="w-5 h-5" />
                            <span className="font-medium">Settings</span>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>

                <SidebarSeparator className="my-2" />

                <div className="flex items-center gap-3 p-4 mx-3 mb-4 rounded-xl bg-teal-50 hover:bg-teal-100 transition-smooth">
                    <Avatar className="border-2 border-white shadow-sm">
                        <AvatarImage src={`https://api.dicebear.com/7.x/initials/svg?seed=Hospital`} alt="Hospital avatar" />
                        <AvatarFallback className="bg-gradient-to-br from-teal-500 to-emerald-600 text-white">H</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-slate-900 truncate">
                            Hospital Admin
                        </p>
                        <p className="text-xs text-teal-600 font-medium truncate">
                            {user?.email?.split('@')[0]}
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
