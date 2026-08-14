import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function getAuthorizedStudent(id: string) {
  const session = await auth();

  if (!session?.user) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  if (session.user.role !== "ADMIN") {
    return {
      error: NextResponse.json(
        { error: "Forbidden" },
        { status: 403 },
      ),
    };
  }

  if (!session.user.schoolId) {
    return {
      error: NextResponse.json(
        { error: "School not found" },
        { status: 400 },
      ),
    };
  }

  const student = await prisma.student.findFirst({
    where: {
      id,
      schoolId: session.user.schoolId,
    },
  });

  if (!student) {
    return {
      error: NextResponse.json(
        { error: "Student not found." },
        { status: 404 },
      ),
    };
  }

  return {
    session,
    student,
  };
}

/* UPDATE STUDENT */
export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const result = await getAuthorizedStudent(id);

    if (result.error) {
      return result.error;
    }

    const body = await request.json();

    const admissionNumber =
      typeof body.admissionNumber === "string"
        ? body.admissionNumber.trim()
        : "";

    const firstName =
      typeof body.firstName === "string"
        ? body.firstName.trim()
        : "";

    const lastName =
      typeof body.lastName === "string"
        ? body.lastName.trim()
        : "";

    const dateOfBirth =
      typeof body.dateOfBirth === "string"
        ? body.dateOfBirth.trim()
        : "";

    const gender =
      typeof body.gender === "string"
        ? body.gender.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    const address =
      typeof body.address === "string"
        ? body.address.trim()
        : "";

    const classId =
      typeof body.classId === "string"
        ? body.classId.trim()
        : "";

    if (!admissionNumber || !firstName) {
      return NextResponse.json(
        {
          error:
            "Admission number and first name are required.",
        },
        { status: 400 },
      );
    }

    const existingStudent =
      await prisma.student.findFirst({
        where: {
          schoolId: result.student.schoolId,
          admissionNumber,
          NOT: {
            id: result.student.id,
          },
        },
      });

    if (existingStudent) {
      return NextResponse.json(
        {
          error:
            "A student with this admission number already exists.",
        },
        { status: 409 },
      );
    }

    if (classId) {
      const schoolClass = await prisma.class.findFirst({
        where: {
          id: classId,
          schoolId: result.student.schoolId,
        },
      });

      if (!schoolClass) {
        return NextResponse.json(
          {
            error:
              "The selected class does not belong to this school.",
          },
          { status: 400 },
        );
      }
    }

    let parsedDateOfBirth: Date | null = null;

    if (dateOfBirth) {
      const date = new Date(
        `${dateOfBirth}T00:00:00`,
      );

      if (Number.isNaN(date.getTime())) {
        return NextResponse.json(
          {
            error: "Invalid date of birth.",
          },
          { status: 400 },
        );
      }

      parsedDateOfBirth = date;
    }

    const student = await prisma.student.update({
      where: {
        id: result.student.id,
      },
      data: {
        admissionNumber,
        firstName,
        lastName: lastName || null,
        dateOfBirth: parsedDateOfBirth,
        gender: gender || null,
        phone: phone || null,
        address: address || null,
        classId: classId || null,
      },
    });

    return NextResponse.json(student);
  } catch (error) {
    console.error("UPDATE STUDENT ERROR:", error);

    return NextResponse.json(
      { error: "Unable to update student." },
      { status: 500 },
    );
  }
}

/* DELETE STUDENT */
export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const result = await getAuthorizedStudent(id);

    if (result.error) {
      return result.error;
    }

    await prisma.student.delete({
      where: {
        id: result.student.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE STUDENT ERROR:", error);

    return NextResponse.json(
      { error: "Unable to delete student." },
      { status: 500 },
    );
  }
}