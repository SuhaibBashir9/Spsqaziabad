import Link from "next/link";
import { ArrowLeft, Bell, CalendarDays } from "lucide-react";
import { notFound } from "next/navigation";

import { SiteHeader } from "@/components/site-header";
import { prisma } from "@/lib/db/prisma";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function NoticePage({
  params,
}: PageProps) {
  const { id } = await params;

  const school = await prisma.school.findUnique({
    where: {
      slug: "sps-qaziabad",
    },
    select: {
      id: true,
    },
  });

  if (!school) {
    notFound();
  }

  const notice = await prisma.notice.findFirst({
    where: {
      id,
      schoolId: school.id,
      published: true,
    },
  });

  if (!notice) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white text-slate-900">
      <SiteHeader />

      <article>
        <div className="mx-auto max-w-4xl px-5 py-16 sm:px-6 lg:px-8">
          <Link
            href="/notices"
            className="inline-flex items-center gap-2 text-sm font-medium text-slate-500 hover:text-slate-950"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Notices
          </Link>

          <div className="mt-12">
            <div className="flex flex-wrap items-center gap-3 text-xs font-semibold uppercase tracking-widest text-slate-500">
              <span className="inline-flex items-center gap-2">
                <Bell className="h-4 w-4" />
                {notice.category}
              </span>

              <span className="h-1 w-1 rounded-full bg-slate-400" />

              <span className="inline-flex items-center gap-2">
                <CalendarDays className="h-4 w-4" />

                {notice.publishedAt
                  ? notice.publishedAt.toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )
                  : ""}
              </span>
            </div>

            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              {notice.title}
            </h1>

            {notice.description && (
              <p className="mt-6 text-lg leading-8 text-slate-600">
                {notice.description}
              </p>
            )}

            <div className="my-10 h-px bg-slate-200" />

            <div className="whitespace-pre-wrap text-base leading-8 text-slate-700">
              {notice.content}
            </div>

            {notice.attachmentUrl && (
              <div className="mt-10">
                <a
                  href={notice.attachmentUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white hover:bg-slate-800"
                >
                  View Attachment
                </a>
              </div>
            )}
          </div>
        </div>
      </article>

      <footer className="bg-slate-950 py-10 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} SPS Qaziabad. All rights reserved.
      </footer>
    </main>
  );
}