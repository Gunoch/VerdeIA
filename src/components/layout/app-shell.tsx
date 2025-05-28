"use client";
import { 
  SidebarProvider, 
  Sidebar, 
  SidebarHeader, 
  SidebarContent, 
  SidebarFooter, 
  SidebarMenu, 
  SidebarMenuItem, 
  SidebarMenuButton, 
  SidebarInset, 
  SidebarTrigger 
} from "@/components/ui/sidebar";
import Link from "next/link";
import { Leaf, Gauge, Replace, HomeIcon } from "lucide-react";
import Logo from "@/components/logo";
import type { PropsWithChildren } from "react";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

export function AppShell({ children }: PropsWithChildren) {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Início", icon: HomeIcon },
    { href: "/suggestions", label: "Sugestões Inteligentes", icon: Leaf },
    { href: "/impact-scores", label: "Pontuações de Impacto", icon: Gauge },
    { href: "/sustainable-swaps", label: "Trocas Sustentáveis", icon: Replace },
  ];

  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar>
        <SidebarHeader className="p-2 border-b border-sidebar-border">
          <Link href="/" className="flex items-center gap-2.5 p-2 hover:bg-sidebar-accent rounded-md transition-colors">
            <Logo className="w-9 h-9" />
            <span className="font-semibold text-xl text-sidebar-foreground">VerdeAI</span>
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarMenu className="p-2">
            {navItems.map((item) => (
              <SidebarMenuItem key={item.href}>
                <SidebarMenuButton 
                  asChild
                  isActive={pathname === item.href}
                  tooltip={item.label}
                  className={cn(
                    pathname === item.href && "bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 hover:text-sidebar-primary-foreground",
                    "group-data-[collapsible=icon]:justify-center" 
                  )}
                >
                  <Link href={item.href}>
                    <item.icon className="shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            ))}
          </SidebarMenu>
        </SidebarContent>
        <SidebarFooter className="p-4 border-t border-sidebar-border">
          <p className="text-xs text-sidebar-foreground/70 text-center group-data-[collapsible=icon]:hidden">
            &copy; {new Date().getFullYear()} VerdeAI
          </p>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-6 justify-between shadow-sm">
          <div className="flex items-center gap-2">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-semibold text-foreground hidden md:block">
              {navItems.find(item => item.href === pathname)?.label || "VerdeAI"}
            </h1>
          </div>
          <div>{/* Optional: Header actions, user menu */}</div>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8 bg-background">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
