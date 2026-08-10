import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  Dumbbell,
  FlaskConical,
  HeartHandshake,
  Laptop,
  Library,
  Music,
  ShieldCheck,
  Sparkles,
  Trophy,
} from "lucide-react";

import { SiteHeader } from "@/components/site-header";

const facilities = [
  {
    icon: BookOpen,
    title: "Smart Classrooms",
    text: "Comfortable, well-equipped learning spaces designed to encourage participation, discussion and focused learning.",
  },
  {
    icon: Library,
    title: "Library",
    text: "A dedicated space where students can read, research, explore new subjects and develop a lifelong love of books.",
  },
  {
    icon: FlaskConical,
    title: "Science Learning",
    text: "Practical learning opportunities that help students connect scientific concepts with the world around them.",
  },
  {
    icon: Laptop,
    title: "Digital Learning",
    text: "Technology-supported learning that helps students develop essential digital skills for the modern world.",
  },
  {
    icon: Dumbbell,
    title: "Sports",
    text: "Opportunities for students to stay active, develop teamwork and discover the value of discipline and healthy competition.",
  },
  {
    icon: Music,
    title: "Arts & Culture",
    text: "Creative activities that allow students to express themselves through art, music, performance and cultural programmes.",
  },
];

const values = [
  {
    icon: ShieldCheck,
    title: "Safety First",
    text: "A secure and supportive environment where students can learn with confidence.",
  },
  {
    icon: HeartHandshake,
    title: "Student Wellbeing",
    text: "We recognise that emotional and social wellbeing is an important part of successful learning.",
  },
  {
    icon: Sparkles,
    title: "Inspiring Spaces",
    text: "Our learning environment is designed to encourage curiosity, creativity and collaboration.",
  },
  {
    icon: Trophy,
    title: "Active Living",
    text: "Students are encouraged to participate in sports, activities and experiences beyond academics.",
  },
];

