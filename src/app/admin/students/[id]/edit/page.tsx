import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { ArrowLeft } from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { EditStudentForm } from "@/components/admin/edit-student-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type EditStudentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function EditStudentPage({
  params,
}: EditStudentPageProps) {
  const session = await auth();

  if (
    !session?.user ||
    session.user.role !== "SCHOOL_ADMIN" ||
    !session.user.schoolId
  ) {
    redirect("/login");
  }

  const { id } = await params;
  const schoolId = session.user.schoolId;

  const [student, classes] = await Promise.all([
    prisma.student.findFirst({
      where: {
        id,
        schoolId,
      },
    }),

    prisma.class.findMany({
      where: {
        schoolId,
      },
      orderBy: [
        {
          name: "asc",
        },
        {
          section: "asc",
        },
        {
          academicYear: "desc",
        },
      ],
    }),
  ]);

  if (!student) {
    notFound();
  }

  return (
    <main className="flex-1 space-y-6 p-6 md:p-8">
      <div>
        <Link
          href={`/admin/students/${student.id}`}
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Student
        </Link>

        <p className="mt-5 text-sm font-medium text-muted-foreground">
          Student Management
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Edit Student
        </h1>

        <p className="mt-1 text-muted-foreground">
          Update the student's information.
        </p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>
            {student.firstName}{" "}
            {student.lastName ?? ""}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <EditStudentForm
            student={{
              id: student.id,
              admissionNumber:
                student.admissionNumber,
              firstName: student.firstName,
              lastName: student.lastName,
              dateOfBirth:
                student.dateOfBirth,
              gender: student.gender,
              phone: student.phone,
              address: student.address,
              classId: student.classId,
            }}
            classes={classes}
          />
        </CardContent>
      </Card>
    </main>
  );
}