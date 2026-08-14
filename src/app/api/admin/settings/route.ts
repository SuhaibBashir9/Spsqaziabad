import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";

async function getAuthorizedAdmin() {
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
        { error: "School not found." },
        { status: 400 },
      ),
    };
  }

  return {
    session,
    schoolId: session.user.schoolId,
  };
}

export async function GET() {
  try {
    const result = await getAuthorizedAdmin();

    if (result.error) {
      return result.error;
    }

    const [school, user] = await Promise.all([
      prisma.school.findUnique({
        where: {
          id: result.schoolId,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          email: true,
          phone: true,
          address: true,
          city: true,
          state: true,
          country: true,
          logoUrl: true,
          website: true,
        },
      }),

      prisma.user.findUnique({
        where: {
          id: result.session.user.id,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      }),
    ]);

    if (!school) {
      return NextResponse.json(
        { error: "School not found." },
        { status: 404 },
      );
    }

    return NextResponse.json({
      school,
      user,
    });
  } catch (error) {
    console.error("GET SETTINGS ERROR:", error);

    return NextResponse.json(
      { error: "Unable to load settings." },
      { status: 500 },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const result = await getAuthorizedAdmin();

    if (result.error) {
      return result.error;
    }

    const body = await request.json();

    const section =
      typeof body.section === "string"
        ? body.section
        : "";

    /*
     * SCHOOL SETTINGS
     */
    if (section === "school") {
      const name =
        typeof body.name === "string"
          ? body.name.trim()
          : "";

      const email =
        typeof body.email === "string"
          ? body.email.trim()
          : "";

      const phone =
        typeof body.phone === "string"
          ? body.phone.trim()
          : "";

      const address =
        typeof body.address === "string"
          ? body.address.trim()
          : "";

      const city =
        typeof body.city === "string"
          ? body.city.trim()
          : "";

      const state =
        typeof body.state === "string"
          ? body.state.trim()
          : "";

      const country =
        typeof body.country === "string"
          ? body.country.trim()
          : "";

      const website =
        typeof body.website === "string"
          ? body.website.trim()
          : "";

      const logoUrl =
        typeof body.logoUrl === "string"
          ? body.logoUrl.trim()
          : "";

      if (!name) {
        return NextResponse.json(
          {
            error: "School name is required.",
          },
          { status: 400 },
        );
      }

      const school = await prisma.school.update({
        where: {
          id: result.schoolId,
        },
        data: {
          name,
          email: email || null,
          phone: phone || null,
          address: address || null,
          city: city || null,
          state: state || null,
          country: country || "India",
          website: website || null,
          logoUrl: logoUrl || null,
        },
        select: {
          id: true,
          name: true,
          slug: true,
          email: true,
          phone: true,
          address: true,
          city: true,
          state: true,
          country: true,
          logoUrl: true,
          website: true,
        },
      });

      return NextResponse.json({
        school,
      });
    }

    /*
     * ADMIN ACCOUNT
     */
    if (section === "account") {
      const name =
        typeof body.name === "string"
          ? body.name.trim()
          : "";

      if (!name) {
        return NextResponse.json(
          {
            error: "Administrator name is required.",
          },
          { status: 400 },
        );
      }

      const user = await prisma.user.update({
        where: {
          id: result.session.user.id,
        },
        data: {
          name,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      });

      return NextResponse.json({
        user,
      });
    }

    /*
     * CHANGE PASSWORD
     */
    if (section === "password") {
      const currentPassword =
        typeof body.currentPassword === "string"
          ? body.currentPassword
          : "";

      const newPassword =
        typeof body.newPassword === "string"
          ? body.newPassword
          : "";

      if (!currentPassword) {
        return NextResponse.json(
          {
            error:
              "Current password is required.",
          },
          { status: 400 },
        );
      }

      if (newPassword.length < 8) {
        return NextResponse.json(
          {
            error:
              "New password must be at least 8 characters.",
          },
          { status: 400 },
        );
      }

      const user = await prisma.user.findUnique({
        where: {
          id: result.session.user.id,
        },
        select: {
          id: true,
          passwordHash: true,
        },
      });

      if (!user) {
        return NextResponse.json(
          {
            error: "Administrator account not found.",
          },
          { status: 404 },
        );
      }

      const passwordValid =
        await bcrypt.compare(
          currentPassword,
          user.passwordHash,
        );

      if (!passwordValid) {
        return NextResponse.json(
          {
            error:
              "Current password is incorrect.",
          },
          { status: 400 },
        );
      }

      const newPasswordHash =
        await bcrypt.hash(newPassword, 12);

      await prisma.user.update({
        where: {
          id: user.id,
        },
        data: {
          passwordHash: newPasswordHash,
        },
      });

      return NextResponse.json({
        success: true,
      });
    }

    return NextResponse.json(
      {
        error: "Invalid settings section.",
      },
      { status: 400 },
    );
  } catch (error) {
    console.error(
      "UPDATE SETTINGS ERROR:",
      error,
    );

    return NextResponse.json(
      {
        error: "Unable to update settings.",
      },
      { status: 500 },
    );
  }
}