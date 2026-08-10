"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Plus,
  Trash2,
} from "lucide-react";

import { Button } from "@/components/ui/button";

type SchoolClass = {
  id: string;
  name: string;
  section: string;
  academicYear: string;
  subjects: {
    subjectId: string;
  }[];
};

type SubjectClassManagerProps = {
  subjectId: string;
};

export function SubjectClassManager({
  subjectId,
}: SubjectClassManagerProps) {
  const [classes, setClasses] =
    useState<SchoolClass[]>([]);

  const [assignedIds, setAssignedIds] =
    useState<string[]>([]);

  const [selectedClassId, setSelectedClassId] =
    useState("");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [removingId, setRemovingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  async function loadClasses() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        `/api/admin/subjects/${subjectId}/classes`,
      );

      const text =
        await response.text();

      let data: SchoolClass[] = [];

      if (text) {
        data = JSON.parse(text);
      }

      if (!response.ok) {
        throw new Error(
          "Unable to load classes.",
        );
      }

      setClasses(data);

      setAssignedIds(
        data
          .filter(
            (item) =>
              item.subjects.length > 0,
          )
          .map((item) => item.id),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load classes.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadClasses();
  }, [subjectId]);

  async function assignClass() {
    if (!selectedClassId) {
      return;
    }

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `/api/admin/subjects/${subjectId}/classes`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            classId: selectedClassId,
          }),
        },
      );

      const text =
        await response.text();

      let data: {
        error?: string;
      } = {};

      if (text) {
        data = JSON.parse(text);
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to assign class.",
        );
      }

      setAssignedIds((current) => [
        ...current,
        selectedClassId,
      ]);

      setSelectedClassId("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to assign class.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function removeClass(
    classId: string,
  ) {
    const schoolClass = classes.find(
      (item) => item.id === classId,
    );

    const confirmed = window.confirm(
      `Remove ${schoolClass?.name ?? "this class"} from this subject?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setRemovingId(classId);
      setError("");

      const response = await fetch(
        `/api/admin/subjects/${subjectId}/classes`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            classId,
          }),
        },
      );

      const text =
        await response.text();

      let data: {
        error?: string;
      } = {};

      if (text) {
        data = JSON.parse(text);
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to remove class.",
        );
      }

      setAssignedIds((current) =>
        current.filter(
          (id) => id !== classId,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to remove class.",
      );
    } finally {
      setRemovingId(null);
    }
  }

  const availableClasses =
    classes.filter(
      (item) =>
        !assignedIds.includes(item.id),
    );

  return (
    <div className="space-y-5">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col gap-3 sm:flex-row">
        <select
          value={selectedClassId}
          onChange={(event) =>
            setSelectedClassId(
              event.target.value,
            )
          }
          disabled={
            loading ||
            saving ||
            availableClasses.length === 0
          }
          className="h-10 flex-1 rounded-md border border-input bg-background px-3 text-sm"
        >
          <option value="">
            {availableClasses.length === 0
              ? "All classes assigned"
              : "Select a class"}
          </option>

          {availableClasses.map(
            (schoolClass) => (
              <option
                key={schoolClass.id}
                value={schoolClass.id}
              >
                {schoolClass.name} -{" "}
                {schoolClass.section} (
                {schoolClass.academicYear})
              </option>
            ),
          )}
        </select>

        <Button
          onClick={assignClass}
          disabled={
            saving || !selectedClassId
          }
        >
          {saving ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Plus className="mr-2 size-4" />
          )}

          Assign Class
        </Button>
      </div>

      {loading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="size-6 animate-spin" />
        </div>
      ) : assignedIds.length === 0 ? (
        <div className="rounded-lg border border-dashed p-8 text-center">
          <p className="font-medium">
            No classes assigned
          </p>

          <p className="mt-1 text-sm text-muted-foreground">
            Assign this subject to a class above.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {classes
            .filter((item) =>
              assignedIds.includes(
                item.id,
              ),
            )
            .map((schoolClass) => (
              <div
                key={schoolClass.id}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div>
                  <p className="font-medium">
                    {schoolClass.name} -{" "}
                    {schoolClass.section}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {schoolClass.academicYear}
                  </p>
                </div>

                <Button
                  variant="destructive"
                  size="sm"
                  onClick={() =>
                    removeClass(
                      schoolClass.id,
                    )
                  }
                  disabled={
                    removingId ===
                    schoolClass.id
                  }
                >
                  {removingId ===
                  schoolClass.id ? (
                    <Loader2 className="size-4 animate-spin" />
                  ) : (
                    <Trash2 className="size-4" />
                  )}
                </Button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}