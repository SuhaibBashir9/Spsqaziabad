import Link from "next/link";
import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  School,
  Users,
} from "lucide-react";

export default function HomePage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b bg-background/95">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6">
          <Link
            href="/"
            className="flex items-center gap-2 font-semibold"
          >
            <div className="flex size-9 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <School className="size-5" />
            </div>

            <div>
              <p className="text-sm font-semibold leading-none">
                SPS Qaziabad
              </p>
              <p className="mt-1 text-xs text-muted-foreground">
                School Management
              </p>
            </div>
          </Link>

          <nav className="hidden items-center gap-6 md:flex">
            <Link
              href="/"
              className="text-sm font-medium hover:text-primary"
            >
              Home
            </Link>

            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              About
            </Link>

            <Link
              href="/academics"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Academics
            </Link>

            <Link
              href="/campus"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Campus
            </Link>

            <Link
              href="/admissions"
              className="text-sm font-medium text-muted-foreground hover:text-primary"
            >
              Admissions
            </Link>
          </nav>

          {/* Admin Login */}
          <Link
            href="/login"
            className="inline-flex h-9 items-center justify-center rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
          >
            Admin Login
          </Link>
        </div>
      </header>

      {/* Hero */}
      <section className="border-b">
        <div className="mx-auto max-w-7xl px-6 py-20 md:py-28">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border bg-muted px-3 py-1 text-sm text-muted-foreground">
              <School className="size-4" />
              SPS Qaziabad
            </div>

            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl md:text-6xl">
              Building a better future through{" "}
              <span className="text-primary">
                education.
              </span>
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-muted-foreground">
              Welcome to SPS Qaziabad. Explore our academics,
              campus, admissions and everything that makes our
              school community special.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/admissions"
                className="inline-flex h-11 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
              >
                Apply for Admission
                <ArrowRight className="ml-2 size-4" />
              </Link>

              <Link
                href="/about"
                className="inline-flex h-11 items-center justify-center rounded-md border bg-background px-6 text-sm font-medium shadow-sm transition hover:bg-muted"
              >
                Learn More
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<GraduationCap className="size-6" />}
            title="Quality Education"
            description="A learning environment focused on academic growth and student development."
          />

          <FeatureCard
            icon={<BookOpen className="size-6" />}
            title="Academics"
            description="Explore our academic programs, curriculum and learning opportunities."
          />

          <FeatureCard
            icon={<Users className="size-6" />}
            title="Student Community"
            description="A supportive community where students can learn, grow and participate."
          />

          <FeatureCard
            icon={<School className="size-6" />}
            title="Our Campus"
            description="Discover our campus and the facilities available to our students."
          />
        </div>
      </section>

      {/* Admissions CTA */}
      <section className="mx-auto max-w-7xl px-6 pb-16">
        <div className="rounded-2xl border bg-muted/40 p-8 md:p-12">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-center">
            <div className="max-w-2xl">
              <p className="text-sm font-medium text-primary">
                Admissions
              </p>

              <h2 className="mt-2 text-2xl font-semibold tracking-tight md:text-3xl">
                Start your journey with SPS Qaziabad
              </h2>

              <p className="mt-3 text-muted-foreground">
                Submit an admission enquiry and our school
                team will get in touch with you.
              </p>
            </div>

            <Link
              href="/admissions"
              className="inline-flex h-11 shrink-0 items-center justify-center rounded-md bg-primary px-6 text-sm font-medium text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              Admissions
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Admin Area */}
      <section className="border-t bg-muted/20">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-center">
            <div>
              <h2 className="font-semibold">
                School Administration
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                School administrators can manage students,
                teachers, classes, subjects and notices.
              </p>
            </div>

            <Link
              href="/login"
              className="inline-flex h-10 items-center justify-center rounded-md border bg-background px-5 text-sm font-medium shadow-sm transition hover:bg-muted"
            >
              Admin Login
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-2 px-6 py-6 text-sm text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} SPS Qaziabad. All
            rights reserved.
          </p>

          <Link
            href="/login"
            className="font-medium hover:text-foreground"
          >
            Admin Login
          </Link>
        </div>
      </footer>
    </main>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="rounded-xl border bg-background p-6">
      <div className="flex size-11 items-center justify-center rounded-lg bg-primary/10 text-primary">
        {icon}
      </div>

      <h3 className="mt-5 font-semibold">
        {title}
      </h3>

      <p className="mt-2 text-sm leading-6 text-muted-foreground">
        {description}
      </p>
    </div>
  );
}