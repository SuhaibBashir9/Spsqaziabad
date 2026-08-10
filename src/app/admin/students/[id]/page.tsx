import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Pencil,
  Phone,
  User,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DeleteStudentButton } from "@/components/admin/delete-student-button";

type StudentPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function StudentPage({ params }: StudentPageProps) {
  const session = await auth();

  if (
    !session?.user ||
    session.user.role !== "SCHOOL_ADMIN" ||
    !session.user.schoolId
  ) {
    redirect("/login");
  }

  const { id } = await params;

  const student = await prisma.student.findFirst({
    where: {
      id,
      schoolId: session.user.schoolId,
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
  });

  if (!student) {
    notFound();
  }

  const fullName = `${student.firstName} ${student.lastName ?? ""}`.trim();

  const dateOfBirth = student.dateOfBirth
    ? student.dateOfBirth.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "—";

  return (
    <main className="flex-1 space-y-6 p-6 md:p-8">
      <div>
        <Link
          href="/admin/students"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to Students
        </Link>

        <div className="mt-5 flex flex-col justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Student Profile
            </p>

            <h1 className="mt-1 text-3xl font-semibold tracking-tight">
              {fullName}
            </h1>

            <p className="mt-1 text-muted-foreground">
              Admission No. {student.admissionNumber}
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
            <Link
              href={`/admin/students/${student.id}/edit`}
              className={buttonVariants()}
            >
              <Pencil className="mr-2 size-4" />
              Edit Student
            </Link>

            <DeleteStudentButton studentId={student.id} />
          </div>
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

              <p className="mt-1 font-medium">{student.firstName}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Last Name
              </p>

              <p className="mt-1 font-medium">{student.lastName ?? "—"}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Admission Number
              </p>

              <p className="mt-1 font-medium">{student.admissionNumber}</p>
            </div>

            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Gender
              </p>

              <p className="mt-1 font-medium">{student.gender ?? "—"}</p>
            </div>

            <div>
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <CalendarDays className="size-3.5" />
                Date of Birth
              </p>

              <p className="mt-1 font-medium">{dateOfBirth}</p>
            </div>

            <div>
              <p className="flex items-center gap-2 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                <Phone className="size-3.5" />
                Phone
              </p>

              <p className="mt-1 font-medium">{student.phone ?? "—"}</p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Academic Information</CardTitle>
          </CardHeader>

          <CardContent>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Class
              </p>

              {student.class ? (
                <>
                  <p className="mt-1 text-lg font-semibold">
                    {student.class.name} - {student.class.section}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Academic Year {student.class.academicYear}
                  </p>
                </>
              ) : (
                <p className="mt-1 font-medium text-muted-foreground">
                  Not assigned
                </p>
              )}
            </div>
          </CardContent>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="size-5" />
            Address
          </CardTitle>
        </CardHeader>

        <CardContent>
          <p className="whitespace-pre-wrap text-sm">
            {student.address ?? "No address added."}
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Record Information</CardTitle>
        </CardHeader>

        <CardContent className="grid gap-5 sm:grid-cols-2">
          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Added
            </p>

            <p className="mt-1 font-medium">
              {student.createdAt.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <div>
            <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Last Updated
            </p>

            <p className="mt-1 font-medium">
              {student.updatedAt.toLocaleDateString("en-IN", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>
        </CardContent>
      </Card>
    </main>
  );
}
