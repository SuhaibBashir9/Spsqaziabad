"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type SchoolClass = {
  id: string;
  name: string;
  section: string;
  academicYear: string;
};

type Student = {
  id: string;
  admissionNumber: string;
  firstName: string;
  lastName: string | null;
  dateOfBirth: Date | string | null;
  gender: string | null;
  phone: string | null;
  address: string | null;
  classId: string | null;
};

type EditStudentFormProps = {
  student: Student;
  classes: SchoolClass[];
};

export function EditStudentForm({
  student,
  classes,
}: EditStudentFormProps) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const dateValue = student.dateOfBirth
    ? new Date(student.dateOfBirth)
        .toISOString()
        .split("T")[0]
    : "";

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const formData = new FormData(
        event.currentTarget,
      );

      const body = {
        admissionNumber: String(
          formData.get("admissionNumber") ?? "",
        ).trim(),

        firstName: String(
          formData.get("firstName") ?? "",
        ).trim(),

        lastName: String(
          formData.get("lastName") ?? "",
        ).trim(),

        dateOfBirth: String(
          formData.get("dateOfBirth") ?? "",
        ).trim(),

        gender: String(
          formData.get("gender") ?? "",
        ).trim(),

        phone: String(
          formData.get("phone") ?? "",
        ).trim(),

        address: String(
          formData.get("address") ?? "",
        ).trim(),

        classId: String(
          formData.get("classId") ?? "",
        ).trim(),
      };

      const response = await fetch(
        `/api/admin/students/${student.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      const text = await response.text();

      let data: {
        error?: string;
      } = {};

      if (text) {
        try {
          data = JSON.parse(text);
        } catch {
          throw new Error(
            "The server returned an invalid response.",
          );
        }
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to update student.",
        );
      }

      router.push(
        `/admin/students/${student.id}`,
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update student.",
      );

      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-6"
    >
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="grid gap-6 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="admissionNumber">
            Admission Number
          </Label>

          <Input
            id="admissionNumber"
            name="admissionNumber"
            defaultValue={student.admissionNumber}
            required
            disabled={saving}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="firstName">
            First Name
          </Label>

          <Input
            id="firstName"
            name="firstName"
            defaultValue={student.firstName}
            required
            disabled={saving}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="lastName">
            Last Name
          </Label>

          <Input
            id="lastName"
            name="lastName"
            defaultValue={student.lastName ?? ""}
            disabled={saving}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">
            Date of Birth
          </Label>

          <Input
            id="dateOfBirth"
            name="dateOfBirth"
            type="date"
            defaultValue={dateValue}
            disabled={saving}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="gender">
            Gender
          </Label>

          <select
            id="gender"
            name="gender"
            defaultValue={student.gender ?? ""}
            disabled={saving}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          >
            <option value="">
              Select gender
            </option>

            <option value="Male">
              Male
            </option>

            <option value="Female">
              Female
            </option>

            <option value="Other">
              Other
            </option>
          </select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone
          </Label>

          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={student.phone ?? ""}
            disabled={saving}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="address">
          Address
        </Label>

        <textarea
          id="address"
          name="address"
          defaultValue={student.address ?? ""}
          rows={4}
          disabled={saving}
          className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="classId">
          Class
        </Label>

        <select
          id="classId"
          name="classId"
          defaultValue={student.classId ?? ""}
          disabled={saving}
          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        >
          <option value="">
            Not assigned
          </option>

          {classes.map((schoolClass) => (
            <option
              key={schoolClass.id}
              value={schoolClass.id}
            >
              {schoolClass.name} -{" "}
              {schoolClass.section} (
              {schoolClass.academicYear})
            </option>
          ))}
        </select>

        {classes.length === 0 && (
          <p className="text-xs text-muted-foreground">
            No classes have been created yet.
            Create a class first from Classes.
          </p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            router.push(
              `/admin/students/${student.id}`,
            )
          }
          disabled={saving}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          disabled={saving}
        >
          {saving && (
            <Loader2 className="mr-2 size-4 animate-spin" />
          )}

          {saving
            ? "Saving..."
            : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}