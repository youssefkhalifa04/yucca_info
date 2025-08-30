import React from 'react'
import {
    SidebarProvider,
    Sidebar as UISidebar,
    SidebarHeader,
    SidebarContent,
    SidebarFooter,
    SidebarMenu,
    SidebarMenuItem,
    SidebarMenuButton,
    SidebarInset,
    SidebarTrigger,
    useSidebar,
} from '@/components/ui/sidebar'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
    Gauge,
    Settings2,
    Hand,
    Zap,
    Egg,
    FileText,
    Settings,
} from 'lucide-react'

type PageType = 'dashboard' | 'configuration' | 'manual' | 'automatic' | 'eggs' | 'logs' | 'settings'

type AppLayoutProps = {
    currentPage: PageType
    onPageChange: (page: PageType) => void
    children: React.ReactNode
}

const menuItems: { id: PageType; label: string; icon: React.ComponentType<{ size?: number | string; className?: string }> }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: Gauge },
    { id: 'configuration', label: 'Configuration', icon: Settings2 },
    { id: 'manual', label: 'Manual Control', icon: Hand },
    { id: 'automatic', label: 'Automatic Mode', icon: Zap },
    { id: 'eggs', label: 'Egg Types', icon: Egg },

    { id: 'settings', label: 'Settings', icon: Settings },
]

const LayoutContent: React.FC<AppLayoutProps> = ({ currentPage, onPageChange, children }) => {
    const { state, toggleSidebar } = useSidebar()
    return (
        <>
            <UISidebar side="left" variant="sidebar" collapsible="icon" className="bg-sidebar">
                <SidebarHeader className="px-3 py-4">
                {state == "expanded" && <div className="flex items-center gap-2 px-1">
                        <div className="h-7 w-7 rounded-md bg-primary/10 text-primary grid place-items-center">
                            <Egg className="h-4 w-4" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-semibold tracking-tight">Egg Incubator</span>
                            <span className="text-xs text-muted-foreground">Control & Monitor</span>
                        </div>
                    </div>}
                </SidebarHeader>
                <SidebarContent>
                    <SidebarMenu className={state != "expanded" ? 'mt-12 flex flex-col justify-center items-center' : '' }>
                        {menuItems.map((item) => {
                            const Icon = item.icon
                            return (
                                <SidebarMenuItem key={item.id}>
                                    <SidebarMenuButton
                                        isActive={currentPage === item.id}
                                        onClick={() => onPageChange(item.id)}
                                        className={cn(currentPage === item.id && 'bg-sidebar-accent text-sidebar-accent-foreground')}
                                        tooltip={item.label}
                                    >
                                        <Icon className="h-4 w-4" />
                                        <span>{item.label}</span>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            )
                        })}
                    </SidebarMenu>
                </SidebarContent>
                <SidebarFooter className="px-3 pb-3">
                    {state == "expanded" && <div className="flex items-center justify-between rounded-md border bg-background px-3 py-2">
                        <div className="flex items-center gap-2 text-xs">
                            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            <span className="text-muted-foreground">USB</span>
                        </div>
                        <Badge variant="secondary" className="text-[10px]">Connected</Badge>
                    </div>}
                    <SidebarTrigger className="md:hidden" />
                    <Button variant="outline" size="sm" className="hidden md:inline-flex" onClick={toggleSidebar}>
                        {state === 'expanded' ? <ArrowLeft /> : <ArrowRight />}
                    </Button>
                </SidebarFooter>
            </UISidebar>

            <SidebarInset>
                <header className="sticky top-0 z-30 w-full border-b bg-background/80 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                    <div className="flex h-14 items-center justify-between px-3 md:px-6">
                        <div className="flex items-center gap-2">

                            <div className="text-sm text-muted-foreground">{menuItems.find((m) => m.id === currentPage)?.label}</div>
                        </div>
                        <div className="flex items-center gap-2" />
                    </div>
                </header>
                <div className="px-4 md:px-8 py-6">
                    <div className="mx-auto w-full max-w-7xl">
                        {children}
                    </div>
                </div>
            </SidebarInset>
        </>
    )
}

const AppLayout = ({ currentPage, onPageChange, children }: AppLayoutProps) => {
    return (
        <SidebarProvider>
            <LayoutContent currentPage={currentPage} onPageChange={onPageChange}>
                {children}
            </LayoutContent>
        </SidebarProvider>
    )
}

export default AppLayout


