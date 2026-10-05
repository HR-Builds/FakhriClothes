import { NextRequest, NextResponse } from "next/server";
import { requireAdmin, AuthError } from "@/lib/auth";
import { db } from "@/lib/db";

export async function POST(req: NextRequest) {
  try {
    await requireAdmin();

    const { banners, featuredIds, storyTitle, storyText } = await req.json();

    if (!Array.isArray(banners) || !Array.isArray(featuredIds)) {
      return NextResponse.json(
        { error: "Invalid data format." },
        { status: 400 }
      );
    }

    const content = await db.homepageContent.upsert({
      where: { id: 1 },
      update: {
        banners: JSON.stringify(banners),
        featuredProductIds: JSON.stringify(featuredIds),
        storyTitle: storyTitle || "",
        storyText: storyText || "",
      },
      create: {
        id: 1,
        banners: JSON.stringify(banners),
        featuredProductIds: JSON.stringify(featuredIds),
        storyTitle: storyTitle || "",
        storyText: storyText || "",
      },
    });

    return NextResponse.json({
      ok: true,
      content,
    });
  } catch (e) {
    console.error("ADMIN CONTENT SAVE ERROR:", e);

    if (e instanceof AuthError) {
      return NextResponse.json(
        { error: e.message },
        { status: e.status }
      );
    }

    return NextResponse.json(
      { error: "Server error while saving homepage content." },
      { status: 500 }
    );
  }
}