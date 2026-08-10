"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type EditSubjectFormProps = {
  subject: {
    id: string;
    name: string;
    code: string | null;
  };
};

export function EditSubjectForm({
  subject,
}: EditSubjectFormProps) {
  const router = useRouter();

  const [name, setName] =
    useState(subject.name);

  const [code, setCode] =
    useState(subject.code ?? "");

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `/api/admin/subjects/${subject.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            code,
          }),
        },
      );

      const text =
        await response.text();

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
            "Unable to update subject.",
        );
      }

      router.push(
        `/admin/subjects/${subject.id}`,
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to update subject.",
      );
    } finally {
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

      <div className="space-y-2">
        <Label htmlFor="name">
          Subject Name
        </Label>

        <Input
          id="name"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="code">
          Subject Code
        </Label>

        <Input
          id="code"
          value={code}
          onChange={(event) =>
            setCode(event.target.value)
          }
        />
      </div>

      <div className="flex justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={() =>
            router.push(
              `/admin/subjects/${subject.id}`,
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
          {saving
            ? "Saving..."
            : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}