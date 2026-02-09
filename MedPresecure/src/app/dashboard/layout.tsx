'use client';

import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import { Sidebar } from '@/components/dashboard/sidebar';
import { Header } from '@/components/dashboard/header';
// import { usePathname } from 'next/navigation'; // Removing this as it's not used yet, maybe in future for dynamic titles

export default function DashboardLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    // We can determine the title based on the path if needed, or pass it from the page. 
    // For now, pages usually have their own headers or we can make the header dynamic.
    // However, looking at the design, the header seems to be global but the title "Appointments Management" is specific.
    // Let's use SidebarInset to wrap the content. The header is part of the layout but might need props.
    // To make it simple for now, I'll allow the Header to be part of the layout, but maybe the title needs to be dynamic.
    // For this refactor, I will put the Header in the Layout with a generic title or handling.
    // Actually, looking at the design, "Appointments Management" is the title in the header area.

    // Let's make the layout responsible for the Sidebar and the main container. 
    // The specific page headers might be better placed inside the pages if they vary a lot, 
    // BUT the request image shows a consistent header bar.
    // I will put the Header here.

    return (
        <SidebarProvider>
            <Sidebar />
            <SidebarInset>
                {/* The header is now inside each page to allow custom titles and actions, or we can make a context to set it.
             For simplicity and to match the previous structure where `layout.tsx` wraps `children`, 
             I will NOT include the specific "Appointments Management" header here if it varies per page.
             BUT, if I want to remove duplication, I should put a generic header here.
             
             Let's wait. The previous `dashboard/page.tsx` had the header IN the page.
             Refactoring means moving it out.
             
             Let's put the Header here, but maybe make the title empty or a default.
          */}
                {/* <Header title="Dashboard" />  <-- This might conflict if pages have their own controls.
            The user wants "Appointments Management" for the appointments page.
            
            Strategy: Layout handles Sidebar. Content handles Header + Body.
            OR: Layout handles Sidebar + SidebarInset. Children are Rendered inside.
            
            Let's stick to Layout handles Sidebar only for now to offer maximum flexibility to pages,
            OR better, provide a `DashboardShell` component.
            
            Standard Next.js Layout:
        */}
                <div className="flex flex-col min-h-screen bg-slate-50">
                    {/* We can potentially place a default Header here if we want it global. 
                 For the "Appointments Management" screenshot, the header contains search and profile.
                 This looks global. The Title "Appointments Management" is on the left.
                 
                 I'll keep the Header usage flexible. I'll just export the Layout wrapper.
             */}
                    {children}
                </div>
            </SidebarInset>
        </SidebarProvider>
    );
}
