"use client";
import Link from "next/link";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useCart } from "@/store/CartContext";

const NAV = [
  { href: "/category/shirts", label: "UNSTITCHED SHIRTS" },
  { href: "/category/two-piece", label: "2-Piece" },
  { href: "/category/three-piece", label: "3-Piece" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const { count } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-emerald/95 backdrop-blur text-cream shadow-luxe">
      <div className="max-w-7xl mx-auto px-4 flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="font-serif text-2xl md:text-3xl tracking-wide">
          Fakhri <span className="text-gold">Clothes</span>
        </Link>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium tracking-widest uppercase">
          {NAV.map((n) => (
            <Link key={n.href} href={n.href} className="hover:text-gold transition-colors">{n.label}</Link>
          ))}
          <Link href="/search" className="hover:text-gold transition-colors">Search</Link>
          <Link href="/cart" className="relative hover:text-gold transition-colors">
            Cart
            {count > 0 && (
              <span className="absolute -top-2 -right-4 bg-gold text-emerald text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </Link>
          <Link href="/account" className="hover:text-gold transition-colors">Account</Link>
        </nav>
        <button className="md:hidden text-2xl" onClick={() => setOpen(!open)} aria-label="Menu">
          {open ? "✕" : "☰"}
        </button>
      </div>
      <AnimatePresence>
        {open && (
          <motion.nav initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="md:hidden overflow-hidden bg-emerald">
            <div className="flex flex-col px-6 py-4 gap-4 uppercase tracking-widest text-sm">
              {NAV.map((n) => (
                <Link key={n.href} href={n.href} onClick={() => setOpen(false)}>{n.label}</Link>
              ))}
              <Link href="/search" onClick={() => setOpen(false)}>Search</Link>
              <Link href="/cart" onClick={() => setOpen(false)}>Cart ({count})</Link>
              <Link href="/account" onClick={() => setOpen(false)}>Account</Link>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}