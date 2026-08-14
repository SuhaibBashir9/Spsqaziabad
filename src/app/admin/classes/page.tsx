"use client";

import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

import { ClassesManager } from "@/components/admin/classes-manager";

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

export default function ClassesPage() {
  const [classes, setClasses] = useState<SchoolClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadClasses() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(
          "/api/admin/classes",
        );

        const text = await response.text();

        let data: SchoolClass[] | { error?: string } =
          [];

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
            !Array.isArray(data)
              ? data.error ||
                  "Unable to load classes."
              : "Unable to load classes.",
          );
        }

        setClasses(
          Array.isArray(data) ? data : [],
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

    loadClasses();
  }, []);

  if (loading) {
    return (
      <main className="flex-1 p-6 md:p-8">
        <div className="flex min-h-[300px] items-center justify-center">
          <Loader2 className="size-6 animate-spin" />
        </div>
      </main>
    );
  }

  if (error) {
    return (
      <main className="flex-1 space-y-6 p-6 md:p-8">
        <div>
          <p className="text-sm font-medium text-muted-foreground">
            School Management
          </p>

          <h1 className="mt-1 text-3xl font-semibold tracking-tight">
            Classes
          </h1>
        </div>

        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 space-y-6 p-6 md:p-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          School Management
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Classes
        </h1>

        <p className="mt-1 text-muted-foreground">
          Create and manage your school&apos;s classes.
        </p>
      </div>

      <ClassesManager
        initialClasses={classes}
      />
    </main>
  );
}