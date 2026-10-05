import { NextRequest, NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams;
  const where: Prisma.ProductWhereInput = {};
  if (sp.get("category")) where.category = sp.get("category")!;
  if (sp.get("collection")) where.collectionName = sp.get("collection")!;
  if (sp.get("q")) {
    const q = sp.get("q")!;
    where.OR = [
      { name: { contains: q } },
      { collectionName: { contains: q } },
      { description: { contains: q } },
    ];
  }
  const products = await db.product.findMany({ where, orderBy: { createdAt: "desc" } });
  return NextResponse.json({ products });
}