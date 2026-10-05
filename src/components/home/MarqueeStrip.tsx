const ITEMS = [
  "Premium Unstitched Wear",
  "Flat Delivery PKR 290 Nationwide",
  "5–6 Business Days Delivery",
  "Bank Card & Online Banking Accepted",
];

export default function MarqueeStrip() {
  const row = [...ITEMS, ...ITEMS];
  return (
    <div className="bg-gold text-emerald py-3 overflow-hidden">
      <div className="flex w-max animate-marquee-slow">
        {[0, 1].map((half) => (
          <div key={half} className="flex">
            {row.map((item, i) => (
              <span key={`${half}-${i}`} className="mx-8 uppercase tracking-widest text-sm font-semibold whitespace-nowrap">
                ✦ {item}
              </span>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}