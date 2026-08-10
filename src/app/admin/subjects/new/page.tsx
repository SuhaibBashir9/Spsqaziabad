"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function NewSubjectPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");

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
        "/api/admin/subjects",
        {
          method: "POST",
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
        id?: string;
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
            "Unable to create subject.",
        );
      }

      router.push(
        `/admin/subjects/${data.id}`,
      );

      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to create subject.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <main className="flex-1 space-y-6 p-6 md:p-8">
      <div>
        <Link
          href="/admin/subjects"
          className="mb-3 inline-flex h-9 items-center rounded-md px-4 text-sm font-medium hover:bg-muted"
        >
          ← Back to Subjects
        </Link>

        <p className="text-sm text-muted-foreground">
          School Management
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Add Subject
        </h1>

        <p className="mt-1 text-muted-foreground">
          Create a new subject for your school.
        </p>
      </div>

      <Card className="max-w-2xl">
        <CardHeader>
          <CardTitle>
            Subject Information
          </CardTitle>
        </CardHeader>

        <CardContent>
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
                placeholder="e.g. Mathematics"
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
                placeholder="e.g. MATH101"
              />
            </div>

            <div className="flex justify-end gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  router.push(
                    "/admin/subjects",
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
                  ? "Creating..."
                  : "Create Subject"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </main>
  );
}