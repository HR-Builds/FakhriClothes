import { requireAdmin } from "@/lib/auth";
import Link from "next/link";

export const dynamic = "force-dynamic";

const LINKS = [
  { href: "/admin/dashboard", label: "Dashboard" },
  { href: "/admin/products", label: "Products" },
  { href: "/admin/orders", label: "Orders" },
  { href: "/admin/customers", label: "Customers" },
  { href: "/admin/reviews", label: "Reviews" },
  { href: "/admin/content", label: "Homepage" },
  { href: "/admin/payments", label: "Payments" },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  await requireAdmin();

  return (
    <div className="min-h-screen bg-cream">
      <div className="bg-emerald text-cream">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/admin/dashboard" className="font-serif text-xl">
            Fakhri <span className="text-gold">Admin</span>
          </Link>
          <Link href="/" className="text-sm hover:text-gold transition-colors">← Storefront</Link>
        </div>
      </div>
      <nav className="bg-white border-b border-emerald/10 sticky top-16 md:top-20 z-40">
        <div className="max-w-7xl mx-auto px-2 flex gap-1 overflow-x-auto">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href}
              className="px-4 py-3 text-sm whitespace-nowrap text-emerald/70 hover:text-emerald border-b-2 border-transparent hover:border-gold transition-colors">
              {l.label}
            </Link>
          ))}
        </div>
      </nav>
      <div className="max-w-7xl mx-auto px-4 py-8">{children}</div>
    </div>
  );
}