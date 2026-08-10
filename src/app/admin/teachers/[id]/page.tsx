import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  BriefcaseBusiness,
  Pencil,
  Phone,
  User,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { buttonVariants } from "@/components/ui/button";
import { DeleteTeacherButton } from "@/components/admin/delete-teacher-button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type TeacherPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function TeacherPage({
  params,
}: TeacherPageProps) {
  const session = await auth();

  if (
    !session?.user ||
    session.user.role !== "SCHOOL_ADMIN" ||
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

  const fullName =
    `${teacher.firstName} ${
      teacher.lastName ?? ""
    }`.trim();

  return (
    <main className="flex-1 space-y-6 p-6 md:p-8">
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
        <div>
          <Link
            href="/admin/teachers"
            className="mb-4 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Teachers
          </Link>

          <p className="text-sm font-medium text-muted-foreground">
            Teacher Profile
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            {fullName}
          </h1>

          <p className="mt-1 text-muted-foreground">
            Employee No.{" "}
            {teacher.employeeNumber}
          </p>
        </div>

        <div className="flex flex-wrap gap-2">
          <Link
            href={`/admin/teachers/${teacher.id}/edit`}
            className={buttonVariants()}
          >
            <Pencil className="mr-2 size-4" />
            Edit Teacher
          </Link>

          <DeleteTeacherButton
            teacherId={teacher.id}
            teacherName={fullName}
          />
        </div>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="size-5" />
              Personal Information
            </CardTitle>
          </CardHeader>

          <CardContent className="grid gap-5 sm:grid-cols-2">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                First Name
              </p>

              <p className="mt-1 font-medium">
                {teacher.firstName}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Last Name
              </p>

              <p className="mt-1 font-medium">
                {teacher.lastName ?? "—"}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Employee Number
              </p>

              <p className="mt-1 font-medium">
                {teacher.employeeNumber}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Qualification
              </p>

              <p className="mt-1 font-medium">
                {teacher.qualification ?? "—"}
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BriefcaseBusiness className="size-5" />
              Work Information
            </CardTitle>
          </CardHeader>

          <CardContent className="space-y-5">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Department
              </p>

              <p className="mt-1 font-medium">
                {teacher.department ?? "—"}
              </p>
            </div>

            <div>
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Phone className="size-3.5" />
                Phone
              </p>

              <p className="mt-1 font-medium">
                {teacher.phone ?? "—"}
              </p>
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>
            Record Information
          </CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Added
            </p>

            <p className="mt-1 font-medium">
              {teacher.createdAt.toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                },
              )}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Last Updated
            </p>

            <p className="mt-1 font-medium">
              {teacher.updatedAt.toLocaleDateString(
                "en-IN",
                {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                },
              )}
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}