"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Bell,
  Eye,
  EyeOff,
  Loader2,
  Pencil,
  Plus,
  Search,
  Trash2,
  X,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type Notice = {
  id: string;
  title: string;
  description: string | null;
  content: string;
  category: string;
  attachmentUrl: string | null;
  published: boolean;
  publishedAt: string | null;
  createdAt: string;
  updatedAt: string;
};

type NoticeForm = {
  title: string;
  description: string;
  content: string;
  category: string;
  published: boolean;
};

const initialForm: NoticeForm = {
  title: "",
  description: "",
  content: "",
  category: "General",
  published: false,
};

export function NoticesManager() {
  const [notices, setNotices] = useState<Notice[]>([]);
  const [form, setForm] =
    useState<NoticeForm>(initialForm);

  const [showForm, setShowForm] =
    useState(false);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [search, setSearch] =
    useState("");

  const [categoryFilter, setCategoryFilter] =
    useState("All");

  const [statusFilter, setStatusFilter] =
    useState("All");

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  const [changingStatus, setChangingStatus] =
    useState<string | null>(null);

  const [deletingId, setDeletingId] =
    useState<string | null>(null);

  const [error, setError] = useState("");

  async function loadNotices() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(
        "/api/admin/notices",
      );

      const text = await response.text();

      let data: Notice[] | { error?: string } = [];

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
          !Array.isArray(data) && data.error
            ? data.error
            : "Unable to load notices.",
        );
      }

      setNotices(
        Array.isArray(data) ? data : [],
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to load notices.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadNotices();
  }, []);

  function openCreateForm() {
    setEditingId(null);
    setForm(initialForm);
    setError("");
    setShowForm(true);
  }

  function openEditForm(notice: Notice) {
    setEditingId(notice.id);

    setForm({
      title: notice.title,
      description:
        notice.description ?? "",
      content: notice.content,
      category: notice.category,
      published: notice.published,
    });

    setError("");
    setShowForm(true);
  }

  function closeForm() {
    if (saving) return;

    setShowForm(false);
    setEditingId(null);
    setForm(initialForm);
    setError("");
  }

  async function saveNotice() {
    if (!form.title.trim()) {
      setError("Please enter a notice title.");
      return;
    }

    if (!form.content.trim()) {
      setError(
        "Please enter the notice content.",
      );
      return;
    }

    try {
      setSaving(true);
      setError("");

      const url = editingId
        ? `/api/admin/notices/${editingId}`
        : "/api/admin/notices";

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

      let data: Notice | { error?: string };

      try {
        data = text
          ? JSON.parse(text)
          : {};
      } catch {
        throw new Error(
          "The server returned an invalid response.",
        );
      }

      if (!response.ok) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : editingId
              ? "Unable to update notice."
              : "Unable to create notice.",
        );
      }

      if (editingId) {
        setNotices((current) =>
          current.map((notice) =>
            notice.id === editingId
              ? (data as Notice)
              : notice,
          ),
        );
      } else {
        setNotices((current) => [
          data as Notice,
          ...current,
        ]);
      }

      setShowForm(false);
      setEditingId(null);
      setForm(initialForm);
      setError("");
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save notice.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function togglePublished(
    notice: Notice,
  ) {
    try {
      setChangingStatus(notice.id);
      setError("");

      const response = await fetch(
        `/api/admin/notices/${notice.id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            published: !notice.published,
          }),
        },
      );

      const text = await response.text();

      let data: Notice | { error?: string };

      try {
        data = text
          ? JSON.parse(text)
          : {};
      } catch {
        throw new Error(
          "The server returned an invalid response.",
        );
      }

      if (!response.ok) {
        throw new Error(
          "error" in data && data.error
            ? data.error
            : "Unable to change notice status.",
        );
      }

      setNotices((current) =>
        current.map((item) =>
          item.id === notice.id
            ? (data as Notice)
            : item,
        ),
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to change notice status.",
      );
    } finally {
      setChangingStatus(null);
    }
  }

  async function deleteNotice(id: string) {
    const confirmed = window.confirm(
      "Delete this notice permanently? This action cannot be undone.",
    );

    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");

      const response = await fetch(
        `/api/admin/notices/${id}`,
        {
          method: "DELETE",
        },
      );

      const text = await response.text();

      let data: { error?: string } = {};

      try {
        data = text
          ? JSON.parse(text)
          : {};
      } catch {
        throw new Error(
          "The server returned an invalid response.",
        );
      }

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Unable to delete notice.",
        );
      }

      setNotices((current) =>
        current.filter(
          (notice) => notice.id !== id,
        ),
      );

      if (editingId === id) {
        setShowForm(false);
        setEditingId(null);
        setForm(initialForm);
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to delete notice.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const categories = useMemo(() => {
    return [
      "All",
      ...Array.from(
        new Set(
          notices.map(
            (notice) => notice.category,
          ),
        ),
      ),
    ];
  }, [notices]);

  const filteredNotices = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    return notices.filter((notice) => {
      const matchesSearch =
        !query ||
        notice.title
          .toLowerCase()
          .includes(query) ||
        notice.description
          ?.toLowerCase()
          .includes(query) ||
        notice.content
          .toLowerCase()
          .includes(query);

      const matchesCategory =
        categoryFilter === "All" ||
        notice.category === categoryFilter;

      const matchesStatus =
        statusFilter === "All" ||
        (statusFilter === "Published"
          ? notice.published
          : !notice.published);

      return (
        matchesSearch &&
        matchesCategory &&
        matchesStatus
      );
    });
  }, [
    notices,
    search,
    categoryFilter,
    statusFilter,
  ]);

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
            School Notices
          </h2>

          <p className="text-sm text-muted-foreground">
            Create, publish and manage school
            announcements.
          </p>
        </div>

        <Button onClick={openCreateForm}>
          <Plus className="mr-2 size-4" />
          New Notice
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>
              {editingId
                ? "Edit Notice"
                : "Create Notice"}
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
            <div className="space-y-2">
              <label
                htmlFor="notice-title"
                className="text-sm font-medium"
              >
                Title
              </label>

              <Input
                id="notice-title"
                value={form.title}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    title:
                      event.target.value,
                  }))
                }
                placeholder="Admissions Open for 2026-27"
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="notice-description"
                className="text-sm font-medium"
              >
                Short Description
              </label>

              <Input
                id="notice-description"
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    description:
                      event.target.value,
                  }))
                }
                placeholder="Short summary of the notice"
                disabled={saving}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="notice-category"
                className="text-sm font-medium"
              >
                Category
              </label>

              <select
                id="notice-category"
                value={form.category}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    category:
                      event.target.value,
                  }))
                }
                disabled={saving}
                className="h-10 w-full rounded-md border bg-background px-3 text-sm"
              >
                <option value="General">
                  General
                </option>
                <option value="Admissions">
                  Admissions
                </option>
                <option value="Academic">
                  Academic
                </option>
                <option value="Holiday">
                  Holiday
                </option>
                <option value="Examination">
                  Examination
                </option>
              </select>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="notice-content"
                className="text-sm font-medium"
              >
                Notice
              </label>

              <Textarea
                id="notice-content"
                value={form.content}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    content:
                      event.target.value,
                  }))
                }
                placeholder="Write the complete notice..."
                rows={8}
                disabled={saving}
              />
            </div>

            <label className="flex items-center gap-3 text-sm">
              <input
                type="checkbox"
                checked={form.published}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    published:
                      event.target.checked,
                  }))
                }
                disabled={saving}
              />

              Publish immediately
            </label>

            <div className="flex justify-end gap-3">
              <Button
                variant="outline"
                onClick={closeForm}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button
                onClick={saveNotice}
                disabled={saving}
              >
                {saving && (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                )}

                {saving
                  ? editingId
                    ? "Saving..."
                    : "Creating..."
                  : editingId
                    ? "Save Changes"
                    : "Create Notice"}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>
            Notices ({filteredNotices.length})
          </CardTitle>

          <div className="grid gap-3 pt-2 md:grid-cols-[1fr_auto_auto]">
            <div className="relative">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
                placeholder="Search notices..."
                className="pl-9"
              />
            </div>

            <select
              value={categoryFilter}
              onChange={(event) =>
                setCategoryFilter(
                  event.target.value,
                )
              }
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              {categories.map((category) => (
                <option
                  key={category}
                  value={category}
                >
                  {category}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(
                  event.target.value,
                )
              }
              className="h-10 rounded-md border bg-background px-3 text-sm"
            >
              <option value="All">
                All Status
              </option>

              <option value="Published">
                Published
              </option>

              <option value="Draft">
                Draft
              </option>
            </select>
          </div>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="size-6 animate-spin" />
            </div>
          ) : filteredNotices.length === 0 ? (
            <div className="rounded-lg border border-dashed p-10 text-center">
              <Bell className="mx-auto size-10 text-muted-foreground" />

              <p className="mt-4 font-medium">
                {notices.length === 0
                  ? "No notices yet"
                  : "No matching notices"}
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {notices.length === 0
                  ? "Create your first school notice."
                  : "Try changing your search or filters."}
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {filteredNotices.map(
                (notice) => (
                  <div
                    key={notice.id}
                    className="rounded-xl border p-4"
                  >
                    <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-semibold">
                            {notice.title}
                          </h3>

                          <Badge variant="outline">
                            {notice.category}
                          </Badge>

                          {notice.published ? (
                            <Badge>
                              <Eye className="mr-1 size-3" />
                              Published
                            </Badge>
                          ) : (
                            <Badge variant="secondary">
                              <EyeOff className="mr-1 size-3" />
                              Draft
                            </Badge>
                          )}
                        </div>

                        {notice.description && (
                          <p className="mt-2 text-sm text-muted-foreground">
                            {notice.description}
                          </p>
                        )}

                        <p className="mt-2 text-xs text-muted-foreground">
                          Created{" "}
                          {new Date(
                            notice.createdAt,
                          ).toLocaleDateString(
                            "en-IN",
                            {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            },
                          )}
                        </p>
                      </div>

                      <div className="flex shrink-0 flex-wrap gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            togglePublished(
                              notice,
                            )
                          }
                          disabled={
                            changingStatus ===
                              notice.id ||
                            deletingId ===
                              notice.id
                          }
                        >
                          {changingStatus ===
                          notice.id ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                          ) : notice.published ? (
                            <EyeOff className="mr-2 size-4" />
                          ) : (
                            <Eye className="mr-2 size-4" />
                          )}

                          {notice.published
                            ? "Unpublish"
                            : "Publish"}
                        </Button>

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            openEditForm(
                              notice,
                            )
                          }
                          disabled={
                            deletingId ===
                            notice.id
                          }
                        >
                          <Pencil className="mr-2 size-4" />
                          Edit
                        </Button>

                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() =>
                            deleteNotice(
                              notice.id,
                            )
                          }
                          disabled={
                            deletingId ===
                            notice.id
                          }
                        >
                          {deletingId ===
                          notice.id ? (
                            <Loader2 className="mr-2 size-4 animate-spin" />
                          ) : (
                            <Trash2 className="mr-2 size-4" />
                          )}

                          {deletingId ===
                          notice.id
                            ? "Deleting..."
                            : "Delete"}
                        </Button>
                      </div>
                    </div>
                  </div>
                ),
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}