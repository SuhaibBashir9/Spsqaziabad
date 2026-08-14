import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { EditTeacherForm } from "@/components/admin/edit-teacher-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EditTeacherPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditTeacherPage({
  params,
}: EditTeacherPageProps) {
  const session = await auth();

  if (
    !session?.user ||
    session.user.role !== "ADMIN" ||
    !session.user.schoolId
  ) {
    redirect("/login");
  }

  const { id } = await params;

  const teacher = await prisma.teacher.findFirst({
    where: {
      id,
      schoolId: session.user.schoolId,
    },
  });

  if (!teacher) {
    notFound();
  }

  return (
    <main className="flex-1 space-y-6 p-6 md:p-8">
      <div>
        <Link
          href={`/admin/teachers/${teacher.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Teacher
        </Link>

        <p className="mt-5 text-sm font-medium text-muted-foreground">
          Teacher Management
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Edit Teacher
        </h1>

        <p className="mt-1 text-muted-foreground">
          Update the teacher&apos;s information.
        </p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>
            {teacher.firstName}{" "}
            {teacher.lastName ?? ""}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <EditTeacherForm
            teacher={{
              id: teacher.id,
              employeeNumber:
                teacher.employeeNumber,
              firstName: teacher.firstName,
              lastName: teacher.lastName,
              qualification:
                teacher.qualification,
              department:
                teacher.department,
              phone: teacher.phone,
            }}
          />
        </CardContent>
      </Card>
    </main>
  );
}