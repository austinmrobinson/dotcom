"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Heading, Text } from "../components/text";
import TextInput, { PasswordInput } from "../components/input";
import { Button, IconButton } from "../components/ui/button";
import { RiDeleteBinLine, RiAddLine, RiKeyLine } from "@remixicon/react";
import { toast } from "sonner";
import { Toaster } from "../components/ui/sonner";
import { MIN_PASSWORD_LENGTH } from "../utils/constants";

interface StoredPassword {
  id: string;
  label?: string;
  createdAt: string;
}

export default function AdminPage() {
  const [apiKey, setApiKey] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [passwords, setPasswords] = useState<StoredPassword[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showApiKey, setShowApiKey] = useState(false);

  // Add password dialog
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [newLabel, setNewLabel] = useState("");
  const [adding, setAdding] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  // Delete confirmation dialog
  const [passwordToDelete, setPasswordToDelete] = useState<StoredPassword | null>(null);
  const [deleting, setDeleting] = useState(false);

  async function authenticate() {
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/admin/passwords", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });

      if (res.ok) {
        setIsAuthenticated(true);
        // Note: API key is kept in memory only for security - no localStorage
        const data = await res.json();
        setPasswords(data.passwords || []);
      } else {
        setError("Invalid API key");
      }
    } catch (e) {
      setError("Failed to authenticate");
    }

    setLoading(false);
  }

  async function fetchPasswords() {
    try {
      const res = await fetch("/api/admin/passwords", {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (res.ok) {
        const data = await res.json();
        setPasswords(data.passwords || []);
      }
    } catch (e) {
      console.error("Failed to fetch passwords");
    }
  }

  async function addPassword() {
    if (!newPassword) return;

    setAdding(true);
    setError("");

    const passwordToAdd = newPassword;

    try {
      const res = await fetch("/api/admin/passwords", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          password: passwordToAdd,
          label: newLabel || undefined,
        }),
      });

      if (res.ok) {
        // Copy password to clipboard
        await navigator.clipboard.writeText(passwordToAdd);
        toast.success("Password added and copied to clipboard");

        setNewPassword("");
        setNewLabel("");
        setShowAddDialog(false);
        await fetchPasswords();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to add password");
      }
    } catch (e) {
      setError("Failed to add password");
    }

    setAdding(false);
  }

  async function confirmDelete() {
    if (!passwordToDelete) return;

    setDeleting(true);
    try {
      const res = await fetch("/api/admin/passwords", {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: passwordToDelete.id }),
      });

      if (res.ok) {
        await fetchPasswords();
        setPasswordToDelete(null);
      } else {
        const data = await res.json();
        setError(data.error || "Failed to delete password");
      }
    } catch (e) {
      setError("Failed to delete password");
    }
    setDeleting(false);
  }

  // API key is intentionally not persisted for security reasons.
  // Users must re-enter it on each session.

  if (!isAuthenticated) {
    return (
      <div className="flex flex-col justify-center gap-10 w-full max-w-[364px] sm:max-w-[264px] grow mx-auto mb-32 px-4">
        <div className="flex flex-col gap-5 items-center text-center">
          <div className="p-3 size-12 rounded-full bg-overlay-light flex items-center justify-center">
            <RiKeyLine size={20} />
          </div>
          <div className="flex flex-col gap-1">
            <Heading size="h3" as="h1">
              Admin Access
            </Heading>
            <Text>Enter your admin API key</Text>
          </div>
        </div>

        <form
          onSubmit={(e) => {
            e.preventDefault();
            authenticate();
          }}
          className="flex flex-col gap-4"
        >
          <PasswordInput
            id="apiKey"
            label="API Key"
            hiddenLabel
            show={showApiKey}
            setShow={setShowApiKey}
            value={apiKey}
            placeholder="Enter API Key"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
              setApiKey(e.target.value)
            }
          />
          {error && (
            <Text className="text-destructive text-sm">
              {error}
            </Text>
          )}
          <Button type="submit" disabled={loading || !apiKey}>
            {loading ? "Checking..." : "Continue"}
          </Button>
        </form>
      </div>
    );
  }

  return (
    <>
      <Toaster position="bottom-center" />
      <div className="flex flex-col w-full max-w-md grow mx-auto mb-32 px-4 pt-8">
        <div className="flex flex-col gap-8">
        <Heading size="h2" as="h1">
          Password Management
        </Heading>

        {error && (
          <div className="p-3 rounded-lg bg-destructive/10">
            <Text className="text-destructive">{error}</Text>
          </div>
        )}

        {/* Passwords List */}
        {passwords.length === 0 ? (
          <div className="flex flex-col items-center gap-4 py-8 rounded-lg border border-border">
            <Text className="text-muted-foreground">No passwords configured</Text>
            <Button onClick={() => setShowAddDialog(true)}>
              <RiAddLine data-icon="inline-start" />
              Add Password
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <Heading size="h4" as="h2">
                Active Passwords ({passwords.length})
              </Heading>
              <Button onClick={() => setShowAddDialog(true)}>
                <RiAddLine data-icon="inline-start" />
                Add Password
              </Button>
            </div>
            <div className="flex flex-col gap-2">
              {passwords.map((pw) => (
                <div
                  key={pw.id}
                  className="flex items-center justify-between p-3 rounded-lg border border-border"
                >
                  <div className="flex flex-col gap-0.5">
                    <Text weight="medium" contrast="high">
                      {pw.label || "Unlabeled"}
                    </Text>
                    <Text size="caption" className="text-muted-foreground">
                      Created: {new Date(pw.createdAt).toLocaleDateString()}
                    </Text>
                  </div>
                  <IconButton
                    variant="text"
                    size="medium"
                    label="Delete password"
                    className="text-destructive hover:text-destructive/80 hover:before:bg-destructive/10"
                    onClick={() => setPasswordToDelete(pw)}
                  >
                    <RiDeleteBinLine size={18} />
                  </IconButton>
                </div>
              ))}
            </div>
          </div>
        )}

        <Button
          variant="destructive"
          onClick={() => {
            setIsAuthenticated(false);
            setApiKey("");
          }}
        >
          Logout
        </Button>
      </div>
    </div>

      {/* Add Password Dialog */}
      <Dialog
        open={showAddDialog}
        onOpenChange={(open) => {
          setShowAddDialog(open);
          if (!open) {
            setNewPassword("");
            setNewLabel("");
            setShowNewPassword(false);
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Add Password</DialogTitle>
            <DialogDescription>
              Add a new password. It will be copied to your clipboard when saved.
            </DialogDescription>
          </DialogHeader>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              addPassword();
            }}
            className="flex flex-col gap-4"
          >
            <PasswordInput
              id="newPassword"
              label="Password"
              hiddenLabel
              show={showNewPassword}
              setShow={setShowNewPassword}
              value={newPassword}
              placeholder="Password (min 8 characters)"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewPassword(e.target.value)
              }
            />
            <TextInput
              id="newLabel"
              label="Label"
              hiddenLabel
              type="text"
              value={newLabel}
              placeholder="Label (optional)"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                setNewLabel(e.target.value)
              }
            />
            {newPassword && newPassword.length < MIN_PASSWORD_LENGTH && (
              <Text className="text-amber-600 dark:text-amber-400 text-sm">
                Password must be at least {MIN_PASSWORD_LENGTH} characters
              </Text>
            )}
            <DialogFooter>
              <Button
                variant="ghost"
                type="button"
                onClick={() => setShowAddDialog(false)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={adding || !newPassword || newPassword.length < MIN_PASSWORD_LENGTH}
              >
                {adding ? "Adding..." : "Add Password"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={!!passwordToDelete}
        onOpenChange={(open) => !open && setPasswordToDelete(null)}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Delete Password</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete{" "}
              <span className="font-medium text-foreground">
                {passwordToDelete?.label || "this password"}
              </span>
              ? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setPasswordToDelete(null)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDelete}
              disabled={deleting}
            >
              {deleting ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