export default function CampusPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      <SiteHeader />

      {/* Hero */}
      <section className="group relative overflow-hidden bg-slate-950">
        <div className="relative min-h-[560px]">
          <Image
            src="https://images.unsplash.com/photo-1562774053-701939374585?auto=format&fit=crop&w=2200&q=85"
            alt="School building"
            fill
            priority
            className="object-cover transition-transform duration-[10000ms] ease-out group-hover:scale-105"
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-slate-950/65" />

          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/50 to-transparent" />

          <div className="relative mx-auto flex min-h-[560px] max-w-7xl items-center px-5 py-20 sm:px-6 lg:px-8">
            <div className="max-w-3xl text-white">
              <p className="animate-[campusFade_0.6s_ease-out_both] text-sm font-semibold uppercase tracking-[0.25em] text-slate-300">
                Campus & Facilities
              </p>

              <h1 className="mt-5 text-5xl font-semibold tracking-tight sm:text-6xl">
                Spaces where learning comes alive.
              </h1>

              <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-200">
                A school environment should give students room to learn,
                explore, create, play and grow. Our campus is designed around
                that belief.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="animate-[campusSlideUp_0.7s_ease-out_both]">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Our Campus
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Built around the student experience.
            </h2>
          </div>

          <div className="space-y-5 text-base leading-8 text-slate-600">
            <p>
              At SPS Qaziabad, the campus is more than a collection of
              classrooms. It is an environment where students spend their days
              learning, building friendships, discovering interests and
              developing confidence.
            </p>

            <p>
              From academic spaces to sports and creative activities, we aim to
              provide students with opportunities to develop academically,
              physically, socially and creatively.
            </p>
          </div>
        </div>
      </section>

      {/* Main campus image */}
      <section className="px-5 pb-24 sm:px-6 lg:px-8">
        <div className="group relative mx-auto min-h-[520px] max-w-7xl overflow-hidden rounded-3xl">
          <Image
            src="https://images.unsplash.com/photo-1606761568499-6d2451b23c66?auto=format&fit=crop&w=2200&q=85"
            alt="School campus and students"
            fill
            className="object-cover transition-transform duration-[1500ms] group-hover:scale-105"
            sizes="100vw"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />

          <div className="absolute bottom-0 left-0 max-w-2xl p-8 text-white sm:p-12">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300">
              Learning Environment
            </p>

            <h2 className="mt-3 text-3xl font-semibold sm:text-4xl">
              A place where every day brings something new.
            </h2>
          </div>
        </div>
      </section>

      {/* Facilities */}
      <section className="bg-slate-50 py-24">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Facilities
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Designed for learning, discovery and growth.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-3">
            {facilities.map((facility, index) => {
              const Icon = facility.icon;

              return (
                <div
                  key={facility.title}
                  className="group rounded-2xl border border-slate-200 bg-white p-7 opacity-0 transition duration-300 hover:-translate-y-2 hover:border-slate-300 hover:shadow-xl"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-950 text-white transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    <Icon className="h-5 w-5" />
                  </div>

                  <h3 className="mt-6 text-xl font-semibold">
                    {facility.title}
                  </h3>

                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {facility.text}
                  </p>

                  <div className="mt-7 flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 transition-all duration-300 group-hover:translate-x-1 group-hover:bg-slate-950 group-hover:text-white">
                    <ArrowRight className="h-4 w-4" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Student life */}
      <section className="py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-5 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div className="group relative min-h-[500px] overflow-hidden rounded-3xl">
            <Image
              src="https://images.unsplash.com/photo-1529390079861-591de354faf5?auto=format&fit=crop&w=1400&q=85"
              alt="Students collaborating"
              fill
              className="object-cover transition-transform duration-[1500ms] group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
          </div>

          <div className="flex flex-col justify-center">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
              Beyond the Classroom
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              Learning happens everywhere.
            </h2>

            <p className="mt-6 leading-8 text-slate-600">
              Some of the most important lessons happen outside textbooks.
              Sports, clubs, performances, competitions and collaborative
              activities help students discover their strengths and learn how
              to work with others.
            </p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                "Sports & Games",
                "Cultural Activities",
                "Competitions",
                "Clubs & Societies",
              ].map((item) => (
                <div
                  key={item}
                  className="rounded-xl border border-slate-200 px-5 py-4 text-sm font-semibold transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 hover:shadow-md"
                >
                  {item}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Campus principles */}
      <section className="bg-slate-950 py-24 text-white">
        <div className="mx-auto max-w-7xl px-5 sm:px-6 lg:px-8">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Our Environment
            </p>

            <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
              A campus built around people.
            </h2>
          </div>

          <div className="mt-12 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
            {values.map((value, index) => {
              const Icon = value.icon;

              return (
                <div
                  key={value.title}
                  className="group rounded-2xl border border-white/10 bg-white/5 p-7 opacity-0 transition-all duration-300 hover:-translate-y-2 hover:border-white/20 hover:bg-white/10"
                  style={{
                    animationDelay: `${index * 100}ms`,
                    animationFillMode: "forwards",
                  }}
                >
                  <Icon className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" />

                  <h3 className="mt-6 text-lg font-semibold">
                    {value.title}
                  </h3>

                  <p className="mt-3 text-sm leading-6 text-slate-300">
                    {value.text}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-5 py-24 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl rounded-3xl bg-slate-50 p-8 sm:p-12 lg:p-16">
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                Visit SPS Qaziabad
              </p>

              <h2 className="mt-4 text-4xl font-semibold tracking-tight sm:text-5xl">
                Come and see our learning environment for yourself.
              </h2>

              <p className="mt-5 leading-7 text-slate-600">
                We look forward to welcoming prospective families and helping
                you discover what SPS Qaziabad has to offer.
              </p>
            </div>

            <Link
              href="/admissions"
              className="inline-flex shrink-0 items-center justify-center gap-2 rounded-full bg-slate-950 px-7 py-3.5 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-slate-800 hover:shadow-xl"
            >
              Explore Admissions
              <ArrowRight className="h-4 w-4" />
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
              Excellence â€¢ Character â€¢ Future
            </p>
          </div>

          <div className="flex flex-wrap gap-5 text-sm">
            <Link href="/" className="hover:text-white">
              Home
            </Link>

            <Link href="/about" className="hover:text-white">
              About
            </Link>

            <Link href="/academics" className="hover:text-white">
              Academics
            </Link>

            <Link href="/admissions" className="hover:text-white">
              Admissions
            </Link>

            <Link href="/campus" className="text-white">
              Campus
            </Link>

            <Link href="/notices" className="hover:text-white">
              Notices
            </Link>

            <Link href="/login" className="hover:text-white">
              Login
            </Link>
          </div>
        </div>
      </footer>
</main>
  );
}
