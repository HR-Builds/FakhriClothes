import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { redirect } from "next/navigation";
import CheckoutClient from "@/components/checkout/CheckoutClient";

export const dynamic = "force-dynamic";

export default async function CheckoutPage() {
  const user = await getSessionUser();
  if (!user) return null; // middleware redirects

  const items = await db.cartItem.findMany({
    where: { userId: user.id },
    include: { product: true },
    orderBy: { id: "desc" },
  });
  if (items.length === 0) redirect("/cart");

  const addresses = await db.address.findMany({
    where: { userId: user.id },
    orderBy: { id: "desc" },
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
      <h1 className="section-title">Checkout</h1>
      <span className="gold-underline" />
      <CheckoutClient
        user={{ name: user.name, email: user.email, phone: user.phone || "" }}
        items={items.map((i) => ({
          id: i.id,
          name: i.product.name,
          slug: i.product.slug,
          price: i.product.price,
          qty: i.qty,
        }))}
        savedAddresses={addresses.map((a) => ({
          id: a.id,
          flatNo: a.flatNo,
          buildingName: a.buildingName,
          area: a.area,
          city: a.city,
          zipCode: a.zipCode,
        }))}
      />
    </div>
  );
}