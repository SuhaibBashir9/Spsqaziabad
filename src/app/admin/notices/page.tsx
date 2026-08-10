import { Bell } from "lucide-react";

import { NoticesManager } from "@/components/admin/notices-manager";

export default function AdminNoticesPage() {
  return (
    <main className="flex-1 space-y-6 p-6 md:p-8">
      <div>
        <div className="flex items-center gap-3">
          <div className="flex size-10 items-center justify-center rounded-xl bg-muted">
            <Bell className="size-5" />
          </div>

          <div>
            <p className="text-sm font-medium text-muted-foreground">
              School Management
            </p>

            <h1 className="text-3xl font-semibold tracking-tight">
              Notices
            </h1>

            <p className="mt-1 text-muted-foreground">
              Manage school announcements and important
              notices.
            </p>
          </div>
        </div>
      </div>

      <NoticesManager />
    </main>
  );
}