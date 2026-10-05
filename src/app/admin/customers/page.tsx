import { db } from "@/lib/db";
import { formatPKR } from "@/lib/utils";

export const dynamic = "force-dynamic";

export default async function AdminCustomers() {
  const customers = await db.user.findMany({
    where: { isAdmin: false },
    include: { orders: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div>
      <h1 className="font-serif text-3xl mb-8">Customers</h1>
      <div className="bg-white rounded-2xl shadow-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="admin-table w-full min-w-[600px]">
            <thead><tr><th>Name</th><th>Email</th><th>Phone</th><th>Orders</th><th>Total Spent</th><th>Joined</th></tr></thead>
            <tbody>
              {customers.map((c) => {
                const paid = c.orders.filter((o) => o.paymentStatus === "SUCCESS");
                return (
                  <tr key={c.id}>
                    <td className="font-medium">{c.name}{!c.emailVerified && <span className="ml-2 text-xs text-gold-dark">(unverified)</span>}</td>
                    <td>{c.email}</td>
                    <td>{c.phone || "—"}</td>
                    <td>{paid.length}</td>
                    <td>{formatPKR(paid.reduce((s, o) => s + o.total, 0))}</td>
                    <td>{new Date(c.createdAt).toLocaleDateString("en-PK")}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        {customers.length === 0 && <p className="p-8 text-center text-emerald/50">No customers yet.</p>}
      </div>
    </div>
  );
}