import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  BookOpen,
  Pencil,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { buttonVariants } from "@/components/ui/button";
import { DeleteSubjectButton } from "@/components/admin/delete-subject-button";
import { SubjectClassManager } from "@/components/admin/subject-class-manager";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SubjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SubjectPage({
  params,
}: SubjectPageProps) {
  const session = await auth();

  if (
    !session?.user ||
    session.user.role !== "SCHOOL_ADMIN" ||
    !session.user.schoolId
  ) {
    redirect("/login");
  }

  const { id } = await params;

  const subject =
    await prisma.subject.findFirst({
      where: {
        id,
        schoolId: session.user.schoolId,
      },
      include: {
        classes: {
          include: {
            class: true,
          },
          orderBy: {
            class: {
              name: "asc",
            },
          },
        },
      },
    });

  if (!subject) {
    notFound();
  }

  return (
    <main className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Link
            href="/admin/subjects"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Subjects
          </Link>

          <p className="text-sm font-medium text-muted-foreground">
            Subject Profile
          </p>

          <h1 className="mt-1 flex items-center gap-2 text-3xl font-semibold tracking-tight">
            <BookOpen className="size-7" />
            {subject.name}
          </h1>

          <p className="mt-1 text-muted-foreground">
            {subject.code
              ? `Subject Code: ${subject.code}`
              : "No subject code assigned"}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/subjects/${subject.id}/edit`}
            className={buttonVariants()}
          >
            <Pencil className="mr-2 size-4" />
            Edit Subject
          </Link>

          <DeleteSubjectButton
            subjectId={subject.id}
            subjectName={subject.name}
          />
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>
            Subject Information
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Subject Name
            </p>

            <p className="mt-1 font-medium">
              {subject.name}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Subject Code
            </p>

            <p className="mt-1 font-medium">
              {subject.code ?? "—"}
            </p>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>
            Classes Using This Subject
          </CardTitle>

          <p className="text-sm text-muted-foreground">
            Assign this subject to classes and manage existing assignments.
          </p>
        </CardHeader>

        <CardContent>
          <SubjectClassManager
            subjectId={subject.id}
          />
        </CardContent>
      </Card>
    </main>
  );
}
