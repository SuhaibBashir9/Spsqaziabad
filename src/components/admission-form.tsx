"use client";

import { useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

const initialForm = {
  studentName: "",
  parentName: "",
  phone: "",
  email: "",
  className: "",
  message: "",
};

export function AdmissionForm() {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function updateField(
    field: keyof typeof initialForm,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));

    setError("");
  }

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setError("");

    if (!/^\d{10}$/.test(form.phone)) {
      setError(
        "Please enter a valid 10-digit phone number.",
      );
      return;
    }

    setLoading(true);

    try {
      const formData = new FormData();

      formData.append("studentName", form.studentName);
      formData.append("parentName", form.parentName);
      formData.append("phone", form.phone);
      formData.append("email", form.email);
      formData.append("className", form.className);
      formData.append("message", form.message);

      const response = await fetch("/api/admissions", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(
          data.error ||
            "Unable to submit enquiry. Please try again.",
        );
        return;
      }

      setForm(initialForm);
      setSuccess(true);
    } catch {
      setError(
        "Unable to connect to the school server. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
        <div className="text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>

          <h2 className="mt-6 text-2xl font-semibold tracking-tight">
            Enquiry Submitted
          </h2>

          <p className="mt-3 leading-7 text-slate-600">
            Thank you for contacting SPS Qaziabad.
            Your admission enquiry has been received
            successfully.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Our school office will contact you shortly.
          </p>

          <button
            type="button"
            onClick={() => {
              setSuccess(false);
              setError("");
            }}
            className="mt-7 rounded-lg border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-900 transition hover:bg-slate-50"
          >
            Submit Another Enquiry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <h2 className="text-2xl font-semibold tracking-tight">
        Admission Enquiry
      </h2>

      <p className="mt-2 text-sm leading-6 text-slate-500">
        Fill in your details and the school will get in
        touch with you.
      </p>

      {error && (
        <div className="mt-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className="mt-8 space-y-5"
      >
        <div>
          <label
            htmlFor="studentName"
            className="text-sm font-medium"
          >
            Student Name
          </label>

          <input
            id="studentName"
            name="studentName"
            value={form.studentName}
            onChange={(event) =>
              updateField(
                "studentName",
                event.target.value,
              )
            }
            required
            className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-950"
            placeholder="Student's full name"
          />
        </div>

        <div>
          <label
            htmlFor="parentName"
            className="text-sm font-medium"
          >
            Parent / Guardian Name
          </label>

          <input
            id="parentName"
            name="parentName"
            value={form.parentName}
            onChange={(event) =>
              updateField(
                "parentName",
                event.target.value,
              )
            }
            required
            className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-950"
            placeholder="Parent or guardian name"
          />
        </div>

        <div>
          <label
            htmlFor="phone"
            className="text-sm font-medium"
          >
            Phone Number
          </label>

          <input
            id="phone"
            name="phone"
            type="tel"
            inputMode="numeric"
            value={form.phone}
            onChange={(event) => {
              const value = event.target.value
                .replace(/\D/g, "")
                .slice(0, 10);

              updateField("phone", value);
            }}
            maxLength={10}
            required
            className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-950"
            placeholder="10-digit phone number"
          />

          <p className="mt-1.5 text-xs text-slate-400">
            Enter exactly 10 digits.
          </p>
        </div>

        <div>
          <label
            htmlFor="email"
            className="text-sm font-medium"
          >
            Email{" "}
            <span className="text-slate-400">
              (optional)
            </span>
          </label>

          <input
            id="email"
            name="email"
            type="email"
            value={form.email}
            onChange={(event) =>
              updateField(
                "email",
                event.target.value,
              )
            }
            className="mt-2 h-11 w-full rounded-lg border border-slate-200 px-3 text-sm outline-none focus:border-slate-950"
            placeholder="Email address"
          />
        </div>

        <div>
          <label
            htmlFor="className"
            className="text-sm font-medium"
          >
            Class Applying For
          </label>

          <select
            id="className"
            name="className"
            value={form.className}
            onChange={(event) =>
              updateField(
                "className",
                event.target.value,
              )
            }
            required
            className="mt-2 h-11 w-full rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-slate-950"
          >
            <option value="">Select class</option>
            <option>Nursery</option>
            <option>LKG</option>
            <option>UKG</option>
            <option>Class 1</option>
            <option>Class 2</option>
            <option>Class 3</option>
            <option>Class 4</option>
            <option>Class 5</option>
            <option>Class 6</option>
            <option>Class 7</option>
            <option>Class 8</option>
            <option>Class 9</option>
            <option>Class 10</option>
          </select>
        </div>

        <div>
          <label
            htmlFor="message"
            className="text-sm font-medium"
          >
            Message{" "}
            <span className="text-slate-400">
              (optional)
            </span>
          </label>

          <textarea
            id="message"
            name="message"
            rows={4}
            value={form.message}
            onChange={(event) =>
              updateField(
                "message",
                event.target.value,
              )
            }
            className="mt-2 w-full rounded-lg border border-slate-200 px-3 py-3 text-sm outline-none focus:border-slate-950"
            placeholder="Any questions for the school?"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex w-full items-center justify-center gap-2 rounded-lg bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading && (
            <Loader2 className="h-4 w-4 animate-spin" />
          )}

          {loading ? "Submitting..." : "Submit Enquiry"}
        </button>
      </form>
    </div>
  );
}