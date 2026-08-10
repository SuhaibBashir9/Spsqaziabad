"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Loader2,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type DeleteSubjectButtonProps = {
  subjectId: string;
  subjectName: string;
};

export function DeleteSubjectButton({
  subjectId,
  subjectName,
}: DeleteSubjectButtonProps) {
  const router = useRouter();

  const [deleting, setDeleting] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleDelete() {
    const confirmed = window.confirm(
      `Delete ${subjectName} permanently? Any class assignments for this subject will also be removed.`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");

      const response = await fetch(
        `/api/admin/subjects/${subjectId}`,
        {
          method: "DELETE",
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
            "Unable to delete subject.",
        );
      }

      router.push("/admin/subjects");
      router.refresh();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete subject.",
      );
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div>
      {error && (
        <p className="mb-2 text-sm text-red-600">
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
          : "Delete Subject"}
      </Button>
    </div>
  );
}