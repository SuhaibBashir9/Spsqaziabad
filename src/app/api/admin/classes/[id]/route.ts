import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function getAuthorizedClass(id: string) {
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

  const schoolClass =
    await prisma.class.findFirst({
      where: {
        id,
        schoolId: session.user.schoolId,
      },
    });

  if (!schoolClass) {
    return {
      error: NextResponse.json(
        { error: "Class not found." },
        { status: 404 },
      ),
    };
  }

  return {
    session,
    schoolClass,
  };
}

/* UPDATE CLASS */
export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const result =
      await getAuthorizedClass(id);

    if (result.error) {
      return result.error;
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const section =
      typeof body.section === "string"
        ? body.section.trim()
        : "";

    const academicYear =
      typeof body.academicYear === "string"
        ? body.academicYear.trim()
        : "";

    if (!name || !section || !academicYear) {
      return NextResponse.json(
        {
          error:
            "Class name, section, and academic year are required.",
        },
        { status: 400 },
      );
    }

    const duplicate =
      await prisma.class.findFirst({
        where: {
          schoolId:
            result.schoolClass.schoolId,
          name,
          section,
          academicYear,
          id: {
            not: result.schoolClass.id,
          },
        },
      });

    if (duplicate) {
      return NextResponse.json(
        {
          error:
            "This class already exists for this academic year.",
        },
        { status: 409 },
      );
    }

    const schoolClass =
      await prisma.class.update({
        where: {
          id: result.schoolClass.id,
        },
        data: {
          name,
          section,
          academicYear,
        },
        include: {
          _count: {
            select: {
              students: true,
              teachers: true,
            },
          },
        },
      });

    return NextResponse.json(schoolClass);
  } catch (error) {
    console.error("UPDATE CLASS ERROR:", error);

    return NextResponse.json(
      { error: "Unable to update class." },
      { status: 500 },
    );
  }
}

/* DELETE CLASS */
export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const result =
      await getAuthorizedClass(id);

    if (result.error) {
      return result.error;
    }

    const studentCount =
      await prisma.student.count({
        where: {
          classId: result.schoolClass.id,
        },
      });

    if (studentCount > 0) {
      return NextResponse.json(
        {
          error:
            "This class cannot be deleted because students are assigned to it. Reassign the students first.",
        },
        { status: 409 },
      );
    }

    await prisma.class.delete({
      where: {
        id: result.schoolClass.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE CLASS ERROR:", error);

    return NextResponse.json(
      { error: "Unable to delete class." },
      { status: 500 },
    );
  }
}