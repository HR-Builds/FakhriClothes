import { NextRequest, NextResponse } from "next/server";
import { requireUser, AuthError } from "@/lib/auth";
import { db } from "@/lib/db";

function handle(e: unknown) {
  if (e instanceof AuthError) return NextResponse.json({ error: e.message }, { status: e.status });
  return NextResponse.json({ error: "Server error" }, { status: 500 });
}

export async function GET() {
  try {
    const user = await requireUser();
    const addresses = await db.address.findMany({ where: { userId: user.id }, orderBy: { id: "desc" } });
    return NextResponse.json({ addresses });
  } catch (e) { return handle(e); }
}

export async function POST(req: NextRequest) {
  try {
    const user = await requireUser();
    const { flatNo, buildingName, area, city, zipCode } = await req.json();
    if (!flatNo?.trim() || !buildingName?.trim() || !area?.trim() || !city?.trim()) {
      return NextResponse.json({ error: "All address fields are required." }, { status: 400 });
    }
    if (!/^\d{5}$/.test(zipCode || "")) {
      return NextResponse.json({ error: "Zip code must be 5 digits." }, { status: 400 });
    }
    const address = await db.address.create({
      data: { userId: user.id, flatNo, buildingName, area, city, zipCode },
    });
    return NextResponse.json({ address }, { status: 201 });
  } catch (e) { return handle(e); }
}

export async function DELETE(req: NextRequest) {
  try {
    const user = await requireUser();
    const { id } = await req.json();
    const address = await db.address.findUnique({ where: { id } });
    if (!address || address.userId !== user.id) {
      return NextResponse.json({ error: "Address not found." }, { status: 404 });
    }
    await db.address.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (e) { return handle(e); }
}