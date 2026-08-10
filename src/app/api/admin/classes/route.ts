import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET() {
  try {
    const session = await auth();

    if (
      !session?.user ||
      session.user.role !== "SCHOOL_ADMIN"
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!session.user.schoolId) {
      return NextResponse.json(
        { error: "School not found" },
        { status: 400 },
      );
    }

    const classes = await prisma.class.findMany({
      where: {
        schoolId: session.user.schoolId,
      },
      include: {
        _count: {
          select: {
            students: true,
            teachers: true,
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
          academicYear: "desc",
        },
      ],
    });

    return NextResponse.json(classes);
  } catch (error) {
    console.error("GET CLASSES ERROR:", error);

    return NextResponse.json(
      { error: "Unable to load classes." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (
      !session?.user ||
      session.user.role !== "SCHOOL_ADMIN"
    ) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 },
      );
    }

    if (!session.user.schoolId) {
      return NextResponse.json(
        { error: "School not found" },
        { status: 400 },
      );
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

    const existingClass =
      await prisma.class.findFirst({
        where: {
          schoolId: session.user.schoolId,
          name,
          section,
          academicYear,
        },
      });

    if (existingClass) {
      return NextResponse.json(
        {
          error:
            "This class already exists for this academic year.",
        },
        { status: 409 },
      );
    }

    const schoolClass = await prisma.class.create({
      data: {
        schoolId: session.user.schoolId,
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

    return NextResponse.json(
      schoolClass,
      { status: 201 },
    );
  } catch (error) {
    console.error("CREATE CLASS ERROR:", error);

    return NextResponse.json(
      { error: "Unable to create class." },
      { status: 500 },
    );
  }
}