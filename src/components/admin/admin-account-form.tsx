"use client";

import { useState } from "react";
import { Eye, EyeOff, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type User = {
  id: string;
  name: string;
  email: string;
};

type Props = {
  user: User;
};

export function AdminAccountForm({ user }: Props) {
  const [name, setName] = useState(user.name);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [savingAccount, setSavingAccount] = useState(false);
  const [changingPassword, setChangingPassword] =
    useState(false);

  const [accountMessage, setAccountMessage] = useState("");
  const [accountError, setAccountError] = useState("");

  const [passwordMessage, setPasswordMessage] =
    useState("");
  const [passwordError, setPasswordError] = useState("");

  async function updateAccount(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    try {
      setSavingAccount(true);
      setAccountError("");
      setAccountMessage("");

      const response = await fetch("/api/admin/settings", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          section: "account",
          name: name.trim(),
        }),
      });

      const text = await response.text();

      let data: { error?: string } = {};

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
          data.error || "Unable to update account.",
        );
      }

      setAccountMessage(
        "Administrator information saved successfully.",
      );
    } catch (error) {
      setAccountError(
        error instanceof Error
          ? error.message
          : "Unable to update account.",
      );
    } finally {
      setSavingAccount(false);
    }
  }

  async function changePassword(
    event: React.FormEvent<HTMLFormElement>,
  ) {
    event.preventDefault();

    setPasswordError("");
    setPasswordMessage("");

    if (!currentPassword) {
      setPasswordError(
        "Please enter your current password.",
      );
      return;
    }

    if (newPassword.length < 8) {
      setPasswordError(
        "New password must be at least 8 characters.",
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError(
        "New password and confirmation do not match.",
      );
      return;
    }

    try {
      setChangingPassword(true);

      const response = await fetch(
        "/api/admin/settings",
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            section: "password",
            currentPassword,
            newPassword,
          }),
        },
      );

      const text = await response.text();

      let data: { error?: string } = {};

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
            "Unable to change password.",
        );
      }

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");

      setPasswordMessage(
        "Password changed successfully.",
      );
    } catch (error) {
      setPasswordError(
        error instanceof Error
          ? error.message
          : "Unable to change password.",
      );
    } finally {
      setChangingPassword(false);
    }
  }

  return (
    <div className="space-y-8">
      {/* Account Information */}
      <form
        onSubmit={updateAccount}
        className="space-y-5"
      >
        {accountError && (
          <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {accountError}
          </div>
        )}

        {accountMessage && (
          <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
            {accountMessage}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="admin-name">
            Name
          </Label>

          <Input
            id="admin-name"
            value={name}
            onChange={(event) =>
              setName(event.target.value)
            }
            required
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="admin-email">
            Login Email
          </Label>

          <Input
            id="admin-email"
            value={user.email}
            disabled
          />

          <p className="text-xs text-muted-foreground">
            This email is used to sign in and cannot
            be changed here.
          </p>
        </div>

        <Button
          type="submit"
          disabled={savingAccount}
        >
          {savingAccount && (
            <Loader2 className="mr-2 size-4 animate-spin" />
          )}

          {savingAccount
            ? "Saving..."
            : "Save Account"}
        </Button>
      </form>

      {/* Password */}
      <div className="border-t pt-6">
        <div className="mb-5">
          <h3 className="font-semibold">
            Change Password
          </h3>

          <p className="mt-1 text-sm text-muted-foreground">
            Update the password used to access the
            administrator account.
          </p>
        </div>

        <form
          onSubmit={changePassword}
          className="space-y-5"
        >
          {passwordError && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {passwordError}
            </div>
          )}

          {passwordMessage && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
              {passwordMessage}
            </div>
          )}

          <PasswordField
            id="current-password"
            label="Current Password"
            value={currentPassword}
            onChange={setCurrentPassword}
            visible={showCurrent}
            onToggle={() =>
              setShowCurrent((value) => !value)
            }
          />

          <PasswordField
            id="new-password"
            label="New Password"
            value={newPassword}
            onChange={setNewPassword}
            visible={showNew}
            onToggle={() =>
              setShowNew((value) => !value)
            }
          />

          <PasswordField
            id="confirm-password"
            label="Confirm New Password"
            value={confirmPassword}
            onChange={setConfirmPassword}
            visible={showConfirm}
            onToggle={() =>
              setShowConfirm((value) => !value)
            }
          />

          <p className="text-xs text-muted-foreground">
            Password must contain at least 8 characters.
          </p>

          <Button
            type="submit"
            variant="outline"
            disabled={changingPassword}
          >
            {changingPassword && (
              <Loader2 className="mr-2 size-4 animate-spin" />
            )}

            {changingPassword
              ? "Changing Password..."
              : "Change Password"}
          </Button>
        </form>
      </div>
    </div>
  );
}

function PasswordField({
  id,
  label,
  value,
  onChange,
  visible,
  onToggle,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>

      <div className="relative">
        <Input
          id={id}
          type={visible ? "text" : "password"}
          value={value}
          onChange={(event) =>
            onChange(event.target.value)
          }
          className="pr-11"
          autoComplete="new-password"
        />

        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
          aria-label={
            visible
              ? `Hide ${label}`
              : `Show ${label}`
          }
        >
          {visible ? (
            <EyeOff className="size-4" />
          ) : (
            <Eye className="size-4" />
          )}
        </button>
      </div>
    </div>
  );
}