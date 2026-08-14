import { redirect } from "next/navigation";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/login");
  }

  if (!session.user.schoolId) {
    redirect("/login");
  }

  const schoolId = session.user.schoolId;

  const formData = await request.formData();

  const admissionNumber =
    String(formData.get("admissionNumber") ?? "").trim();

  const firstName =
    String(formData.get("firstName") ?? "").trim();

  const lastName =
    String(formData.get("lastName") ?? "").trim();

  const classId =
    String(formData.get("classId") ?? "").trim();

  const dateOfBirth =
    String(formData.get("dateOfBirth") ?? "").trim();

  const gender =
    String(formData.get("gender") ?? "").trim();

  const phone =
    String(formData.get("phone") ?? "").trim();

  const address =
    String(formData.get("address") ?? "").trim();

  if (!admissionNumber || !firstName) {
    return new Response(
      "Admission number and first name are required.",
      {
        status: 400,
      },
    );
  }

  if (classId) {
    const schoolClass = await prisma.class.findFirst({
      where: {
        id: classId,
        schoolId,
      },
    });

    if (!schoolClass) {
      return new Response(
        "The selected class does not belong to this school.",
        {
          status: 400,
        },
      );
    }
  }

  const existingStudent = await prisma.student.findFirst({
    where: {
      schoolId,
      admissionNumber,
    },
  });

  if (existingStudent) {
    return new Response(
      "A student with this admission number already exists.",
      {
        status: 409,
      },
    );
  }

  let parsedDateOfBirth: Date | undefined;

  if (dateOfBirth) {
    const date = new Date(`${dateOfBirth}T00:00:00`);

    if (Number.isNaN(date.getTime())) {
      return new Response(
        "Invalid date of birth.",
        {
          status: 400,
        },
      );
    }

    parsedDateOfBirth = date;
  }

  await prisma.student.create({
    data: {
      schoolId,
      admissionNumber,
      firstName,
      lastName: lastName || null,
      dateOfBirth: parsedDateOfBirth ?? null,
      gender: gender || null,
      phone: phone || null,
      address: address || null,
      classId: classId || null,
    },
  });

  redirect("/admin/students");
}