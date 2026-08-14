import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (
      !session?.user ||
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!session.user.schoolId) {
      return NextResponse.json(
        { error: "School not found." },
        { status: 400 },
      );
    }

    const { searchParams } =
      new URL(request.url);

    const query =
      searchParams.get("q")?.trim() ?? "";

    const subjects =
      await prisma.subject.findMany({
        where: {
          schoolId: session.user.schoolId,
          ...(query
            ? {
                OR: [
                  {
                    name: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },
                  {
                    code: {
                      contains: query,
                      mode: "insensitive",
                    },
                  },
                ],
              }
            : {}),
        },
        include: {
          classes: {
            include: {
              class: true,
            },
          },
        },
        orderBy: {
          name: "asc",
        },
      });

    return NextResponse.json(subjects);
  } catch (error) {
    console.error(
      "GET SUBJECTS ERROR:",
      error,
    );

    return NextResponse.json(
      { error: "Unable to load subjects." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (
      !session?.user ||
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!session.user.schoolId) {
      return NextResponse.json(
        { error: "School not found." },
        { status: 400 },
      );
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

    const existing =
      await prisma.subject.findFirst({
        where: {
          schoolId: session.user.schoolId,
          name: {
            equals: name,
            mode: "insensitive",
          },
        },
      });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "A subject with this name already exists.",
        },
        { status: 409 },
      );
    }

    const subject =
      await prisma.subject.create({
        data: {
          schoolId: session.user.schoolId,
          name,
          code: code || null,
        },
      });

    return NextResponse.json(
      subject,
      { status: 201 },
    );
  } catch (error) {
    console.error(
      "CREATE SUBJECT ERROR:",
      error,
    );

    return NextResponse.json(
      { error: "Unable to create subject." },
      { status: 500 },
    );
  }
}