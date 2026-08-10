import { NextResponse } from "next/server";

import { prisma } from "@/lib/db/prisma";

export async function POST(request: Request) {
    try {
        const formData = await request.formData();

        const studentName = String(
            formData.get("studentName") ?? "",
        ).trim();

        const parentName = String(
            formData.get("parentName") ?? "",
        ).trim();

        const phone = String(
            formData.get("phone") ?? "",
        ).trim();

        const emailValue = String(
            formData.get("email") ?? "",
        ).trim();

        const className = String(
            formData.get("className") ?? "",
        ).trim();

        const messageValue = String(
            formData.get("message") ?? "",
        ).trim();

        if (
            !studentName ||
            !parentName ||
            !phone ||
            !className
        ) {
            return NextResponse.json(
                {
                    error: "Please fill in all required fields.",
                },
                { status: 400 },
            );
        }

        // Exactly 10 digits.
        if (!/^\d{10}$/.test(phone)) {
            return NextResponse.json(
                {
                    error:
                        "Please enter a valid 10-digit phone number.",
                },
                { status: 400 },
            );
        }

        const school = await prisma.school.findUnique({
            where: {
                slug: "sps-qaziabad",
            },
            select: {
                id: true,
            },
        });

        if (!school) {
            return NextResponse.json(
                {
                    error: "School not found.",
                },
                { status: 404 },
            );
        }

        // One enquiry per phone number for this school.
        const existingEnquiry =
            await prisma.admissionEnquiry.findUnique({
                where: {
                    schoolId_phone: {
                        schoolId: school.id,
                        phone,
                    },
                },
                select: {
                    id: true,
                },
            });

        if (existingEnquiry) {
            return NextResponse.json(
                {
                    error:
                        "An admission enquiry with this phone number already exists.",
                },
                { status: 409 },
            );
        }

        await prisma.admissionEnquiry.create({
            data: {
                schoolId: school.id,
                studentName,
                parentName,
                phone,
                email: emailValue || null,
                className,
                message: messageValue || null,
            },
        });

        return NextResponse.json(
            {
                success: true,
            },
            { status: 201 },
        );
    } catch (error) {
        console.error(
            "Admission enquiry error:",
            error,
        );

        return NextResponse.json(
            {
                error:
                    "Unable to submit enquiry. Please try again.",
            },
            { status: 500 },
        );
    }
}