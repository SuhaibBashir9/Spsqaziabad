"use client";

import { useState } from "react";
import {
  BookOpen,
  Loader2,
  Pencil,
  Plus,
  Trash2,
  Users,
  X,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

type SchoolClass = {
  id: string;
  name: string;
  section: string;
  academicYear: string;
  _count: {
    students: number;
    teachers: number;
  };
};

type ClassForm = {
  name: string;
  section: string;
  academicYear: string;
};

type ClassesManagerProps = {
  initialClasses: SchoolClass[];
};

const initialForm: ClassForm = {
  name: "",
  section: "",
  academicYear: "",
};

export function ClassesManager({
  initialClasses,
}: ClassesManagerProps) {
  const [classes, setClasses] =
    useState<SchoolClass[]>(initialClasses);

  const [form, setForm] =
    useState<ClassForm>(initialForm);

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [saving, setSaving] =
    useState(false);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] =
    useState("");

  function openCreateForm() {
    setEditingId(null);
    setForm(initialForm);
    setError("");
    setShowForm(true);
  }

  function openEditForm(schoolClass: SchoolClass) {
    setEditingId(schoolClass.id);

    setForm({
      name: schoolClass.name,
      section: schoolClass.section,
      academicYear:
        schoolClass.academicYear,
    });

    setError("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) {
      return;
    }

    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
    setError("");
  }

  async function saveClass() {
    if (!form.name.trim()) {
      setError("Please enter a class name.");
      return;
    }

    if (!form.section.trim()) {
      setError("Please enter a section.");
      return;
    }

    if (!form.academicYear.trim()) {
      setError(
        "Please enter the academic year.",
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const url = editingId
        ? `/api/admin/classes/${editingId}`
        : "/api/admin/classes";

      const method = editingId
        ? "PATCH"
        : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const text = await response.text();

      let data: {
        error?: string;
        id?: string;
      } & Partial<SchoolClass> = {};

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
            (editingId
              ? "Unable to update class."
              : "Unable to create class."),
        );
      }

      if (editingId) {
        setClasses((current) =>
          current.map((item) =>
            item.id === editingId
              ? (data as SchoolClass)
              : item,
          ),
        );
      } else {
        setClasses((current) => [
          data as SchoolClass,
          ...current,
        ]);
      }

      closeForm();
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save class.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function deleteClass(
    schoolClass: SchoolClass,
  ) {
    if (schoolClass._count.students > 0) {
      setError(
        "This class has students assigned to it. Reassign those students before deleting the class.",
      );
      return;
    }

    const confirmed = window.confirm(
      `Delete ${schoolClass.name} - ${schoolClass.section}?`,
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeletingId(schoolClass.id);
      setError("");

      const response = await fetch(
        `/api/admin/classes/${schoolClass.id}`,
        {
          method: "DELETE",
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
            "Unable to delete class.",
        );
      }

      setClasses((current) =>
        current.filter(
          (item) =>
            item.id !== schoolClass.id,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete class.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <h2 className="text-lg font-semibold">
            School Classes
          </h2>

          <p className="text-sm text-muted-foreground">
            {classes.length}{" "}
            {classes.length === 1
              ? "class"
              : "classes"}{" "}
            created.
          </p>
        </div>

        <Button
          onClick={openCreateForm}
        >
          <Plus className="mr-2 size-4" />
          Add Class
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {editingId
                ? "Edit Class"
                : "Create Class"}
            </CardTitle>

            <Button
              variant="ghost"
              size="icon"
              onClick={closeForm}
              disabled={saving}
            >
              <X />
            </Button>
          </CardHeader>

          <CardContent className="space-y-5">
            <div className="grid gap-5 sm:grid-cols-3">
              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Class Name
                </label>

                <Input
                  value={form.name}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      name: event.target.value,
                    }))
                  }
                  placeholder="e.g. 10th"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Section
                </label>

                <Input
                  value={form.section}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      section:
                        event.target.value,
                    }))
                  }
                  placeholder="e.g. A"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">
                  Academic Year
                </label>

                <Input
                  value={form.academicYear}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      academicYear:
                        event.target.value,
                    }))
                  }
                  placeholder="e.g. 2026-27"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button
                onClick={saveClass}
                disabled={saving}
              >
                {saving && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}

                {saving
                  ? "Saving..."
                  : editingId
                    ? "Save Changes"
                    : "Create Class"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            Classes ({classes.length})
          </CardTitle>
        </CardHeader>

        <CardContent>
          {classes.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <BookOpen className="mx-auto size-10 text-muted-foreground" />

              <p className="mt-4 font-medium">
                No classes yet
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                Create your first class to start
                assigning students.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {classes.map((schoolClass) => (
                <div
                  key={schoolClass.id}
                  className="flex flex-col gap-4 rounded-xl border p-4 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-semibold">
                        {schoolClass.name} -{" "}
                        {schoolClass.section}
                      </h3>

                      <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium">
                        {schoolClass.academicYear}
                      </span>
                    </div>

                    <div className="mt-2 flex flex-wrap gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1.5">
                        <Users className="size-4" />
                        {schoolClass._count.students}{" "}
                        {schoolClass._count.students ===
                        1
                          ? "student"
                          : "students"}
                      </span>

                      <span>
                        {schoolClass._count.teachers}{" "}
                        {schoolClass._count.teachers ===
                        1
                          ? "teacher"
                          : "teachers"}
                      </span>
                    </div>
                  </div>

                  <div className="flex shrink-0 gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() =>
                        openEditForm(
                          schoolClass,
                        )
                      }
                    >
                      <Pencil className="mr-2 size-4" />
                      Edit
                    </Button>

                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() =>
                        deleteClass(
                          schoolClass,
                        )
                      }
                      disabled={
                        deletingId ===
                        schoolClass.id
                      }
                    >
                      {deletingId ===
                      schoolClass.id ? (
                        <Loader2 className="mr-2 size-4 animate-spin" />
                      ) : (
                        <Trash2 className="mr-2 size-4" />
                      )}

                      Delete
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}