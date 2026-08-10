import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function getAuthorizedTeacher(id: string) {
  const session = await auth();

  if (!session?.user) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  if (session.user.role !== "SCHOOL_ADMIN") {
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

  const teacher = await prisma.teacher.findFirst({
    where: {
      id,
      schoolId: session.user.schoolId,
    },
  });

  if (!teacher) {
    return {
      error: NextResponse.json(
        { error: "Teacher not found." },
        { status: 404 },
      ),
    };
  }

  return {
    session,
    teacher,
  };
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const result = await getAuthorizedTeacher(id);

    if (result.error) {
      return result.error;
    }

    const body = await request.json();

    const employeeNumber =
      typeof body.employeeNumber === "string"
        ? body.employeeNumber.trim()
        : "";

    const firstName =
      typeof body.firstName === "string"
        ? body.firstName.trim()
        : "";

    const lastName =
      typeof body.lastName === "string"
        ? body.lastName.trim()
        : "";

    const qualification =
      typeof body.qualification === "string"
        ? body.qualification.trim()
        : "";

    const department =
      typeof body.department === "string"
        ? body.department.trim()
        : "";

    const phone =
      typeof body.phone === "string"
        ? body.phone.trim()
        : "";

    if (!employeeNumber || !firstName) {
      return NextResponse.json(
        {
          error:
            "Employee number and first name are required.",
        },
        { status: 400 },
      );
    }

    const duplicate = await prisma.teacher.findFirst({
      where: {
        schoolId: result.session.user.schoolId!,
        employeeNumber,
        id: {
          not: result.teacher.id,
        },
      },
    });

    if (duplicate) {
      return NextResponse.json(
        {
          error:
            "A teacher with this employee number already exists.",
        },
        { status: 409 },
      );
    }

    const teacher = await prisma.teacher.update({
      where: {
        id: result.teacher.id,
      },
      data: {
        employeeNumber,
        firstName,
        lastName: lastName || null,
        qualification: qualification || null,
        department: department || null,
        phone: phone || null,
      },
    });

    return NextResponse.json(teacher);
  } catch (error) {
    console.error("UPDATE TEACHER ERROR:", error);

    return NextResponse.json(
      { error: "Unable to update teacher." },
      { status: 500 },
    );
  }
}

export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const result = await getAuthorizedTeacher(id);

    if (result.error) {
      return result.error;
    }

    await prisma.teacher.delete({
      where: {
        id: result.teacher.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE TEACHER ERROR:", error);

    return NextResponse.json(
      { error: "Unable to delete teacher." },
      { status: 500 },
    );
  }
}