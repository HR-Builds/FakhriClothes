import { PrismaClient } from "@prisma/client";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";
import bcrypt from "bcryptjs";
import "dotenv/config";

const databaseUrl = process.env.DATABASE_URL;

if (!databaseUrl) {
  throw new Error("DATABASE_URL is not defined");
}

const adapter = new PrismaBetterSqlite3({
  url: databaseUrl,
});

const db = new PrismaClient({
  adapter,
});

const img = (seed: string) => [
  `https://picsum.photos/seed/${seed}a/800/1000`,
  `https://picsum.photos/seed/${seed}b/800/1000`,
  `https://picsum.photos/seed/${seed}c/800/1000`,
];

async function main() {
  await db.user.upsert({
    where: { email: "fakhriclothes53@gmail.com" },
    update: {},
    create: {
      name: "Hatim Hussain",
      email: "fakhriclothes53@gmail.com",
      passwordHash: await bcrypt.hash("Admin@123", 10),
      emailVerified: true,
      isAdmin: true,
      phone: "03213611921",
    },
  });

  await db.user.upsert({
    where: { email: "demo@example.com" },
    update: {},
    create: {
      name: "Demo Customer",
      email: "demo@example.com",
      phone: "03001234567",
      passwordHash: await bcrypt.hash("Demo@123", 10),
      emailVerified: true,
    },
  });

  const products = [
    {
      name: "Zeenat Emerald",
      collectionName: "Zeenat",
      category: "three-piece",
      price: 8490,
      fabric: "Premium Lawn",
      stockQty: 12,
      featured: true,
    },
    {
      name: "Zeenat Gold",
      collectionName: "Zeenat",
      category: "three-piece",
      price: 8990,
      fabric: "Premium Lawn",
      stockQty: 8,
      featured: true,
    },
    {
      name: "Zeenat Maroon",
      collectionName: "Zeenat",
      category: "three-piece",
      price: 8790,
      fabric: "Cambric",
      stockQty: 0,
      featured: false,
    },
    {
      name: "Mehr Ivory",
      collectionName: "Mehr",
      category: "two-piece",
      price: 5490,
      fabric: "Lawn",
      stockQty: 20,
      featured: true,
    },
    {
      name: "Mehr Sage",
      collectionName: "Mehr",
      category: "two-piece",
      price: 5290,
      fabric: "Lawn",
      stockQty: 15,
      featured: false,
    },
    {
      name: "Mehr Rose",
      collectionName: "Mehr",
      category: "two-piece",
      price: 5690,
      fabric: "Cambric",
      stockQty: 10,
      featured: false,
    },
    {
      name: "Noor Onyx",
      collectionName: "Noor",
      category: "one-piece",
      price: 2890,
      fabric: "Lawn Shirt",
      stockQty: 30,
      featured: true,
    },
    {
      name: "Noor Pearl",
      collectionName: "Noor",
      category: "one-piece",
      price: 2690,
      fabric: "Lawn Shirt",
      stockQty: 25,
      featured: false,
    },
    {
      name: "Noor Azure",
      collectionName: "Noor",
      category: "one-piece",
      price: 2990,
      fabric: "Cotton Shirt",
      stockQty: 18,
      featured: false,
    },
    {
      name: "Gulbahar Regal",
      collectionName: "Gulbahar",
      category: "three-piece",
      price: 12990,
      fabric: "Embroidered Chiffon",
      stockQty: 6,
      featured: true,
    },
    {
      name: "Gulbahar Rose Dust",
      collectionName: "Gulbahar",
      category: "three-piece",
      price: 12490,
      fabric: "Embroidered Chiffon",
      stockQty: 9,
      featured: false,
    },
    {
      name: "Gulbahar Midnight",
      collectionName: "Gulbahar",
      category: "three-piece",
      price: 11990,
      fabric: "Velvet Blend",
      stockQty: 4,
      featured: false,
    },
  ];

  for (const p of products) {
    const slug = p.name.toLowerCase().replace(/\s+/g, "-");

    await db.product.upsert({
      where: { slug },
      update: {},
      create: {
        ...p,
        slug,
        images: JSON.stringify(img(slug)),
        description:
          `${p.name} from the ${p.collectionName} collection — ${p.fabric}. ` +
          `Unstitched ${p.category.replace("-", " ")} for women who love refined, ` +
          `elegant dressing. Includes matching accessories as pictured.`,
      },
    });
  }

  const all = await db.product.findMany({
    where: { featured: true },
  });

  await db.homepageContent.upsert({
    where: { id: 1 },
    update: {},
    create: {
      banners: JSON.stringify([
        {
          title: "The Zeenat Collection",
          subtitle: "Jewel-toned luxury, unstitched.",
          image: "https://picsum.photos/seed/banner1/1600/800",
          cta: "/category/three-piece",
        },
        {
          title: "Everyday Elegance",
          subtitle: "1-Piece essentials from PKR 2,690",
          image: "https://picsum.photos/seed/banner2/1600/800",
          cta: "/category/one-piece",
        },
      ]),
      featuredProductIds: JSON.stringify(all.map((p) => p.id)),
      storyTitle: "The Fakhri Story",
      storyText:
        "Fakhri Clothes brings the richness of Pakistani craftsmanship " +
        "to unstitched women's wear — premium fabrics, jewel tones, and " +
        "timeless silhouettes delivered to your doorstep.",
    },
  });

  console.log(
    "✅ Seed complete. Admin: fakhriclothes53@gmail.com / Admin@123"
  );
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
