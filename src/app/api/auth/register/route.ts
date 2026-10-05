import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import {
  isValidEmail,
  normalizePhone,
  isValidPKPhone,
} from "@/lib/utils";
import {
  sendOtpEmail,
  sendNewRegistrationEmail,
} from "@/lib/email";
import { generateOtp } from "@/lib/otp";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password } =
      await req.json();

    if (!name || !email || !password) {
      return NextResponse.json(
        {
          error:
            "Name, email and password are required.",
        },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "Invalid email address." },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        {
          error:
            "Password must be at least 6 characters.",
        },
        { status: 400 }
      );
    }

    const normalizedPhone = phone
      ? normalizePhone(phone)
      : null;

    if (
      normalizedPhone &&
      !isValidPKPhone(normalizedPhone)
    ) {
      return NextResponse.json(
        {
          error:
            "Phone must be a valid Pakistani number (03XXXXXXXXX).",
        },
        { status: 400 }
      );
    }

    const normalizedEmail =
      email.trim().toLowerCase();

    const existing = await db.user.findUnique({
      where: { email: normalizedEmail },
    });

    if (existing) {
      return NextResponse.json(
        {
          error:
            "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    const user = await db.user.create({
      data: {
        name: name.trim(),
        email: normalizedEmail,
        phone: normalizedPhone,
        passwordHash: await bcrypt.hash(
          password,
          10
        ),
      },
    });

    const code = generateOtp();

    await db.emailToken.create({
      data: {
        userId: user.id,
        token: code,
        expiresAt: new Date(
          Date.now() + 10 * 60 * 1000
        ),
      },
    });

    // Send OTP to the new customer.
    await sendOtpEmail(user.email, code);

    // Notify the admin about the new registration.
    // Do not fail registration if admin notification fails.
    await sendNewRegistrationEmail(
      user.name,
      user.email
    ).catch((error) => {
      console.error(
        "Admin registration notification failed:",
        error
      );
    });

    return NextResponse.json(
      {
        message:
          "Account created! We've sent a 6-digit OTP to your email.",
      },
      { status: 201 }
    );
  } catch (error) {
    console.error(
      "Registration error:",
      error
    );

    return NextResponse.json(
      {
        error:
          "Registration failed. Please try again.",
      },
      { status: 500 }
    );
  }
}
