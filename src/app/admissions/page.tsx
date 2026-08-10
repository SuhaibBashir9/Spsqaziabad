import Link from "next/link";
import {
  ArrowRight,
  CheckCircle2,
  FileText,
  GraduationCap,
  Phone,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";
import { AdmissionForm } from "@/components/admission-form";

const admissionInfo = [
  {
    icon: GraduationCap,
    title: "Eligibility",
    text: "Admission eligibility depends on the class and the school's admission requirements.",
  },
  {
    icon: FileText,
    title: "Required Documents",
    text: "Birth certificate, previous school records, photographs and other documents requested by the school.",
  },
  {
    icon: Phone,
    title: "Need Help?",
    text: "Contact the school office for admission dates, availability and further information.",
  },
];

const admissionSteps = [
  "Submit an admission enquiry.",
  "The school office will contact you.",
  "Complete the required admission formalities.",
  "Submit the required documents.",
];

export default function AdmissionsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <SiteHeader />

      {/* Hero */}
      <section className="relative overflow-hidden bg-slate-950 text-white">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-900 to-slate-800" />

        <div className="relative mx-auto flex min-h-[480px] max-w-7xl items-center px-5 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <p className="animate-[fadeIn_0.5s_ease-out_both] text-sm font-semibold uppercase tracking-[0.25em] text-slate-400">
              SPS Qaziabad
            </p>

            <h1 className="mt-5 animate-[fadeInUp_0.7s_ease-out_0.1s_both] text-5xl font-semibold tracking-tight sm:text-6xl lg:text-7xl">
              Admissions
            </h1>

            <p className="mt-6 max-w-2xl animate-[fadeInUp_0.7s_ease-out_0.2s_both] text-lg leading-8 text-slate-300">
              Begin your child&apos;s educational journey with SPS Qaziabad.
            </p>

            <div className="mt-8 animate-[fadeInUp_0.7s_ease-out_0.3s_both]">
              <Link
                href="#enquiry"
                className="group inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-100 hover:shadow-xl"
              >
                Start an Enquiry
                <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Admission Information */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="grid gap-14 lg:grid-cols-[1fr_0.8fr]">
            {/* Information */}
            <div>
              <div className="animate-[fadeInUp_0.7s_ease-out_both]">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Admission Information
                </p>

                <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                  Join SPS Qaziabad.
                </h2>

                <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600">
                  We welcome families who are looking for a supportive,
                  focused and balanced learning environment for their children.
                </p>
              </div>

              {/* Information Cards */}
              <div className="mt-10 space-y-4">
                {admissionInfo.map((item, index) => {
                  const Icon = item.icon;

                  return (
                    <div
                      key={item.title}
                      className="group rounded-2xl border border-slate-200 bg-white p-6 opacity-0 animate-[fadeInUp_0.6s_ease-out_both] shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-lg"
                      style={{
                        animationDelay: `${index * 100 + 150}ms`,
                        animationFillMode: "forwards",
                      }}
                    >
                      <div className="flex gap-5">
                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-slate-950 text-white transition-transform duration-300 group-hover:scale-110">
                          <Icon className="h-5 w-5" />
                        </div>

                        <div>
                          <h3 className="font-semibold">
                            {item.title}
                          </h3>

                          <p className="mt-2 text-sm leading-6 text-slate-600">
                            {item.text}
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Admission Process */}
              <div className="mt-8 rounded-3xl bg-slate-50 p-7 sm:p-8">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  How It Works
                </p>

                <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                  Admission Process
                </h3>

                <div className="mt-7 space-y-5">
                  {admissionSteps.map((step, index) => (
                    <div
                      key={step}
                      className="group flex items-start gap-4 opacity-0 animate-[fadeInUp_0.6s_ease-out_both]"
                      style={{
                        animationDelay: `${index * 100 + 350}ms`,
                        animationFillMode: "forwards",
                      }}
                    >
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-950 text-xs font-semibold text-white transition-transform duration-300 group-hover:scale-110">
                        {index + 1}
                      </div>

                      <div className="flex items-center gap-2 pt-1">
                        <CheckCircle2 className="h-4 w-4 shrink-0 text-slate-500" />

                        <p className="text-sm leading-6 text-slate-600">
                          {step}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Admission Form */}
            <div
              id="enquiry"
              className="scroll-mt-28 opacity-0 animate-[fadeInUp_0.8s_ease-out_0.2s_both]"
              style={{
                animationFillMode: "forwards",
              }}
            >
              <div className="sticky top-28 rounded-3xl border border-slate-200 bg-white p-6 shadow-xl sm:p-8">
                <div className="mb-7">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                    Enquiry
                  </p>

                  <h2 className="mt-3 text-2xl font-semibold tracking-tight">
                    Start your application
                  </h2>

                  <p className="mt-2 text-sm leading-6 text-slate-600">
                    Fill in your details and our school office will get in
                    touch with you.
                  </p>
                </div>

                <AdmissionForm />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Bottom CTA */}
      <section className="px-5 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl overflow-hidden rounded-3xl bg-slate-950 px-7 py-16 text-white sm:px-12 lg:px-16">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                SPS Qaziabad
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                We look forward to welcoming your family.
              </h2>

              <p className="mt-5 leading-7 text-slate-300">
                Have questions about admissions or the school? Submit an
                enquiry and our team will help you with the next steps.
              </p>
            </div>

            <Link
              href="#enquiry"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-100 hover:shadow-xl"
            >
              Enquire Now
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <div className="font-bold text-white">
              SPS Qaziabad
            </div>

            <p className="mt-2 text-xs text-slate-500">
              Excellence • Character • Future
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm">
            <Link
              href="/"
              className="transition-colors hover:text-white"
            >
              Home
            </Link>

            <Link
              href="/about"
              className="transition-colors hover:text-white"
            >
              About
            </Link>

            <Link
              href="/academics"
              className="transition-colors hover:text-white"
            >
              Academics
            </Link>

            <Link
              href="/notices"
              className="transition-colors hover:text-white"
            >
              Notices
            </Link>

            <Link
              href="/login"
              className="transition-colors hover:text-white"
            >
              Login
            </Link>
          </div>
        </div>

        <div className="border-t border-white/10 py-5 text-center text-xs text-slate-500">
          © {new Date().getFullYear()} SPS Qaziabad. All rights reserved.
        </div>
      </footer>
    </main>
  );
}