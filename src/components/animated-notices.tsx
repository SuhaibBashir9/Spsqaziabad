"use client";

import Link from "next/link";
import {
  Bell,
  CalendarDays,
  ChevronRight,
} from "lucide-react";

type Notice = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  publishedAt: Date | null;
};

export function AnimatedNotices({
  notices,
}: {
  notices: Notice[];
}) {
  if (notices.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-slate-300 bg-slate-50 px-6 py-20 text-center">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-950 text-white">
          <Bell className="h-6 w-6" />
        </div>

        <h2 className="mt-6 text-xl font-semibold">
          No notices at the moment
        </h2>

        <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-slate-500">
          Important school announcements will appear here when
          published.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {notices.map((notice, index) => (
        <article
          key={notice.id}
          className="group rounded-3xl border border-slate-200 bg-white p-6 opacity-0 animate-[fadeInUp_0.6s_ease-out_both] transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-xl sm:p-7"
          style={{
            animationDelay: `${index * 100}ms`,
          }}
        >
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start">
            {/* Notice icon */}
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white transition-all duration-300 group-hover:scale-105 group-hover:rotate-2">
              <Bell className="h-5 w-5" />
            </div>

            <div className="min-w-0 flex-1">
              {/* Meta */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600 transition-colors duration-300 group-hover:bg-slate-200">
                  {notice.category}
                </span>

                {notice.publishedAt && (
                  <span className="inline-flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5" />

                    {notice.publishedAt.toLocaleDateString(
                      "en-IN",
                      {
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                      },
                    )}
                  </span>
                )}
              </div>

              {/* Title */}
              <h2 className="mt-3 text-xl font-semibold tracking-tight transition-colors duration-300 group-hover:text-slate-700 sm:text-2xl">
                {notice.title}
              </h2>

              {/* Description */}
              {notice.description && (
                <p className="mt-3 max-w-3xl leading-7 text-slate-600">
                  {notice.description}
                </p>
              )}

              {/* Read notice */}
              <Link
                href={`/notices/${notice.id}`}
                className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 transition-all duration-300 hover:gap-2.5"
              >
                Read notice

                <ChevronRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}