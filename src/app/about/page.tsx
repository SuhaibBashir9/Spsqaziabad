import Image from "next/image";
import Link from "next/link";
import { SiteHeader } from "@/components/site-header";
import {
  ArrowRight,
  BookOpen,
  Heart,
  Lightbulb,
  ShieldCheck,
  Target,
  Users,
} from "lucide-react";

const values = [
  {
    icon: Target,
    title: "Purpose",
    text: "We help students develop a clear sense of purpose and the confidence to pursue their goals.",
  },
  {
    icon: BookOpen,
    title: "Learning",
    text: "We encourage curiosity, independent thinking and a genuine love for learning.",
  },
  {
    icon: Heart,
    title: "Character",
    text: "Respect, responsibility, kindness and integrity are central to the education we provide.",
  },
  {
    icon: Lightbulb,
    title: "Innovation",
    text: "Students are encouraged to question, create, experiment and find new ways to solve problems.",
  },
  {
    icon: Users,
    title: "Community",
    text: "We believe strong partnerships between students, families and teachers create better outcomes.",
  },
  {
    icon: ShieldCheck,
    title: "Wellbeing",
    text: "A safe, supportive and respectful environment allows every student to thrive.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <SiteHeader />

      {/* Hero */}
      <section className="group relative overflow-hidden bg-slate-950">
        <div className="relative min-h-[500px]">
          <Image
            src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?auto=format&fit=crop&w=2200&q=85"
            alt="Students walking across a school campus"
            fill
            priority
            className="object-cover transition-transform duration-[12000ms] ease-out group-hover:scale-105"
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-slate-950/65" />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-slate-950/40 to-transparent" />

          <div className="relative mx-auto flex min-h-[500px] max-w-7xl items-center px-5 sm:px-6 lg:px-8">
            <div className="max-w-3xl text-white">
              <p className="animate-[fadeInUp_0.6s_ease-out_both] text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
                About SPS Qaziabad
              </p>

              <h1 className="mt-5 animate-[fadeInUp_0.7s_ease-out_0.1s_both] text-5xl font-semibold tracking-tight sm:text-6xl">
                Education with purpose.
              </h1>

              <p className="mt-6 max-w-2xl animate-[fadeInUp_0.7s_ease-out_0.2s_both] text-lg leading-8 text-slate-200">
                A school community where knowledge, character, curiosity and
                ambition come together.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Story */}
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-14 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="animate-[fadeInUp_0.7s_ease-out_both]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Our Story
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              More than a school.
              <br />
              A community.
            </h2>
          </div>

          <div className="space-y-6 animate-[fadeInUp_0.7s_ease-out_0.15s_both] text-base leading-8 text-slate-600">
            <p>
              SPS Qaziabad is built around a simple belief: every child has
              potential, and education should create the conditions for that
              potential to flourish.
            </p>

            <p>
              Our approach brings together academic learning, personal
              development, creativity, sports and meaningful relationships.
              Students are encouraged to ask questions, take responsibility
              and become active members of their community.
            </p>

            <p>
              We want our students to leave school with more than knowledge.
              We want them to have confidence in themselves, respect for
              others and the ability to contribute positively to the world
              around them.
            </p>
          </div>
        </div>
      </section>

      {/* Mission */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="group relative min-h-[500px] overflow-hidden rounded-3xl">
            <Image
              src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=1400&q=85"
              alt="Students learning in a classroom"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Our Mission
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Helping every student discover their potential.
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              We aim to provide a balanced and engaging education that
              develops strong academic foundations while nurturing confidence,
              creativity, discipline and compassion.
            </p>

            <div className="mt-8 space-y-4">
              {[
                "Encourage intellectual curiosity and independent thinking.",
                "Build strong character and a sense of responsibility.",
                "Create opportunities for creativity, leadership and collaboration.",
                "Maintain a safe and inclusive environment for every child.",
              ].map((item) => (
                <div key={item} className="group flex gap-4">
                  <div className="mt-2 h-2 w-2 shrink-0 rounded-full bg-slate-900 transition-transform duration-300 group-hover:scale-150" />

                  <p className="text-sm leading-6 text-slate-600">
                    {item}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="animate-[fadeInUp_0.6s_ease-out_both] text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Our Values
            </p>

            <h2 className="mt-4 animate-[fadeInUp_0.7s_ease-out_0.1s_both] text-4xl font-semibold tracking-tight sm:text-5xl">
              The principles behind everything we do.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 opacity-0 animate-[fadeInUp_0.7s_ease-out_both] transition-all duration-300 hover:-translate-y-2 hover:border-slate-300 hover:shadow-xl"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 text-lg font-semibold">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {value.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-slate-950 px-7 py-16 text-white transition-transform duration-500 hover:scale-[1.005] sm:px-12 lg:px-16">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Join SPS Qaziabad
              </p>

              <h2 className="mt-4 text-3xl font-semibold tracking-tight sm:text-4xl">
                Begin your child&apos;s journey with us.
              </h2>
            </div>

            <Link
              href="/admissions"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-100 hover:shadow-xl"
            >
              Explore Admissions
              <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-950 text-slate-300">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-5 py-12 sm:px-6 md:flex-row md:items-center md:justify-between lg:px-8">
          <div>
            <div className="font-bold text-white">SPS Qaziabad</div>

            <p className="mt-2 text-xs text-slate-500">
              Excellence • Character • Future
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm">
            <Link href="/" className="transition-colors hover:text-white">
              Home
            </Link>

            <Link href="/about" className="text-white">
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
              href="/admissions"
              className="transition-colors hover:text-white"
            >
              Admissions
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