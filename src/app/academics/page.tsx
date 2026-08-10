import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  BookOpen,
  Brain,
  CheckCircle2,
  GraduationCap,
  Lightbulb,
  Users,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";

const stages = [
  {
    number: "01",
    title: "Primary School",
    years: "Foundation Years",
    description:
      "A nurturing environment where students build strong foundations in literacy, numeracy, communication, curiosity and social development.",
    icon: BookOpen,
  },
  {
    number: "02",
    title: "Middle School",
    years: "Growing & Exploring",
    description:
      "Students develop deeper subject knowledge, stronger study habits, independent thinking and the confidence to explore new interests.",
    icon: Brain,
  },
  {
    number: "03",
    title: "Senior School",
    years: "Preparing for the Future",
    description:
      "A focused academic environment preparing students for higher education, examinations, careers and responsible citizenship.",
    icon: GraduationCap,
  },
];

const principles = [
  {
    icon: Lightbulb,
    title: "Curiosity",
    text: "We encourage students to ask questions, investigate ideas and develop a genuine desire to understand the world around them.",
  },
  {
    icon: Brain,
    title: "Critical Thinking",
    text: "Students learn to analyse information, consider different perspectives and make thoughtful decisions.",
  },
  {
    icon: Users,
    title: "Collaboration",
    text: "Learning with others develops communication, teamwork, empathy and leadership.",
  },
  {
    icon: Award,
    title: "Excellence",
    text: "We encourage every student to set meaningful goals and take pride in continuous improvement.",
  },
];

const curriculum = [
  "Languages & Communication",
  "Mathematics",
  "Science",
  "Social Sciences",
  "Computer & Digital Learning",
  "Arts & Creativity",
  "Physical Education & Sports",
  "Life Skills & Values",
];

const assessmentPoints = [
  "Regular academic assessment",
  "Individual feedback and support",
  "Parent-teacher communication",
  "Recognition of progress and achievement",
];

