"use client";
import { useState } from "react";

export default function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    // Stored locally for now — wire to admin mailing list when client chooses a provider
    const list = JSON.parse(localStorage.getItem("fc_newsletter") || "[]");
    list.push(email);
    localStorage.setItem("fc_newsletter", JSON.stringify(list));
    setDone(true);
  }

  return (
    <section className="max-w-3xl mx-auto px-4 py-16 md:py-24 text-center">
      <h2 className="section-title">Join the Fakhri Circle</h2>
      <p className="text-emerald/70 mb-8">Be first to know about new collections and restocks.</p>
      {done ? (
        <p className="btn-emerald">✓ You are on the list!</p>
      ) : (
        <form onSubmit={submit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
            placeholder="Your email address" className="input-luxe flex-1" />
          <button type="submit" className="btn-gold whitespace-nowrap">Subscribe</button>
        </form>
      )}
      <a href={`https://wa.me/${process.env.NEXT_PUBLIC_OWNER_PHONE || "923213611921"}?text=Please%20add%20me%20to%20the%20Fakhri%20Clothes%20updates%20list`}
        target="_blank" rel="noreferrer" className="inline-block mt-4 text-sm text-emerald/60 hover:text-gold-dark transition-colors">
        Or get updates on WhatsApp →
      </a>
    </section>
  );
}