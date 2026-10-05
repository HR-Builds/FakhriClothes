import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-emerald text-cream mt-20">
      <div className="max-w-7xl mx-auto px-4 py-14 grid grid-cols-2 md:grid-cols-4 gap-8 text-sm">
        <div>
          <p className="font-serif text-2xl mb-4">Fakhri <span className="text-gold">Clothes</span></p>
          <p className="text-cream/70">Premium unstitched women's wear, delivered across Pakistan.</p>
        </div>
        <div>
          <p className="uppercase tracking-widest text-gold mb-4">Shop</p>
          <ul className="space-y-2 text-cream/80">
            <li><Link href="/category/shirts">unstitched-Shirts</Link></li>
            <li><Link href="/category/two-piece">2-Piece</Link></li>
            <li><Link href="/category/three-piece">3-Piece</Link></li>
          </ul>
        </div>
        <div>
          <p className="uppercase tracking-widest text-gold mb-4">Company</p>
          <ul className="space-y-2 text-cream/80">
            <li><Link href="/about">About Us</Link></li>
            <li><Link href="/contact">Contact Us</Link></li>
            <li><Link href="/returns">Return / Exchange</Link></li>
          </ul>
        </div>
        <div>
          <p className="uppercase tracking-widest text-gold mb-4">Legal</p>
          <ul className="space-y-2 text-cream/80">
            <li><Link href="/privacy">Privacy Policy</Link></li>
            <li><Link href="/terms">Terms & Conditions</Link></li>
          </ul>
        </div>
      </div>
      <p className="text-center text-cream/50 text-xs pb-6">© 2026 Fakhri Clothes. All rights reserved.</p>
    </footer>
  );
}