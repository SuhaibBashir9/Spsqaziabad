import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function getAuthorizedSubject(
  id: string,
) {
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
        { error: "School not found." },
        { status: 400 },
      ),
    };
  }

  const subject =
    await prisma.subject.findFirst({
      where: {
        id,
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

    const result =
      await getAuthorizedSubject(id);

    if (result.error) {
      return result.error;
    }

    const subject =
      await prisma.subject.findUnique({
        where: {
          id: result.subject.id,
        },
        include: {
          classes: {
            include: {
              class: true,
            },
            orderBy: {
              class: {
                name: "asc",
              },
            },
          },
        },
      });

    return NextResponse.json(subject);
  } catch (error) {
    console.error(
      "GET SUBJECT ERROR:",
      error,
    );

    return NextResponse.json(
      { error: "Unable to load subject." },
      { status: 500 },
    );
  }
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const result =
      await getAuthorizedSubject(id);

    if (result.error) {
      return result.error;
    }

    const body = await request.json();

    const name =
      typeof body.name === "string"
        ? body.name.trim()
        : "";

    const code =
      typeof body.code === "string"
        ? body.code.trim()
        : "";

    if (!name) {
      return NextResponse.json(
        {
          error:
            "Subject name is required.",
        },
        { status: 400 },
      );
    }

    const duplicate =
      await prisma.subject.findFirst({
        where: {
          schoolId:
            result.session.user.schoolId!,
          name: {
            equals: name,
            mode: "insensitive",
          },
          id: {
            not: result.subject.id,
          },
        },
      });

    if (duplicate) {
      return NextResponse.json(
        {
          error:
            "A subject with this name already exists.",
        },
        { status: 409 },
      );
    }

    const subject =
      await prisma.subject.update({
        where: {
          id: result.subject.id,
        },
        data: {
          name,
          code: code || null,
        },
      });

    return NextResponse.json(subject);
  } catch (error) {
    console.error(
      "UPDATE SUBJECT ERROR:",
      error,
    );

    return NextResponse.json(
      { error: "Unable to update subject." },
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

    const result =
      await getAuthorizedSubject(id);

    if (result.error) {
      return result.error;
    }

    await prisma.subject.delete({
      where: {
        id: result.subject.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error(
      "DELETE SUBJECT ERROR:",
      error,
    );

    return NextResponse.json(
      { error: "Unable to delete subject." },
      { status: 500 },
    );
  }
}