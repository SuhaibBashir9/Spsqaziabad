import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { EditSubjectForm } from "@/components/admin/edit-subject-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EditSubjectPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditSubjectPage({
  params,
}: EditSubjectPageProps) {
  const session = await auth();

  if (
    !session?.user ||
    session.user.role !== "ADMIN" ||
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
    });

  if (!subject) {
    notFound();
  }

  return (
    <main className="flex-1 space-y-6 p-6 md:p-8">
      <div>
        <Link
          href={`/admin/subjects/${subject.id}`}
          className="mb-3 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium hover:bg-muted"
        >
          ← Back to Subject
        </Link>

        <p className="text-sm text-muted-foreground">
          Subject Management
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Edit Subject
        </h1>

        <p className="mt-1 text-muted-foreground">
          Update the subject information.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>
            {subject.name}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <EditSubjectForm
            subject={{
              id: subject.id,
              name: subject.name,
              code: subject.code,
            }}
          />
        </CardContent>
      </Card>
    </main>
  );
}