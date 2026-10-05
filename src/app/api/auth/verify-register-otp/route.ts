import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    const { email, code } = await req.json();

    if (!email || !code) {
      return NextResponse.json(
        { error: "Email and OTP code are required." },
        { status: 400 }
      );
    }

    const user = await db.user.findUnique({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      return NextResponse.json(
        { error: "Account not found." },
        { status: 404 }
      );
    }

    if (user.emailVerified) {
      return NextResponse.json({
        ok: true,
        message: "Email already verified.",
      });
    }

    const record = await db.emailToken.findFirst({
      where: {
        userId: user.id,
        token: String(code).trim(),
        expiresAt: { gt: new Date() },
      },
      orderBy: { expiresAt: "desc" },
    });

    if (!record) {
      return NextResponse.json(
        { error: "Invalid or expired OTP." },
        { status: 400 }
      );
    }

    await db.user.update({
      where: { id: user.id },
      data: { emailVerified: true },
    });

    await db.emailToken.deleteMany({
      where: { userId: user.id },
    });

    return NextResponse.json({
      ok: true,
      message: "Email verified! You can log in now.",
    });
  } catch (error) {
    console.error("Verify registration OTP error:", error);

    return NextResponse.json(
      { error: "Verification failed. Please try again." },
      { status: 500 }
    );
  }
}
