"use client";
import { useState } from "react";
import Link from "next/link";

export default function RegisterPage() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", password: "", confirm: "" });
  const [step, setStep] = useState<"form" | "otp" | "done">("form");
  const [code, setCode] = useState("");
  const [state, setState] = useState<"idle" | "loading">("idle");
  const [msg, setMsg] = useState("");
  const [isError, setIsError] = useState(false);
  const [resent, setResent] = useState(false);

  const set = (k: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm({ ...form, [k]: e.target.value });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (form.password !== form.confirm) { setIsError(true); setMsg("Passwords do not match."); return; }
    setState("loading"); setIsError(false);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    const data = await res.json();
    setState("idle");
    if (res.ok) { setStep("otp"); setMsg(""); }
    else { setIsError(true); setMsg(data.error || "Registration failed."); }
  }

  async function verify(e: React.FormEvent) {
    e.preventDefault();
    setState("loading"); setIsError(false);
    const res = await fetch("/api/auth/verify-register-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email, code }),
    });
    const data = await res.json();
    setState("idle");
    if (res.ok) setStep("done");
    else { setIsError(true); setMsg(data.error || "Verification failed."); }
  }

  async function resend() {
    await fetch("/api/auth/resend-verification", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: form.email }),
    });
    setResent(true);
  }

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="section-title text-center">
        {step === "form" ? "Create Account" : step === "otp" ? "Verify Your Email" : "All Set!"}
      </h1>
      <span className="gold-underline mx-auto" />

      {step === "form" && (
        <form onSubmit={submit} className="mt-8 space-y-5 bg-white rounded-2xl p-8 shadow-card">
          {isError && <p className="bg-maroon/10 text-maroon text-sm rounded-lg p-3">{msg}</p>}
          <div>
            <label className="label-luxe">Full Name</label>
            <input required value={form.name} onChange={set("name")} className="input-luxe" />
          </div>
          <div>
            <label className="label-luxe">Email</label>
            <input type="email" required value={form.email} onChange={set("email")} className="input-luxe" />
          </div>
          <div>
            <label className="label-luxe">Phone (03XXXXXXXXX)</label>
            <input value={form.phone} onChange={set("phone")} placeholder="03XX XXXXXXX" className="input-luxe" />
          </div>
          <div>
            <label className="label-luxe">Password (min 6 characters)</label>
            <input type="password" required minLength={6} value={form.password} onChange={set("password")} className="input-luxe" />
          </div>
          <div>
            <label className="label-luxe">Confirm Password</label>
            <input type="password" required value={form.confirm} onChange={set("confirm")} className="input-luxe" />
          </div>
          <button type="submit" disabled={state === "loading"} className="btn-gold w-full">
            {state === "loading" ? "Creating…" : "Create Account"}
          </button>
          <p className="text-center text-sm text-emerald/70">
            Already registered?{" "}
            <Link href="/login" className="text-gold-dark font-semibold hover:underline">Log in</Link>
          </p>
        </form>
      )}

      {step === "otp" && (
        <form onSubmit={verify} className="mt-8 space-y-5 bg-white rounded-2xl p-8 shadow-card">
          <p className="text-emerald/70 text-sm">
            We sent a 6-digit OTP to <b>{form.email}</b>. Enter it below to verify your account.
            <span className="block text-emerald/60 mt-2">
  If you haven't received the OTP, please check your Spam or Trash folder.
</span>
            <span className="block text-emerald/40 mt-1">(Dev mode: the OTP prints in your terminal.)</span>
          </p>
          {isError && <p className="bg-maroon/10 text-maroon text-sm rounded-lg p-3">{msg}</p>}
          <div>
            <label className="label-luxe">6-Digit OTP</label>
            <input required value={code} onChange={(e) => setCode(e.target.value)} maxLength={6} inputMode="numeric"
              placeholder="••••••" className="input-luxe text-center text-2xl tracking-[0.5em]" />
          </div>
          <button type="submit" disabled={state === "loading"} className="btn-gold w-full">
            {state === "loading" ? "Verifying…" : "Verify Email"}
          </button>
          <button type="button" onClick={resend} className="btn-outline w-full text-sm">
            {resent ? "✓ OTP Resent!" : "Resend OTP"}
          </button>
        </form>
      )}

      {step === "done" && (
        <div className="mt-8 bg-white rounded-2xl p-8 shadow-card text-center space-y-5">
          <p className="text-4xl">✦</p>
          <p className="text-emerald text-lg">Email verified successfully!</p>
          <p className="text-emerald/70 text-sm">Your account is active. Log in to start shopping.</p>
          <Link href="/login" className="btn-gold w-full">Go to Login</Link>
        </div>
      )}
    </div>
  );
}