import Link from "next/link";
import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { AddTeacherForm } from "@/components/admin/add-teacher-form";

export default async function NewTeacherPage() {
  const session = await auth();

  if (
    !session?.user ||
    session.user.role !== "ADMIN" ||
    !session.user.schoolId
  ) {
    redirect("/login");
  }

  return (
    <main className="flex-1 space-y-6 p-6 md:p-8">
      <div>
        <Link
          href="/admin/teachers"
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          ← Back to Teachers
        </Link>

        <h1 className="mt-3 text-3xl font-semibold tracking-tight">
          Add Teacher
        </h1>

        <p className="mt-1 text-muted-foreground">
          Add a new member of the teaching staff.
        </p>
      </div>

      <AddTeacherForm />
    </main>
  );
}