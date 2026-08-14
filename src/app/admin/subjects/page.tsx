import Link from "next/link";
import { redirect } from "next/navigation";
import {
  BookOpen,
  Plus,
  Search,
} from "lucide-react";

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

type SubjectsPageProps = {
  searchParams: Promise<{
    q?: string;
  }>;
};

export default async function SubjectsPage({
  searchParams,
}: SubjectsPageProps) {
  const session = await auth();

  if (
    !session?.user ||
    session.user.role !== "ADMIN" ||
    !session.user.schoolId
  ) {
    redirect("/login");
  }

  const params = await searchParams;

  const query =
    params.q?.trim() ?? "";

  const subjects =
    await prisma.subject.findMany({
      where: {
        schoolId: session.user.schoolId,
        ...(query
          ? {
              OR: [
                {
                  name: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  code: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
      include: {
        classes: true,
      },
      orderBy: {
        name: "asc",
      },
    });

  return (
    <main className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            School Management
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Subjects
          </h1>

          <p className="mt-1 text-muted-foreground">
            Manage subjects offered by your school.
          </p>
        </div>

        <Link
          href="/admin/subjects/new"
          className={buttonVariants()}
        >
          <Plus className="mr-2 size-4" />
          Add Subject
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Subjects ({subjects.length})
          </CardTitle>

          <form
            method="GET"
            className="relative pt-2"
          >
            <Search className="absolute left-3 top-5 size-4 text-muted-foreground" />

            <Input
              name="q"
              defaultValue={query}
              placeholder="Search by subject name or code..."
              className="pl-9"
            />
          </form>
        </CardHeader>

        <CardContent>
          {subjects.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <BookOpen className="mx-auto size-10 text-muted-foreground" />

              <p className="mt-4 font-medium">
                {query
                  ? "No subjects found"
                  : "No subjects yet"}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {query
                  ? "Try a different search."
                  : "Add your first subject to get started."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b text-left">
                    <th className="px-4 py-3 font-medium">
                      Subject
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Code
                    </th>

                    <th className="px-4 py-3 font-medium">
                      Classes
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {subjects.map((subject) => (
                    <tr
                      key={subject.id}
                      className="border-b last:border-0 hover:bg-muted/50"
                    >
                      <td className="p-0">
                        <Link
                          href={`/admin/subjects/${subject.id}`}
                          className="block px-4 py-3 font-medium"
                        >
                          {subject.name}
                        </Link>
                      </td>

                      <td className="p-0">
                        <Link
                          href={`/admin/subjects/${subject.id}`}
                          className="block px-4 py-3"
                        >
                          {subject.code ?? "—"}
                        </Link>
                      </td>

                      <td className="p-0">
                        <Link
                          href={`/admin/subjects/${subject.id}`}
                          className="block px-4 py-3"
                        >
                          {subject.classes.length}
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