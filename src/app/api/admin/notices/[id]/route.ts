import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

async function getAuthorizedNotice(id: string) {
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

  const notice = await prisma.notice.findFirst({
    where: {
      id,
      schoolId: session.user.schoolId,
    },
  });

  if (!notice) {
    return {
      error: NextResponse.json(
        { error: "Notice not found." },
        { status: 404 },
      ),
    };
  }

  return {
    session,
    notice,
  };
}

/* UPDATE NOTICE */
export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const result = await getAuthorizedNotice(id);

    if (result.error) {
      return result.error;
    }

    const body = await request.json();

    const data: {
      title?: string;
      description?: string | null;
      content?: string;
      category?: string;
      published?: boolean;
      publishedAt?: Date | null;
    } = {};

    if (body.title !== undefined) {
      if (
        typeof body.title !== "string" ||
        !body.title.trim()
      ) {
        return NextResponse.json(
          { error: "Notice title is required." },
          { status: 400 },
        );
      }

      data.title = body.title.trim();
    }

    if (body.description !== undefined) {
      data.description =
        typeof body.description === "string"
          ? body.description.trim() || null
          : null;
    }

    if (body.content !== undefined) {
      if (
        typeof body.content !== "string" ||
        !body.content.trim()
      ) {
        return NextResponse.json(
          { error: "Notice content is required." },
          { status: 400 },
        );
      }

      data.content = body.content.trim();
    }

    if (body.category !== undefined) {
      if (
        typeof body.category !== "string" ||
        !body.category.trim()
      ) {
        return NextResponse.json(
          { error: "Notice category is required." },
          { status: 400 },
        );
      }

      data.category = body.category.trim();
    }

    if (body.published !== undefined) {
      if (typeof body.published !== "boolean") {
        return NextResponse.json(
          { error: "Invalid published value." },
          { status: 400 },
        );
      }

      data.published = body.published;

      data.publishedAt = body.published
        ? result.notice.publishedAt ?? new Date()
        : null;
    }

    const notice = await prisma.notice.update({
      where: {
        id: result.notice.id,
      },
      data,
    });

    return NextResponse.json(notice);
  } catch (error) {
    console.error("UPDATE NOTICE ERROR:", error);

    return NextResponse.json(
      { error: "Unable to update notice." },
      { status: 500 },
    );
  }
}

/* DELETE NOTICE */
export async function DELETE(
  _request: Request,
  context: RouteContext,
) {
  try {
    const { id } = await context.params;

    const result = await getAuthorizedNotice(id);

    if (result.error) {
      return result.error;
    }

    await prisma.notice.delete({
      where: {
        id: result.notice.id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("DELETE NOTICE ERROR:", error);

    return NextResponse.json(
      { error: "Unable to delete notice." },
      { status: 500 },
    );
  }
}