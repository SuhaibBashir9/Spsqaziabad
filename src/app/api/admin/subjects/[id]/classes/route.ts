import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function authorize(
  subjectId: string,
) {
  const session = await auth();

  if (
    !session?.user ||
    session.user.role !== "ADMIN"
  ) {
    return {
      error: NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      ),
    };
  }

  if (!session.user.schoolId) {
    return {
      error: NextResponse.json(
        { error: "School not found." },
        { status: 400 },
      ),
    };
  }

  const subject =
    await prisma.subject.findFirst({
      where: {
        id: subjectId,
        schoolId: session.user.schoolId,
      },
    });

  if (!subject) {
    return {
      error: NextResponse.json(
        { error: "Subject not found." },
        { status: 404 },
      ),
    };
  }

  return {
    session,
    subject,
  };
}

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const result = await authorize(id);

    if (result.error) {
      return result.error;
    }

    const classes =
      await prisma.class.findMany({
        where: {
          schoolId: result.session.user.schoolId!,
        },
        include: {
          subjects: {
            where: {
              subjectId: result.subject.id,
            },
          },
        },
        orderBy: [
          {
            name: "asc",
          },
          {
            section: "asc",
          },
          {
            academicYear: "asc",
          },
        ],
      });

    return NextResponse.json(classes);
  } catch (error) {
    console.error(
      "GET SUBJECT CLASSES ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to load class assignments.",
      },
      { status: 500 },
    );
  }
}

export async function POST(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const result = await authorize(id);

    if (result.error) {
      return result.error;
    }

    const body = await request.json();

    const classId =
      typeof body.classId === "string"
        ? body.classId.trim()
        : "";

    if (!classId) {
      return NextResponse.json(
        {
          error: "Class is required.",
        },
        { status: 400 },
      );
    }

    const schoolClass =
      await prisma.class.findFirst({
        where: {
          id: classId,
          schoolId:
            result.session.user.schoolId!,
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

    const existing =
      await prisma.classSubject.findUnique({
        where: {
          classId_subjectId: {
            classId,
            subjectId: result.subject.id,
          },
        },
      });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "This subject is already assigned to the class.",
        },
        { status: 409 },
      );
    }

    const assignment =
      await prisma.classSubject.create({
        data: {
          classId,
          subjectId: result.subject.id,
        },
        include: {
          class: true,
          subject: true,
        },
      });

    return NextResponse.json(
      assignment,
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "ASSIGN SUBJECT ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to assign subject to class.",
      },
      { status: 500 },
    );
  }
}

export async function DELETE(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const result = await authorize(id);

    if (result.error) {
      return result.error;
    }

    const body = await request.json();

    const classId =
      typeof body.classId === "string"
        ? body.classId.trim()
        : "";

    if (!classId) {
      return NextResponse.json(
        {
          error: "Class is required.",
        },
        { status: 400 },
      );
    }

    const schoolClass =
      await prisma.class.findFirst({
        where: {
          id: classId,
          schoolId:
            result.session.user.schoolId!,
        },
      });

    if (!schoolClass) {
      return NextResponse.json(
        {
          error: "Class not found.",
        },
        { status: 404 },
      );
    }

    await prisma.classSubject.delete({
      where: {
        classId_subjectId: {
          classId,
          subjectId: result.subject.id,
        },
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "REMOVE SUBJECT ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error:
          "Unable to remove subject from class.",
      },
      { status: 500 },
    );
  }
}