"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Teacher = {
  id: string;
  employeeNumber: string;
  firstName: string;
  lastName: string | null;
  qualification: string | null;
  department: string | null;
  phone: string | null;
};

type EditTeacherFormProps = {
  teacher: Teacher;
};

export function EditTeacherForm({
  teacher,
}: EditTeacherFormProps) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

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
        employeeNumber: String(
          formData.get("employeeNumber") ?? "",
        ).trim(),

        firstName: String(
          formData.get("firstName") ?? "",
        ).trim(),

        lastName: String(
          formData.get("lastName") ?? "",
        ).trim(),

        qualification: String(
          formData.get("qualification") ?? "",
        ).trim(),

        department: String(
          formData.get("department") ?? "",
        ).trim(),

        phone: String(
          formData.get("phone") ?? "",
        ).trim(),
      };

      const response = await fetch(
        `/api/admin/teachers/${teacher.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        },
      );

      const text = await response.text();

      let data: { error?: string } = {};

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
            "Unable to update teacher.",
        );
      }

      router.push(
        `/admin/teachers/${teacher.id}`,
      );
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update teacher.",
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
          <Label htmlFor="employeeNumber">
            Employee Number
          </Label>

          <Input
            id="employeeNumber"
            name="employeeNumber"
            defaultValue={teacher.employeeNumber}
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
            defaultValue={teacher.firstName}
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
            defaultValue={teacher.lastName ?? ""}
            disabled={saving}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="qualification">
            Qualification
          </Label>

          <Input
            id="qualification"
            name="qualification"
            defaultValue={
              teacher.qualification ?? ""
            }
            placeholder="e.g. M.Sc, B.Ed"
            disabled={saving}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="department">
            Department
          </Label>

          <Input
            id="department"
            name="department"
            defaultValue={
              teacher.department ?? ""
            }
            placeholder="e.g. Mathematics"
            disabled={saving}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">
            Phone
          </Label>

          <Input
            id="phone"
            name="phone"
            type="tel"
            defaultValue={teacher.phone ?? ""}
            disabled={saving}
          />
        </div>
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            router.push(
              `/admin/teachers/${teacher.id}`,
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