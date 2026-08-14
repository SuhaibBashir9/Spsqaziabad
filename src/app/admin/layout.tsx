import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "ADMIN") {
    redirect("/login");
  }

  const school = session.user.schoolId
    ? await prisma.school.findUnique({
        where: {
          id: session.user.schoolId,
        },
        select: {
          name: true,
          slug: true,
        },
      })
    : null;

  if (!school) {
    redirect("/login");
  }

  return (
    <SidebarProvider>
      <AdminSidebar
        schoolName={school.name}
        userName={session.user.name ?? "Administrator"}
        userEmail={session.user.email ?? ""}
      />

      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
}