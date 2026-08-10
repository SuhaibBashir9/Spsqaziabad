import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

import { SiteHeader } from "@/components/site-header";

export default function AdmissionSuccessPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <SiteHeader />

      <section className="flex min-h-[70vh] items-center justify-center px-5 py-20">
        <div className="w-full max-w-lg text-center">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <CheckCircle2 className="h-8 w-8 text-green-600" />
          </div>

          <h1 className="mt-7 text-3xl font-semibold tracking-tight">
            Enquiry Submitted
          </h1>

          <p className="mt-4 leading-7 text-slate-600">
            Thank you for contacting SPS Qaziabad.
            Your admission enquiry has been received
            successfully.
          </p>

          <p className="mt-2 text-sm text-slate-500">
            Our school office will contact you shortly.
          </p>

          <Link
            href="/"
            className="mt-8 inline-flex rounded-lg bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Back to Home
          </Link>
        </div>
      </section>

      <footer className="bg-slate-950 py-10 text-center text-sm text-slate-400">
        © {new Date().getFullYear()} SPS Qaziabad. All rights reserved.
      </footer>
    </main>
  );
}