"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

type Props = {
  next?: string;
  message?: string;
  error?: string;
  verified?: string;
};

export default function LoginForm({
  next,
  message,
  error,
  verified,
}: Props) {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [err, setErr] = useState(error || "");
  const [unverified, setUnverified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resent, setResent] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    setErr("");
    setUnverified(false);

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (res.ok) {
      router.push(next || (data.isAdmin ? "/admin" : "/"));
      router.refresh();
      return;
    }

    if (data.unverified) {
      setUnverified(true);
    }

    setErr(data.error || "Login failed. Try again.");
  }

  async function resend() {
    const res = await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
      }),
    });

    if (res.ok) {
      setResent(true);
    }
  }

  return (
    <form
      onSubmit={submit}
      className="mt-8 space-y-5 bg-white rounded-2xl p-8 shadow-card"
    >
      {message && (
        <p className="bg-gold/10 text-gold-dark text-sm rounded-lg p-3">
          {message}
        </p>
      )}

      {verified && (
        <p className="bg-emerald/10 text-emerald text-sm rounded-lg p-3">
          Email verified! You can log in now.
        </p>
      )}

      {err && (
        <p className="bg-maroon/10 text-maroon text-sm rounded-lg p-3">
          {err}
        </p>
      )}

      <div>
        <label className="label-luxe">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="input-luxe"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1">
          <label className="label-luxe">Password</label>

          <Link
            href="/forgot-password"
            className="text-xs text-gold-dark font-semibold hover:underline"
          >
            Forgot Password?
          </Link>
        </div>

        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-luxe pr-20"
          />

          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gold-dark font-semibold hover:underline"
          >
            {showPassword ? "Hide" : "Show"}
          </button>
        </div>
      </div>

      {unverified && (
        <div className="bg-gold/10 rounded-lg p-4 text-sm">
          <p className="mb-2">Your email isn't verified yet.</p>

          <button
            type="button"
            onClick={resend}
            className="text-gold-dark font-semibold hover:underline"
          >
            {resent
              ? "Sent! Check your email."
              : "Resend verification email"}
          </button>
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="btn-gold w-full"
      >
        {loading ? "Logging in..." : "Log In"}
      </button>

      <p className="text-center text-sm text-emerald/70">
        New here?{" "}
        <Link
          href={`/register${
            next ? `?next=${encodeURIComponent(next)}` : ""
          }`}
          className="text-gold-dark font-semibold hover:underline"
        >
          Create an account
        </Link>
      </p>
    </form>
  );
}
