import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Bell,
  BookOpen,
  CalendarDays,
  GraduationCap,
  Plus,
  School,
  Users,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { buttonVariants } from "@/components/ui/button";

export default async function AdminDashboard() {
  const session = await auth();

  if (
    !session?.user ||
    session.user.role !== "SCHOOL_ADMIN" ||
    !session.user.schoolId
  ) {
    redirect("/login");
  }

  const schoolId = session.user.schoolId;

  const [
    school,
    studentCount,
    teacherCount,
    classCount,
    subjectCount,
    noticeCount,
    publishedNoticeCount,
    draftNoticeCount,
    recentStudents,
    recentNotices,
  ] = await Promise.all([
    prisma.school.findUnique({
      where: {
        id: schoolId,
      },
      select: {
        name: true,
      },
    }),

    prisma.student.count({
      where: {
        schoolId,
      },
    }),

    prisma.teacher.count({
      where: {
        schoolId,
      },
    }),

    prisma.class.count({
      where: {
        schoolId,
      },
    }),

    prisma.subject.count({
      where: {
        schoolId,
      },
    }),

    prisma.notice.count({
      where: {
        schoolId,
      },
    }),

    prisma.notice.count({
      where: {
        schoolId,
        published: true,
      },
    }),

    prisma.notice.count({
      where: {
        schoolId,
        published: false,
      },
    }),

    prisma.student.findMany({
      where: {
        schoolId,
      },
      select: {
        id: true,
        admissionNumber: true,
        firstName: true,
        lastName: true,
        createdAt: true,
        class: {
          select: {
            name: true,
            section: true,
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
      take: 5,
    }),

    prisma.notice.findMany({
      where: {
        schoolId,
      },
      select: {
        id: true,
        title: true,
        category: true,
        published: true,
        publishedAt: true,
        createdAt: true,
      },
      orderBy: [
        {
          publishedAt: "desc",
        },
        {
          createdAt: "desc",
        },
      ],
      take: 5,
    }),
  ]);

  if (!school) {
    redirect("/login");
  }

  const stats = [
    {
      title: "Students",
      value: studentCount,
      description: "Total enrolled students",
      icon: GraduationCap,
      href: "/admin/students",
    },
    {
      title: "Teachers",
      value: teacherCount,
      description: "Teaching staff",
      icon: Users,
      href: "/admin/teachers",
    },
    {
      title: "Classes",
      value: classCount,
      description: "Active school classes",
      icon: School,
      href: "/admin/classes",
    },
    {
      title: "Subjects",
      value: subjectCount,
      description: "School subjects",
      icon: BookOpen,
      href: "/admin/subjects",
    },
    {
      title: "Published Notices",
      value: publishedNoticeCount,
      description: "Currently published",
      icon: Bell,
      href: "/admin/notices",
    },
    {
      title: "Draft Notices",
      value: draftNoticeCount,
      description: "Waiting to be published",
      icon: Bell,
      href: "/admin/notices",
    },
  ];

  return (
    <main className="flex-1 space-y-8 p-6 md:p-8">
      {/* Header */}
      <section className="flex flex-col justify-between gap-5 lg:flex-row lg:items-center">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            School Administration
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Welcome to {school.name}
          </h1>

          <p className="mt-2 text-muted-foreground">
            Manage students, teachers, classes, subjects and school
            communication from one place.
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/students/new"
            className={buttonVariants()}
          >
            <Plus className="mr-2 size-4" />
            Add Student
          </Link>

          <Link
            href="/admin/notices"
            className={buttonVariants({
              variant: "outline",
            })}
          >
            <Bell className="mr-2 size-4" />
            Notices
          </Link>
        </div>
      </section>

      {/* Statistics */}
      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <Link
              key={stat.title}
              href={stat.href}
              className="block"
            >
              <Card className="h-full transition-colors hover:bg-muted/50">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                  <CardTitle className="text-sm font-medium">
                    {stat.title}
                  </CardTitle>

                  <Icon className="size-5 text-muted-foreground" />
                </CardHeader>

                <CardContent>
                  <div className="text-3xl font-bold">
                    {stat.value}
                  </div>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </section>

      {/* Quick Actions */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Quick Management</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <Link
                href="/admin/students/new"
                className="rounded-xl border p-4 transition hover:bg-muted/50"
              >
                <GraduationCap className="size-6" />

                <h3 className="mt-3 font-semibold">
                  Add Student
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Register a new student.
                </p>
              </Link>

              <Link
                href="/admin/teachers/new"
                className="rounded-xl border p-4 transition hover:bg-muted/50"
              >
                <Users className="size-6" />

                <h3 className="mt-3 font-semibold">
                  Add Teacher
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Add a teaching staff member.
                </p>
              </Link>

              <Link
                href="/admin/classes"
                className="rounded-xl border p-4 transition hover:bg-muted/50"
              >
                <School className="size-6" />

                <h3 className="mt-3 font-semibold">
                  Manage Classes
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Manage classes and sections.
                </p>
              </Link>

              <Link
                href="/admin/subjects"
                className="rounded-xl border p-4 transition hover:bg-muted/50"
              >
                <BookOpen className="size-6" />

                <h3 className="mt-3 font-semibold">
                  Manage Subjects
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Manage school subjects.
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Recent Activity */}
      <section className="grid gap-6 lg:grid-cols-2">
        {/* Recent Students */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recently Added Students</CardTitle>

            <Link
              href="/admin/students"
              className="text-sm font-medium hover:underline"
            >
              View all
            </Link>
          </CardHeader>

          <CardContent>
            {recentStudents.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <GraduationCap className="mx-auto size-8 text-muted-foreground" />

                <p className="mt-3 font-medium">
                  No students yet
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Add your first student to get started.
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {recentStudents.map((student) => {
                  const fullName =
                    `${student.firstName} ${
                      student.lastName ?? ""
                    }`.trim();

                  return (
                    <Link
                      key={student.id}
                      href={`/admin/students/${student.id}`}
                      className="flex items-center justify-between gap-4 py-4 transition-colors first:pt-0 last:pb-0 hover:bg-muted/30"
                    >
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {fullName}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          Admission No.{" "}
                          {student.admissionNumber}
                        </p>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-medium">
                          {student.class
                            ? `${student.class.name} - ${student.class.section}`
                            : "Not assigned"}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {student.createdAt.toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Recent Notices */}
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Notices</CardTitle>

            <Link
              href="/admin/notices"
              className="text-sm font-medium hover:underline"
            >
              View all
            </Link>
          </CardHeader>

          <CardContent>
            {recentNotices.length === 0 ? (
              <div className="rounded-lg border border-dashed p-8 text-center">
                <Bell className="mx-auto size-8 text-muted-foreground" />

                <p className="mt-3 font-medium">
                  No notices yet
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  Create a notice for your school.
                </p>
              </div>
            ) : (
              <div className="divide-y">
                {recentNotices.map((notice) => (
                  <Link
                    key={notice.id}
                    href="/admin/notices"
                    className="block py-4 transition-colors first:pt-0 last:pb-0 hover:bg-muted/30"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <p className="truncate font-medium">
                          {notice.title}
                        </p>

                        <p className="mt-1 text-xs text-muted-foreground">
                          {notice.category}
                        </p>
                      </div>

                      <span
                        className={
                          notice.published
                            ? "shrink-0 text-xs font-medium"
                            : "shrink-0 text-xs font-medium text-muted-foreground"
                        }
                      >
                        {notice.published
                          ? "Published"
                          : "Draft"}
                      </span>
                    </div>

                    <p className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
                      <CalendarDays className="size-3.5" />

                      {(
                        notice.publishedAt ??
                        notice.createdAt
                      ).toLocaleDateString("en-IN", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Notice Summary */}
      <section>
        <Card>
          <CardHeader>
            <CardTitle>Notice Overview</CardTitle>
          </CardHeader>

          <CardContent>
            <div className="grid gap-4 sm:grid-cols-3">
              <Link
                href="/admin/notices"
                className="rounded-xl border p-5 transition hover:bg-muted/50"
              >
                <p className="text-sm text-muted-foreground">
                  Total Notices
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {noticeCount}
                </p>
              </Link>

              <Link
                href="/admin/notices"
                className="rounded-xl border p-5 transition hover:bg-muted/50"
              >
                <p className="text-sm text-muted-foreground">
                  Published
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {publishedNoticeCount}
                </p>
              </Link>

              <Link
                href="/admin/notices"
                className="rounded-xl border p-5 transition hover:bg-muted/50"
              >
                <p className="text-sm text-muted-foreground">
                  Drafts
                </p>

                <p className="mt-2 text-2xl font-bold">
                  {draftNoticeCount}
                </p>
              </Link>
            </div>
          </CardContent>
        </Card>
      </section>
    </main>
  );
}