import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signToken, AUTH_COOKIE } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const { email, password } = await req.json();
  if (!email || !password) {
    return NextResponse.json({ error: "Email and password are required." }, { status: 400 });
  }

  const user = await db.user.findUnique({ where: { email: email.toLowerCase() } });
  if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
    return NextResponse.json({ error: "Invalid email or password." }, { status: 401 });
  }
  // PRD §4: verified email required before login
  if (!user.emailVerified) {
    return NextResponse.json({ error: "Please verify your email first.", unverified: true }, { status: 403 });
  }

  const res = NextResponse.json({ ok: true, isAdmin: user.isAdmin });
  res.cookies.set(AUTH_COOKIE, signToken({ userId: user.id, isAdmin: user.isAdmin }), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}