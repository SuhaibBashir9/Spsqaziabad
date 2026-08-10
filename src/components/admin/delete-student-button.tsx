"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";

type DeleteStudentButtonProps = {
  studentId: string;
};

export function DeleteStudentButton({
  studentId,
}: DeleteStudentButtonProps) {
  const router = useRouter();
  const [deleting, setDeleting] = useState(false);

  async function deleteStudent() {
    const confirmed = window.confirm(
      "Delete this student permanently? This action cannot be undone.",
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);

      const response = await fetch(
        `/api/admin/students/${studentId}`,
        {
          method: "DELETE",
        },
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Unable to delete student.",
        );
      }

      router.push("/admin/students");
      router.refresh();
    } catch (error) {
      window.alert(
        error instanceof Error
          ? error.message
          : "Unable to delete student.",
      );

      setDeleting(false);
    }
  }

  return (
    <Button
      variant="destructive"
      onClick={deleteStudent}
      disabled={deleting}
    >
      {deleting ? (
        <Loader2 className="mr-2 size-4 animate-spin" />
      ) : (
        <Trash2 className="mr-2 size-4" />
      )}

      {deleting ? "Deleting..." : "Delete Student"}
    </Button>
  );
}