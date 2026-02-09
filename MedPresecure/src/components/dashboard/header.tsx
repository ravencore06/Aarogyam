'use client';

import { Bell, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface HeaderProps {
    title?: string;
    showSearch?: boolean;
    user?: any; // Replace with proper user type
}

export function Header({ title, showSearch = true, user }: HeaderProps) {
    return (
        <header className="sticky top-0 z-10 flex items-center justify-between h-16 px-6 bg-white border-b shadow-sm">
            <div className="flex items-center gap-4">
                <SidebarTrigger />
                {title && <h1 className="text-2xl font-bold text-slate-900">{title}</h1>}
            </div>

            <div className="flex items-center gap-4">
                {showSearch && (
                    <div className="relative hidden md:block">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                        <Input
                            placeholder="Search anything..."
                            className="w-96 pl-11 h-10 bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:ring-2 focus:ring-primary/20 transition-smooth shadow-sm"
                        />
                    </div>
                )}

                <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        className="relative text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-smooth"
                    >
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white animate-pulse" />
                    </Button>

                    <div className="flex items-center gap-3 pl-3 ml-2 border-l border-slate-200">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-semibold text-slate-900">Dr. Sarah Smith</p>
                            <p className="text-xs text-slate-500">Cardiologist</p>
                        </div>
                        <Avatar className="h-9 w-9 border-2 border-white shadow-md cursor-pointer hover:shadow-lg transition-smooth ring-2 ring-slate-100">
                            <AvatarImage src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.email || 'doc'}`} />
                            <AvatarFallback className="bg-gradient-primary text-white">DS</AvatarFallback>
                        </Avatar>
                    </div>
                </div>
            </div>
        </header>
    );
}
