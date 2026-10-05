import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendOtpEmail } from "@/lib/email";
import { generateOtp } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    if (!email) {
      return NextResponse.json(
        { error: "Email is required." },
        { status: 400 }
      );
    }

    const normalizedEmail = String(email).trim().toLowerCase();

    const user = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    // Do not reveal whether an email exists.
    if (!user) {
      return NextResponse.json({
        ok: true,
        message:
          "If an account exists with this email, a reset OTP has been sent.",
      });
    }

    // Remove old OTPs for this user.
    await db.emailToken.deleteMany({
      where: { userId: user.id },
    });

    const code = generateOtp();

    await db.emailToken.create({
      data: {
        userId: user.id,
        token: code,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      },
    });

    await sendOtpEmail(user.email, code);

    return NextResponse.json({
      ok: true,
      message:
        "A password reset OTP has been sent to your email.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

    return NextResponse.json(
      {
        error:
          "Could not send reset OTP. Please try again.",
      },
      { status: 500 }
    );
  }
}