export default function AcademicsPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <SiteHeader />

      {/* Hero */}
      <section className="group relative overflow-hidden bg-slate-950">
        <div className="relative min-h-[520px]">
          <Image
            src="https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=2200&q=85"
            alt="Students learning in a classroom"
            fill
            priority
            className="object-cover transition-transform duration-[12000ms] ease-out group-hover:scale-105"
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-slate-950/70" />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/85 via-slate-950/45 to-transparent" />

          <div className="relative mx-auto flex min-h-[520px] max-w-7xl items-center px-5 sm:px-6 lg:px-8">
            <div className="max-w-3xl text-white">
              <p className="animate-[fadeInUp_0.6s_ease-out_both] text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
                Academics
              </p>

              <h1 className="mt-5 animate-[fadeInUp_0.7s_ease-out_0.1s_both] text-5xl font-semibold tracking-tight sm:text-6xl">
                Learning with purpose.
              </h1>

              <p className="mt-6 max-w-2xl animate-[fadeInUp_0.7s_ease-out_0.2s_both] text-lg leading-8 text-slate-200">
                We build strong academic foundations while helping students
                become curious thinkers, confident communicators and lifelong
                learners.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="animate-[fadeInUp_0.7s_ease-out_both]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Our Approach
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Education should create thinkers, not just test-takers.
            </h2>
          </div>

          <div className="space-y-6 animate-[fadeInUp_0.7s_ease-out_0.15s_both] text-base leading-8 text-slate-600">
            <p>
              At SPS Qaziabad, academic learning is designed to give students
              both knowledge and the ability to use that knowledge effectively.
            </p>

            <p>
              We combine structured teaching with discussion, exploration,
              practical learning, collaboration and opportunities for students
              to take ownership of their education.
            </p>

            <p>
              Our aim is to help every student develop the skills, confidence
              and character needed for the next stage of their journey.
            </p>
          </div>
        </div>
      </section>

      {/* School stages */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl animate-[fadeInUp_0.7s_ease-out_both]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              School Journey
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Learning evolves with every stage.
            </h2>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-3">
            {stages.map((stage, index) => {
              const Icon = stage.icon;

              return (
                <div
                  key={stage.number}
                  className="group rounded-3xl border border-slate-200 bg-white p-8 opacity-0 animate-[fadeInUp_0.7s_ease-out_both] transition-all duration-300 hover:-translate-y-2 hover:border-slate-300 hover:shadow-xl"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-400">
                      {stage.number}
                    </span>

                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-slate-950 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                      <Icon className="h-5 w-5" />
                    </div>
                  </div>

                  <p className="mt-12 text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
                    {stage.years}
                  </p>

                  <h3 className="mt-3 text-2xl font-semibold tracking-tight">
                    {stage.title}
                  </h3>

                  <p className="mt-4 text-sm leading-7 text-slate-600">
                    {stage.description}
                  </p>

                  <div className="mt-8 flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 transition-all duration-300 group-hover:translate-x-2 group-hover:bg-slate-950 group-hover:text-white">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Learning principles */}
      <section className="py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl animate-[fadeInUp_0.7s_ease-out_both]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              How We Learn
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Four principles guide our classrooms.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {principles.map((principle, index) => {
              const Icon = principle.icon;

              return (
                <div
                  key={principle.title}
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
                    {principle.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    {principle.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Curriculum */}
      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="animate-[fadeInUp_0.7s_ease-out_both]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Curriculum
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              A balanced education for a changing world.
            </h2>

            <p className="mt-6 max-w-xl leading-8 text-slate-300">
              Our academic programme combines core subjects with opportunities
              for creativity, technology, physical development and personal
              growth.
            </p>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {curriculum.map((subject, index) => (
              <div
                key={subject}
                className="group flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-5 py-4 opacity-0 animate-[fadeInUp_0.6s_ease-out_both] transition-all duration-300 hover:-translate-y-1 hover:border-white/20 hover:bg-white/10"
                style={{
                  animationDelay: `${index * 75}ms`,
                  animationFillMode: "forwards",
                }}
              >
                <CheckCircle2 className="h-4 w-4 shrink-0 text-slate-300 transition-transform duration-300 group-hover:scale-110" />

                <span className="text-sm text-slate-200">{subject}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Assessment */}
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="group relative min-h-[450px] overflow-hidden rounded-3xl">
            <Image
              src="https://images.unsplash.com/photo-1434030216411-0b793f4b4173?auto=format&fit=crop&w=1400&q=85"
              alt="Student studying"
              fill
              className="object-cover transition-transform duration-1000 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col justify-center animate-[fadeInUp_0.7s_ease-out_both]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Assessment & Progress
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Progress is more than a number.
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              Assessment helps teachers understand where students are,
              identify areas for growth and provide meaningful support.
            </p>

            <div className="mt-8 space-y-4">
              {assessmentPoints.map((item, index) => (
                <div
                  key={item}
                  className="group flex items-center gap-3 opacity-0 animate-[fadeInUp_0.6s_ease-out_both]"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <CheckCircle2 className="h-5 w-5 shrink-0 transition-transform duration-300 group-hover:scale-110" />

                  <span className="text-sm font-medium text-slate-700">
                    {item}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 pb-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-slate-950 px-7 py-16 text-white transition-transform duration-500 hover:scale-[1.005] sm:px-12 lg:px-16">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
                Take the Next Step
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight">
                Give your child an education built for the future.
              </h2>
            </div>

            <Link
              href="/admissions"
              className="group inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-white px-7 py-3.5 text-sm font-semibold text-slate-950 transition-all duration-300 hover:-translate-y-1 hover:bg-slate-100 hover:shadow-xl"
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

            <Link
              href="/about"
              className="transition-colors hover:text-white"
            >
              About
            </Link>

            <Link href="/academics" className="text-white">
              Academics
            </Link>

            <Link
              href="/admissions"
              className="transition-colors hover:text-white"
            >
              Admissions
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