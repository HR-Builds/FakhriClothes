import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendOtpEmail } from "@/lib/email";
import { generateOtp } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();

    const user = await db.user.findUnique({
      where: { email: email?.toLowerCase() },
    });

    // Always respond success to avoid email enumeration.
    if (!user || user.emailVerified) {
      return NextResponse.json({
        message:
          "If an unverified account exists, a new OTP has been sent.",
      });
    }

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
      message: "OTP sent! Check your email.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);

    return NextResponse.json(
      { error: "Could not resend OTP. Please try again." },
      { status: 500 }
    );
  }
}
