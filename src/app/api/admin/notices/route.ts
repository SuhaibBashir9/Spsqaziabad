import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  if (!session.user.schoolId) {
    return NextResponse.json(
      { error: "School not found" },
      { status: 400 },
    );
  }

  const notices = await prisma.notice.findMany({
    where: {
      schoolId: session.user.schoolId,
    },
    orderBy: [
      { publishedAt: "desc" },
      { createdAt: "desc" },
    ],
  });

  return NextResponse.json(notices);
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  if (session.user.role !== "ADMIN") {
    return NextResponse.json(
      { error: "Forbidden" },
      { status: 403 },
    );
  }

  if (!session.user.schoolId) {
    return NextResponse.json(
      { error: "School not found" },
      { status: 400 },
    );
  }

  try {
    const body = await request.json();

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : null;

    const content =
      typeof body.content === "string"
        ? body.content.trim()
        : "";

    const category =
      typeof body.category === "string" &&
      body.category.trim()
        ? body.category.trim()
        : "General";

    const attachmentUrl =
      typeof body.attachmentUrl === "string" &&
      body.attachmentUrl.trim()
        ? body.attachmentUrl.trim()
        : null;

    const published = body.published === true;

    if (!title || !content) {
      return NextResponse.json(
        {
          error: "Title and content are required.",
        },
        { status: 400 },
      );
    }

    const notice = await prisma.notice.create({
      data: {
        schoolId: session.user.schoolId,
        title,
        description,
        content,
        category,
        attachmentUrl,
        published,
        publishedAt: published ? new Date() : null,
      },
    });

    return NextResponse.json(notice, {
      status: 201,
    });
  } catch (error) {
    console.error("Create notice error:", error);

    return NextResponse.json(
      {
        error: "Unable to create notice.",
      },
      { status: 500 },
    );
  }
}