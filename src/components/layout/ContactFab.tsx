export default function ContactFab() {
  const phone = process.env.NEXT_PUBLIC_OWNER_PHONE || "923213611921";
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-3">
      <a href={`https://wa.me/${phone}?text=Hello%20Hatim%2C%20I%20have%20a%20question%20about%20Fakhri%20Clothes`}
        target="_blank" rel="noreferrer" aria-label="WhatsApp the owner" title="WhatsApp Hatim Hussain"
        className="w-14 h-14 rounded-full bg-[#25D366] text-white flex items-center justify-center text-2xl shadow-luxe hover:scale-110 transition-transform">
        ✆
      </a>
      <a href={`tel:+${phone}`} aria-label="Call the owner" title="Call Hatim Hussain"
        className="w-14 h-14 rounded-full bg-gold text-emerald flex items-center justify-center text-2xl shadow-luxe hover:scale-110 transition-transform">
        ☎
      </a>
    </div>
  );
}