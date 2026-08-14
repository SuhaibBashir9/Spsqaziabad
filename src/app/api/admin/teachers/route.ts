import { NextResponse } from "next/server";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

export async function GET(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
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

    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q")?.trim() ?? "";

    const teachers = await prisma.teacher.findMany({
      where: {
        schoolId: session.user.schoolId,
        ...(query
          ? {
              OR: [
                {
                  employeeNumber: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  firstName: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  lastName: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
                {
                  department: {
                    contains: query,
                    mode: "insensitive",
                  },
                },
              ],
            }
          : {}),
      },
      orderBy: [
        {
          firstName: "asc",
        },
        {
          lastName: "asc",
        },
      ],
    });

    return NextResponse.json(teachers);
  } catch (error) {
    console.error("GET TEACHERS ERROR:", error);

    return NextResponse.json(
      { error: "Unable to load teachers." },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const session = await auth();

    if (!session?.user || session.user.role !== "ADMIN") {
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

    const schoolId = session.user.schoolId;
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

    const existingTeacher = await prisma.teacher.findFirst({
      where: {
        schoolId,
        employeeNumber,
      },
    });

    if (existingTeacher) {
      return NextResponse.json(
        {
          error:
            "A teacher with this employee number already exists.",
        },
        { status: 409 },
      );
    }

    const teacher = await prisma.teacher.create({
      data: {
        schoolId,
        employeeNumber,
        firstName,
        lastName: lastName || null,
        qualification: qualification || null,
        department: department || null,
        phone: phone || null,
      },
    });

    return NextResponse.json(teacher, { status: 201 });
  } catch (error) {
    console.error("CREATE TEACHER ERROR:", error);

    return NextResponse.json(
      { error: "Unable to create teacher." },
      { status: 500 },
    );
  }
}
