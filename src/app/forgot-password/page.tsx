"use client";

import { useState } from "react";
import Link from "next/link";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] =
    useState("");

  const [step, setStep] = useState<"email" | "reset">(
    "email"
  );
  const [showPassword, setShowPassword] =
    useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  async function sendOtp(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setLoading(true);
    setError("");
    setMessage("");

    try {
      const res = await fetch(
        "/api/auth/forgot-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ email }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error ||
            "Could not send reset OTP."
        );
        return;
      }

      setMessage(
        "If an account exists with this email, a reset OTP has been sent. Please check your inbox and Spam/Trash folder."
      );

      setStep("reset");
    } catch {
      setError(
        "Could not send reset OTP. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  async function resetPassword(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    setError("");
    setMessage("");

    if (code.trim().length !== 6) {
      setError("Please enter the 6-digit OTP.");
      return;
    }

    if (password.length < 6) {
      setError(
        "New password must be at least 6 characters."
      );
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch(
        "/api/auth/reset-password",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            code,
            password,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setError(
          data.error ||
            "Could not reset password."
        );
        return;
      }

      setMessage(
        "Password reset successfully. You can log in now."
      );

      setTimeout(() => {
        window.location.href = "/login";
      }, 1200);
    } catch {
      setError(
        "Could not reset password. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="section-title text-center">
        Forgot Password
      </h1>

      <span className="gold-underline mx-auto" />

      <div className="mt-8 bg-white rounded-2xl p-8 shadow-card">
        {message && (
          <p className="bg-emerald/10 text-emerald text-sm rounded-lg p-3 mb-5">
            {message}
          </p>
        )}

        {error && (
          <p className="bg-maroon/10 text-maroon text-sm rounded-lg p-3 mb-5">
            {error}
          </p>
        )}

        {step === "email" ? (
          <form
            onSubmit={sendOtp}
            className="space-y-5"
          >
            <p className="text-sm text-emerald/70">
              Enter your registered email address and
              we'll send you a 6-digit password reset OTP.
            </p>

            <div>
              <label className="label-luxe">
                Email
              </label>

              <input
                type="email"
                required
                value={email}
                onChange={(e) =>
                  setEmail(e.target.value)
                }
                className="input-luxe"
                placeholder="you@example.com"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full"
            >
              {loading
                ? "Sending..."
                : "Send Reset OTP"}
            </button>
          </form>
        ) : (
          <form
            onSubmit={resetPassword}
            className="space-y-5"
          >
            <div>
              <label className="label-luxe">
                Email
              </label>

              <input
                type="email"
                value={email}
                readOnly
                className="input-luxe bg-emerald/5"
              />
            </div>

            <div>
              <label className="label-luxe">
                6-Digit OTP
              </label>

              <input
                type="text"
                required
                value={code}
                onChange={(e) =>
                  setCode(
                    e.target.value
                      .replace(/\D/g, "")
                      .slice(0, 6)
                  )
                }
                inputMode="numeric"
                maxLength={6}
                className="input-luxe tracking-[0.4em]"
                placeholder="123456"
              />

              <span className="block text-emerald/60 mt-2 text-xs">
                If you haven't received the OTP, please
                check your Spam or Trash folder.
              </span>
            </div>

            <div>
              <label className="label-luxe">
                New Password
              </label>

              <div className="relative">
                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
                  value={password}
                  onChange={(e) =>
                    setPassword(e.target.value)
                  }
                  className="input-luxe pr-20"
                  placeholder="At least 6 characters"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gold-dark font-semibold hover:underline"
                >
                  {showPassword
                    ? "Hide"
                    : "Show"}
                </button>
              </div>
            </div>

            <div>
              <label className="label-luxe">
                Confirm New Password
              </label>

              <input
                type={
                  showPassword
                    ? "text"
                    : "password"
                }
                required
                value={confirmPassword}
                onChange={(e) =>
                  setConfirmPassword(
                    e.target.value
                  )
                }
                className="input-luxe"
                placeholder="Enter password again"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="btn-gold w-full"
            >
              {loading
                ? "Resetting..."
                : "Reset Password"}
            </button>
          </form>
        )}

        <p className="text-center text-sm text-emerald/70 mt-6">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-gold-dark font-semibold hover:underline"
          >
            Log In
          </Link>
        </p>
      </div>
    </div>
  );
}
