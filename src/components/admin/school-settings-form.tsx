"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type School = {
  id: string;
  name: string;
  slug: string;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string;
  logoUrl: string | null;
  website: string | null;
};

type Props = {
  school: School;
};

export function SchoolSettingsForm({
  school,
}: Props) {
  const [name, setName] =
    useState(school.name);

  const [email, setEmail] =
    useState(school.email ?? "");

  const [phone, setPhone] =
    useState(school.phone ?? "");

  const [address, setAddress] =
    useState(school.address ?? "");

  const [city, setCity] =
    useState(school.city ?? "");

  const [state, setState] =
    useState(school.state ?? "");

  const [country, setCountry] =
    useState(school.country);

  const [website, setWebsite] =
    useState(school.website ?? "");

  const [logoUrl, setLogoUrl] =
    useState(school.logoUrl ?? "");

  const [saving, setSaving] =
    useState(false);

  const [message, setMessage] =
    useState("");

  const [error, setError] =
    useState("");

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setMessage("");

      const response = await fetch(
        "/api/admin/settings",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            section: "school",
            name,
            email,
            phone,
            address,
            city,
            state,
            country,
            website,
            logoUrl,
          }),
        },
      );

      const text =
        await response.text();

      let data: {
        error?: string;
      } = {};

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
          data.error ||
            "Unable to save school settings.",
        );
      }

      setMessage(
        "School information saved successfully.",
      );
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Unable to save school settings.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-5"
    >
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      {message && (
        <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {message}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="school-name">
          School Name
        </Label>

        <Input
          id="school-name"
          value={name}
          onChange={(event) =>
            setName(event.target.value)
          }
          required
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="school-email">
            Email
          </Label>

          <Input
            id="school-email"
            type="email"
            value={email}
            onChange={(event) =>
              setEmail(event.target.value)
            }
            placeholder="school@example.com"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="school-phone">
            Phone
          </Label>

          <Input
            id="school-phone"
            value={phone}
            onChange={(event) =>
              setPhone(event.target.value)
            }
            placeholder="+91..."
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="school-address">
          Address
        </Label>

        <Input
          id="school-address"
          value={address}
          onChange={(event) =>
            setAddress(event.target.value)
          }
          placeholder="School address"
        />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="school-city">
            City
          </Label>

          <Input
            id="school-city"
            value={city}
            onChange={(event) =>
              setCity(event.target.value)
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="school-state">
            State
          </Label>

          <Input
            id="school-state"
            value={state}
            onChange={(event) =>
              setState(event.target.value)
            }
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="school-country">
          Country
        </Label>

        <Input
          id="school-country"
          value={country}
          onChange={(event) =>
            setCountry(event.target.value)
          }
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="school-website">
          Website
        </Label>

        <Input
          id="school-website"
          type="url"
          value={website}
          onChange={(event) =>
            setWebsite(event.target.value)
          }
          placeholder="https://example.com"
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="school-logo">
          Logo URL
        </Label>

        <Input
          id="school-logo"
          type="url"
          value={logoUrl}
          onChange={(event) =>
            setLogoUrl(event.target.value)
          }
          placeholder="https://..."
        />

        <p className="text-xs text-muted-foreground">
          Logo upload/storage can be added separately later.
        </p>
      </div>

      <Button
        type="submit"
        disabled={saving}
      >
        {saving && (
          <Loader2 className="mr-2 size-4 animate-spin" />
        )}

        {saving
          ? "Saving..."
          : "Save School Information"}
      </Button>
    </form>
  );
}