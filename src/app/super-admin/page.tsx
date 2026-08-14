import { redirect } from "next/navigation";
import { ShieldCheck } from "lucide-react";

import { auth } from "@/auth";

export default async function SuperAdminPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  if (session.user.role !== "SUPER_ADMIN") {
    redirect("/admin");
  }

  return (
    <main className="min-h-screen bg-background p-6 md:p-8">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl border bg-card p-8">
          <div className="flex items-center gap-3">
            <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <ShieldCheck className="size-6" />
            </div>

            <div>
              <p className="text-sm font-medium text-muted-foreground">
                System Administration
              </p>

              <h1 className="text-3xl font-semibold tracking-tight">
                Super Admin Dashboard
              </h1>
            </div>
          </div>

          <p className="mt-6 text-muted-foreground">
            Welcome, {session.user.name}. You have full
            system-level administration access.
          </p>
        </div>
      </div>
    </main>
  );
}