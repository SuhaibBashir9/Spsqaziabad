import { SiteHeader } from "@/components/site-header";
import { AnimatedNotices } from "@/components/animated-notices";
import { prisma } from "@/lib/db/prisma";

export default async function NoticesPage() {
  const school = await prisma.school.findUnique({
    where: {
      slug: "sps-qaziabad",
    },
  });

  const notices = school
    ? await prisma.notice.findMany({
        where: {
          schoolId: school.id,
          published: true,
        },
        orderBy: [
          {
            publishedAt: "desc",
          },
          {
            createdAt: "desc",
          },
        ],
      })
    : [];

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <SiteHeader />

      {/* Hero */}
      <section className="overflow-hidden border-b bg-slate-950 text-white">
        <div className="mx-auto max-w-7xl px-5 py-20 sm:px-6 lg:px-8">
          <p className="animate-[fadeInUp_0.6s_ease-out_both] text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
            SPS Qaziabad
          </p>

          <h1 className="mt-4 animate-[fadeInUp_0.7s_ease-out_0.1s_both] text-5xl font-semibold tracking-tight sm:text-6xl">
            Notices
          </h1>

          <p className="mt-5 max-w-2xl animate-[fadeInUp_0.7s_ease-out_0.2s_both] text-lg leading-8 text-slate-300">
            Important announcements and information for students and parents.
          </p>
        </div>
      </section>

      {/* Notices */}
      <section className="py-20">
        <div className="mx-auto max-w-5xl px-5 sm:px-6 lg:px-8">
          {notices.length === 0 ? (
            <div className="animate-[fadeInUp_0.7s_ease-out_both] rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-20 text-center">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
                <span className="text-xl">!</span>
              </div>

              <h2 className="mt-6 text-xl font-semibold">
                No notices at the moment
              </h2>

              <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
                Important school announcements will appear here when they are
                published.
              </p>
            </div>
          ) : (
            <AnimatedNotices notices={notices} />
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 py-10 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} SPS Qaziabad. All rights reserved.
      </footer>
    </main>
  );
}