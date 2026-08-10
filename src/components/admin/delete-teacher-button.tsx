"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type DeleteTeacherButtonProps = {
  teacherId: string;
  teacherName: string;
};

export function DeleteTeacherButton({
  teacherId,
  teacherName,
}: DeleteTeacherButtonProps) {
  const router = useRouter();

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete ${teacherName} permanently? This action cannot be undone.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `/api/admin/teachers/${teacherId}`,
        {
          method: "DELETE",
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
            "Unable to delete teacher.",
        );
      }

      router.push("/admin/teachers");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete teacher.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="space-y-2">
      {error && (
        <p className="text-sm text-red-600">
          {error}
        </p>
      )}

      <Button
        variant="destructive"
        onClick={handleDelete}
        disabled={deleting}
      >
        {deleting ? (
          <Loader2 className="mr-2 size-4 animate-spin" />
        ) : (
          <Trash2 className="mr-2 size-4" />
        )}

        {deleting
          ? "Deleting..."
          : "Delete Teacher"}
      </Button>
    </div>
  );
}