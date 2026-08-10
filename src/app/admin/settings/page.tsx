import { redirect } from "next/navigation";
import {
  Building2,
  Globe,
  Mail,
  MapPin,
  Phone,
  User,
} from "lucide-react";

import { auth } from "@/auth";
import { prisma } from "@/lib/db/prisma";
import { SchoolSettingsForm } from "@/components/admin/school-settings-form";
import { AdminAccountForm } from "@/components/admin/admin-account-form";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function SettingsPage() {
  const session = await auth();

  if (
    !session?.user ||
    session.user.role !== "SCHOOL_ADMIN" ||
    !session.user.schoolId
  ) {
    redirect("/login");
  }

  const [school, user] = await Promise.all([
    prisma.school.findUnique({
      where: {
        id: session.user.schoolId,
      },
      select: {
        id: true,
        name: true,
        slug: true,
        email: true,
        phone: true,
        address: true,
        city: true,
        state: true,
        country: true,
        logoUrl: true,
        website: true,
      },
    }),

    prisma.user.findUnique({
      where: {
        id: session.user.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    }),
  ]);

  if (!school || !user) {
    redirect("/login");
  }

  return (
    <main className="flex-1 space-y-6 p-6 md:p-8">
      <div>
        <p className="text-sm font-medium text-muted-foreground">
          Administration
        </p>

        <h1 className="mt-1 text-3xl font-semibold tracking-tight">
          Settings
        </h1>

        <p className="mt-1 text-muted-foreground">
          Manage your school information and administrator account.
        </p>
      </div>

      <section className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="size-5" />
              School Profile
            </CardTitle>

            <p className="text-sm text-muted-foreground">
              Information displayed across the school platform.
            </p>
          </CardHeader>

          <CardContent>
            <SchoolSettingsForm
              school={school}
            />
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="size-5" />
                Administrator Account
              </CardTitle>

              <p className="text-sm text-muted-foreground">
                Update the name associated with your administrator account.
              </p>
            </CardHeader>

            <CardContent>
              <AdminAccountForm
                user={user}
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>School Information</CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex gap-3">
                <MapPin className="mt-0.5 size-4 text-muted-foreground" />

                <div>
                  <p className="text-sm font-medium">
                    Address
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {school.address ||
                      "No address added"}
                  </p>

                  {(school.city ||
                    school.state) && (
                    <p className="text-sm text-muted-foreground">
                      {[
                        school.city,
                        school.state,
                        school.country,
                      ]
                        .filter(Boolean)
                        .join(", ")}
                    </p>
                  )}
                </div>
              </div>

              <div className="flex gap-3">
                <Phone className="mt-0.5 size-4 text-muted-foreground" />

                <div>
                  <p className="text-sm font-medium">
                    Phone
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {school.phone ||
                      "No phone added"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Mail className="mt-0.5 size-4 text-muted-foreground" />

                <div>
                  <p className="text-sm font-medium">
                    Email
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {school.email ||
                      "No email added"}
                  </p>
                </div>
              </div>

              <div className="flex gap-3">
                <Globe className="mt-0.5 size-4 text-muted-foreground" />

                <div>
                  <p className="text-sm font-medium">
                    Website
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {school.website ||
                      "No website added"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </main>
  );
}