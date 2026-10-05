import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, code, password } = await req.json();

    if (!email || !code || !password) {
      return NextResponse.json(
        {
          error:
            "Email, OTP code and new password are required.",
        },
        { status: 400 }
      );
    }

    if (String(password).length < 6) {
      return NextResponse.json(
        {
          error:
            "New password must be at least 6 characters.",
        },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email)
      .trim()
      .toLowerCase();

    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Invalid or expired OTP." },
        { status: 400 }
      );
    }

    const record = await db.emailToken.findFirst({
      where: {
        userId: user.id,
        token: String(code).trim(),
        expiresAt: { gt: new Date() },
      },
      orderBy: {
        expiresAt: "desc",
      },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Invalid or expired OTP." },
        { status: 400 }
      );
    }

    const passwordHash = await bcrypt.hash(
      String(password),
      10
    );

    await db.user.update({
      where: { id: user.id },
      data: {
        passwordHash,
      },
    });

    await db.emailToken.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({
      ok: true,
      message:
        "Password reset successfully. You can log in now.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

    return NextResponse.json(
      {
        error:
          "Could not reset password. Please try again.",
      },
      { status: 500 }
    );
  }
}
