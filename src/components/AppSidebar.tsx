"use client";
import {
  Calendar,
  ClipboardList,
  FileText,
  Home,
  Settings,
  Stethoscope,
  Users,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "./ui/sidebar";
import { usePathname } from "next/navigation";
import Link from "next/link";

const menuItems = [
  { title: "Dashboard", url: "/", icon: Home },
  { title: "Daftar Pasien", url: "/patients", icon: Users },
  { title: "Jadwal Dokter", url: "/doctors", icon: Calendar },
  { title: "Pemeriksaan", url: "/examinations", icon: Stethoscope },
  { title: "Rekam Medis", url: "/medical-records", icon: ClipboardList },
  { title: "Laporan", url: "/reports", icon: FileText },
  { title: "Pengaturan", url: "/settings", icon: Settings },
];

const AppSidebar = () => {
  const { state } = useSidebar();
  const currentPath = usePathname();
  const collapsed = state === "collapsed";

  const isActive = (path: string) => {
    if (path === "/" && currentPath === "/") return true;
    if (path !== "/" && currentPath.startsWith(path)) return true;
    return false;
  };

  const getNavCls = (path: string) =>
    isActive(path)
      ? "bg-primary text-primary-foreground font-medium shadow-sm"
      : "hover:bg-secondary transition-colors";

  return (
    <Sidebar
      className={`${
        collapsed ? "w-14" : "w-64"
      } border-r border-border bg-card transition-all duration-300`}
      collapsible="icon"
    >
      <SidebarHeader className="border-b border-border p-4">
        {!collapsed && (
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Stethoscope className="w-5 h-5 text-primary-foreground" />
            </div>
            <div>
              <h2 className="font-semibold text-foreground">SIMRS</h2>
              <p className="text-xs text-muted-foreground">Rumah Sakit</p>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center mx-auto">
            <Stethoscope className="w-5 h-5 text-primary-foreground" />
          </div>
        )}
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link
                      href={item.url}
                      className={`${getNavCls(
                        item.url
                      )} flex items-center gap-3 px-3 py-2 rounded-md`}
                      title={collapsed ? item.title : undefined}
                    >
                      <item.icon className="w-4 h-4 flex-shrink-0" />
                      {!collapsed && <span>{item.title}</span>}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default AppSidebar;
