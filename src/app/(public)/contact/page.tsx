import { OWNER } from "@/lib/constants";

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      <h1 className="section-title">Contact Us</h1>
      <span className="gold-underline mx-auto" />
      <p className="mt-8 text-emerald/70 mb-10">We're happy to help with orders, products, or anything else.</p>
      <div className="bg-white rounded-2xl p-10 shadow-card space-y-6">
        <div>
          <p className="text-xs uppercase tracking-widest text-emerald/50">Owner</p>
          <p className="font-serif text-2xl">{OWNER.name}</p>
          <p className="text-lg text-gold-dark font-semibold">{OWNER.phone}</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <a href={`https://wa.me/923213611921?text=Hello%20Hatim%2C%20I%20have%20a%20question%20about%20Fakhri%20Clothes`} target="_blank" rel="noreferrer" className="btn-gold">
            ✆ WhatsApp Us
          </a>
          <a href="tel:+923213611921" className="btn-outline">☎ Call Now</a>
        </div>
        <p className="text-sm text-emerald/50">Available 7 days a week · Pakistan (PKT)</p>
      </div>
    </div>
  );
}