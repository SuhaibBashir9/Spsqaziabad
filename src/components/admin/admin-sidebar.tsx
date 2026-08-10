"use client";

import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  School,
  BookOpen,
  Settings,
  Bell,
  LogOut,
} from "lucide-react";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";

type AdminSidebarProps = {
  schoolName: string;
  userName: string;
  userEmail: string;
};

const navigation = [
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    title: "Students",
    href: "/admin/students",
    icon: GraduationCap,
  },
  {
    title: "Classes",
    href: "/admin/classes",
    icon: School,
  },
  {
    title: "Teachers",
    href: "/admin/teachers",
    icon: Users,
  },
  {
    title: "Subjects",
    href: "/admin/subjects",
    icon: BookOpen,
  },
  {
    title: "Notices",
    href: "/admin/notices",
    icon: Bell,
  },
  {
    title: "Settings",
    href: "/admin/settings",
    icon: Settings,
  },
];

export function AdminSidebar({
  schoolName,
  userName,
  userEmail,
}: AdminSidebarProps) {
  const pathname = usePathname();

  async function handleSignOut() {
    await signOut({
      callbackUrl: "/login",
    });
  }

  return (
    <Sidebar>
      <SidebarHeader>
        <div className="px-2 py-2">
          <p className="font-semibold">
            SPS Qaziabad
          </p>

          <p className="truncate text-xs text-muted-foreground">
            {schoolName}
          </p>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>
            School Management
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              {navigation.map((item) => {
                const Icon = item.icon;

                const active =
                  pathname === item.href ||
                  (item.href !== "/admin" &&
                    pathname.startsWith(
                      `${item.href}/`,
                    ));

                return (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      isActive={active}
                      onClick={() => {
                        window.location.href =
                          item.href;
                      }}
                    >
                      <Icon />
                      <span>{item.title}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="border-t px-2 py-3">
          <p className="truncate text-sm font-medium">
            {userName}
          </p>

          <p className="truncate text-xs text-muted-foreground">
            {userEmail}
          </p>

          <button
            type="button"
            onClick={handleSignOut}
            className="mt-3 flex w-full items-center gap-2 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            <LogOut className="size-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}