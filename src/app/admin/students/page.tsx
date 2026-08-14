import Link from "next/link";
import { redirect } from "next/navigation";

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

type StudentsPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function StudentsPage({
  searchParams,
}: StudentsPageProps) {
  const session = await auth();

  if (
    !session?.user ||
    session.user.role !== "ADMIN" ||
    !session.user.schoolId
  ) {
    redirect("/login");
  }

  const params = await searchParams;
  const query = params.q?.trim() ?? "";

  const students = await prisma.student.findMany({
    where: {
      schoolId: session.user.schoolId,
      ...(query
        ? {
            OR: [
              {
                admissionNumber: {
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
            ],
          }
        : {}),
    },

    include: {
      class: {
        select: {
          name: true,
          section: true,
          academicYear: true,
        },
      },
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
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            School Management
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Students
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage students enrolled at your school.
          </p>
        </div>

        <Link
          href="/admin/students/new"
          className={buttonVariants()}
        >
          Add Student
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Students ({students.length})
          </CardTitle>

          <form method="GET" className="pt-2">
            <Input
              name="q"
              defaultValue={query}
              placeholder="Search by admission number or name..."
            />
          </form>
        </CardHeader>

        <CardContent>
          {students.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <p className="font-medium">
                {query
                  ? "No students found"
                  : "No students yet"}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {query
                  ? "Try a different search."
                  : "Add your first student to get started."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-4 py-3 font-medium">
                      Admission No.
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Student
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Class
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Phone
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Gender
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {students.map((student) => (
                    <tr
                      key={student.id}
                      className="border-b last:border-0"
                    >
                      <td
                        colSpan={5}
                        className="p-0"
                      >
                        <Link
                          href={`/admin/students/${student.id}`}
                          className="grid grid-cols-5 items-center transition-colors hover:bg-muted/50"
                        >
                          <span className="px-4 py-3 font-medium">
                            {student.admissionNumber}
                          </span>

                          <span className="px-4 py-3">
                            {student.firstName}{" "}
                            {student.lastName ?? ""}
                          </span>

                          <span className="px-4 py-3">
                            {student.class
                              ? `${student.class.name} - ${student.class.section}`
                              : "Not assigned"}
                          </span>

                          <span className="px-4 py-3">
                            {student.phone ?? "—"}
                          </span>

                          <span className="px-4 py-3">
                            {student.gender ?? "—"}
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