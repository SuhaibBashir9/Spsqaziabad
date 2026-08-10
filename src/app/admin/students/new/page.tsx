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
import { Label } from "@/components/ui/label";

export default async function NewStudentPage() {
  const session = await auth();

  if (
    !session?.user ||
    session.user.role !== "SCHOOL_ADMIN" ||
    !session.user.schoolId
  ) {
    redirect("/login");
  }

  const classes = await prisma.class.findMany({
    where: {
      schoolId: session.user.schoolId,
    },
    orderBy: [
      {
        name: "asc",
      },
      {
        section: "asc",
      },
    ],
  });

  return (
    <main className="flex-1 space-y-6 p-6 md:p-8">
      <div>
        <Link
          href="/admin/students"
          className="mb-3 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium hover:bg-muted"
        >
          ← Back to Students
        </Link>

        <p className="text-sm font-medium text-muted-foreground">
          Student Management
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Add Student
        </h1>

        <p className="mt-1 text-muted-foreground">
          Add a new student to your school.
        </p>
      </div>

      <Card className="max-w-3xl">
        <CardHeader>
          <CardTitle>Student Information</CardTitle>
        </CardHeader>

        <CardContent>
          <form
            action="/api/admin/students"
            method="POST"
            className="space-y-6"
          >
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="admissionNumber">
                  Admission Number
                </Label>

                <Input
                  id="admissionNumber"
                  name="admissionNumber"
                  placeholder="e.g. SPS-2026-001"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="firstName">
                  First Name
                </Label>

                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="First name"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">
                  Last Name
                </Label>

                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Last name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="dateOfBirth">
                  Date of Birth
                </Label>

                <Input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="gender">
                  Gender
                </Label>

                <select
                  id="gender"
                  name="gender"
                  defaultValue=""
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                >
                  <option value="">
                    Select gender
                  </option>

                  <option value="Male">
                    Male
                  </option>

                  <option value="Female">
                    Female
                  </option>

                  <option value="Other">
                    Other
                  </option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">
                  Phone
                </Label>

                <Input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="Phone number"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="classId">
                Class
              </Label>

              <select
                id="classId"
                name="classId"
                defaultValue=""
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              >
                <option value="">
                  Not assigned
                </option>

                {classes.map((schoolClass) => (
                  <option
                    key={schoolClass.id}
                    value={schoolClass.id}
                  >
                    {schoolClass.name} -{" "}
                    {schoolClass.section} (
                    {schoolClass.academicYear})
                  </option>
                ))}
              </select>

              {classes.length === 0 && (
                <p className="text-xs text-muted-foreground">
                  No classes have been created yet.
                </p>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">
                Address
              </Label>

              <textarea
                id="address"
                name="address"
                rows={4}
                placeholder="Student address"
                className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Link
                href="/admin/students"
                className={buttonVariants({
                  variant: "outline",
                })}
              >
                Cancel
              </Link>

              <button
                type="submit"
                className={buttonVariants()}
              >
                Add Student
              </button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}