import Link from "next/link";
import { redirect } from "next/navigation";
import { GraduationCap, Plus, Search } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";

type TeachersPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function TeachersPage({
  searchParams,
}: TeachersPageProps) {
  const session = await auth();

  if (
    !session?.user ||
    session.user.role !== "SCHOOL_ADMIN" ||
    !session.user.schoolId
  ) {
    redirect("/login");
  }

  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  const teachers = await prisma.teacher.findMany({
    where: {
      schoolId: session.user.schoolId,
      ...(query
        ? {
            OR: [
              {
                employeeNumber: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                firstName: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                lastName: {
                  contains: query,
                  mode: "insensitive",
                },
              },
              {
                department: {
                  contains: query,
                  mode: "insensitive",
                },
              },
            ],
          }
        : {}),
    },
    orderBy: [
      {
        firstName: "asc",
      },
      {
        lastName: "asc",
      },
    ],
  });

  return (
    <main className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            School Management
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Teachers
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage teaching staff at your school.
          </p>
        </div>

        <Link
          href="/admin/teachers/new"
          className={buttonVariants()}
        >
          <Plus className="mr-2 size-4" />
          Add Teacher
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Teachers ({teachers.length})
          </CardTitle>

          <form method="GET" className="relative pt-2">
            <Search className="absolute left-3 top-5 size-4 text-muted-foreground" />

            <Input
              name="q"
              defaultValue={query}
              placeholder="Search by employee number, name or department..."
              className="pl-9"
            />
          </form>
        </CardHeader>

        <CardContent>
          {teachers.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <GraduationCap className="mx-auto size-10 text-muted-foreground" />

              <p className="mt-4 font-medium">
                {query
                  ? "No teachers found"
                  : "No teachers yet"}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {query
                  ? "Try a different search."
                  : "Add your first teacher to get started."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-4 py-3 font-medium">
                      Employee No.
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Teacher
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Qualification
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Department
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Phone
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {teachers.map((teacher) => (
                    <tr
                      key={teacher.id}
                      className="border-b last:border-0"
                    >
                      <td
                        colSpan={5}
                        className="p-0"
                      >
                        <Link
                          href={`/admin/teachers/${teacher.id}`}
                          className="grid grid-cols-5 items-center transition-colors hover:bg-muted/50"
                        >
                          <span className="px-4 py-3 font-medium">
                            {teacher.employeeNumber}
                          </span>

                          <span className="px-4 py-3 font-medium">
                            {teacher.firstName}{" "}
                            {teacher.lastName ?? ""}
                          </span>

                          <span className="px-4 py-3">
                            {teacher.qualification ?? "—"}
                          </span>

                          <span className="px-4 py-3">
                            {teacher.department ?? "—"}
                          </span>

                          <span className="px-4 py-3">
                            {teacher.phone ?? "—"}
                          </span>
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  );
}