"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const initialForm = {
  employeeNumber: "",
  firstName: "",
  lastName: "",
  qualification: "",
  department: "",
  phone: "",
};

export function AddTeacherForm() {
  const router = useRouter();

  const [form, setForm] = useState(initialForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  async function createTeacher(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    if (!form.employeeNumber.trim()) {
      setError("Employee number is required.");
      return;
    }

    if (!form.firstName.trim()) {
      setError("First name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch("/api/admin/teachers", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to create teacher.",
        );
      }

      router.push(`/admin/teachers/${data.id}`);
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create teacher.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Card className="max-w-3xl">
      <CardHeader>
        <CardTitle>Teacher Information</CardTitle>
      </CardHeader>

      <CardContent>
        {error && (
          <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <form
          onSubmit={createTeacher}
          className="space-y-6"
        >
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="employeeNumber">
                Employee Number
              </Label>

              <Input
                id="employeeNumber"
                value={form.employeeNumber}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    employeeNumber: event.target.value,
                  }))
                }
                placeholder="EMP001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="firstName">
                First Name
              </Label>

              <Input
                id="firstName"
                value={form.firstName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    firstName: event.target.value,
                  }))
                }
                placeholder="First name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">
                Last Name
              </Label>

              <Input
                id="lastName"
                value={form.lastName}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    lastName: event.target.value,
                  }))
                }
                placeholder="Last name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="qualification">
                Qualification
              </Label>

              <Input
                id="qualification"
                value={form.qualification}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    qualification: event.target.value,
                  }))
                }
                placeholder="M.A., B.Ed."
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">
                Department
              </Label>

              <Input
                id="department"
                value={form.department}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    department: event.target.value,
                  }))
                }
                placeholder="Science"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">
                Phone
              </Label>

              <Input
                id="phone"
                type="tel"
                value={form.phone}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    phone: event.target.value,
                  }))
                }
                placeholder="Phone number"
              />
            </div>
          </div>

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() =>
                router.push("/admin/teachers")
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
                ? "Adding Teacher..."
                : "Add Teacher"}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}