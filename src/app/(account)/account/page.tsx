import { getSessionUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { formatPKR, parseJson } from "@/lib/utils";
import Link from "next/link";
import ProfileForm from "@/components/account/ProfileForm";
import AddressManager from "@/components/account/AddressManager";
import LogoutButton from "@/components/account/LogoutButton";

export const dynamic = "force-dynamic";

const STATUS_STYLES: Record<string, string> = {
  PROCESSING: "bg-gold/15 text-gold-dark",
  SHIPPED: "bg-blue-100 text-blue-800",
  DELIVERED: "bg-emerald/15 text-emerald",
};

export default async function AccountPage() {
  const user = await getSessionUser();
  if (!user) return null;

  const [orders, addresses] = await Promise.all([
    db.order.findMany({ where: { userId: user.id }, orderBy: { createdAt: "desc" } }),
    db.address.findMany({ where: { userId: user.id }, orderBy: { id: "desc" } }),
  ]);

  const paidOrders = orders.filter((o) => o.paymentStatus === "SUCCESS");
  const totalSpent = paidOrders.reduce((s, o) => s + o.total, 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 md:py-16">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-10">
        <div>
          <h1 className="section-title">My Account</h1>
          <p className="text-emerald/60">Assalam o alaikum, {user.name}</p>
        </div>
        <LogoutButton />
      </div>

      <div className="grid sm:grid-cols-3 gap-4 mb-10">
        <div className="bg-white rounded-2xl p-6 shadow-card text-center">
          <p className="text-3xl font-serif text-gold-dark">{paidOrders.length}</p>
          <p className="text-sm text-emerald/60 mt-1">Orders</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-card text-center">
          <p className="text-3xl font-serif text-gold-dark">{formatPKR(totalSpent)}</p>
          <p className="text-sm text-emerald/60 mt-1">Total Spent</p>
        </div>
        <div className="bg-white rounded-2xl p-6 shadow-card text-center">
          <p className="text-3xl font-serif text-gold-dark">{addresses.length}</p>
          <p className="text-sm text-emerald/60 mt-1">Saved Addresses</p>
        </div>
      </div>

      {/* Order history */}
      <section className="mb-12">
        <h2 className="font-serif text-2xl mb-6">Order History</h2>
        {orders.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 shadow-card text-center text-emerald/60">
            No orders yet. <Link href="/" className="text-gold-dark font-semibold hover:underline">Start shopping →</Link>
          </div>
        ) : (
          <div className="space-y-3">
            {orders.map((o) => {
              const items = parseJson<{ name: string; qty: number }[]>(o.items, []);
              return (
                <Link key={o.id} href={`/orders/${o.id}`}
                  className="bg-white rounded-2xl p-5 shadow-card flex flex-wrap items-center justify-between gap-3 hover:shadow-luxe transition-shadow">
                  <div>
                    <p className="font-semibold">#{o.id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-emerald/60">
                      {new Date(o.createdAt).toLocaleDateString("en-PK", { day: "numeric", month: "short", year: "numeric" })}
                      {" · "}{items.map((i) => `${i.name} ×${i.qty}`).join(", ").slice(0, 60)}…
                    </p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${STATUS_STYLES[o.orderStatus] || ""}`}>{o.orderStatus}</span>
                    <span className="font-semibold">{formatPKR(o.total)}</span>
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </section>

      <div className="grid md:grid-cols-2 gap-8">
        <ProfileForm name={user.name} phone={user.phone || ""} email={user.email} />
        <AddressManager addresses={addresses.map((a) => ({ id: a.id, flatNo: a.flatNo, buildingName: a.buildingName, area: a.area, city: a.city, zipCode: a.zipCode }))} />
      </div>
    </div>
  );
}