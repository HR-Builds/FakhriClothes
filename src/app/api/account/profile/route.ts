import { NextRequest, NextResponse } from "next/server";
import { requireUser, AuthError } from "@/lib/auth";
import { db } from "@/lib/db";
import { isValidPKPhone, normalizePhone } from "@/lib/utils";

export async function PATCH(req: NextRequest) {
  try {
    const user = await requireUser();
    const { name, phone } = await req.json();
    if (!name?.trim()) return NextResponse.json({ error: "Name is required." }, { status: 400 });

    let normalizedPhone: string | undefined;
    if (phone?.trim()) {
      normalizedPhone = normalizePhone(phone);
      if (!isValidPKPhone(normalizedPhone)) {
        return NextResponse.json({ error: "Invalid Pakistani phone number (03XXXXXXXXX)." }, { status: 400 });
      }
    }
    await db.user.update({ where: { id: user.id }, data: { name: name.trim(), ...(normalizedPhone ? { phone: normalizedPhone } : {}) } });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}