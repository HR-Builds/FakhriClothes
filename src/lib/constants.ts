export const DELIVERY_FEE = Number(process.env.DELIVERY_FEE || 290);

export const CATEGORIES = [
  {
    slug: "shirts",
    label: "Unstitched Shirts",
    desc: "Elegant unstitched shirts for effortless everyday style.",
  },
  {
    slug: "two-piece",
    label: "Unstitched 2-Piece",
    desc: "Refined unstitched 2-piece collections for timeless looks.",
  },
  {
    slug: "three-piece",
    label: "Unstitched 3-Piece",
    desc: "Complete unstitched 3-piece collections crafted for elegance.",
  },
] as const;

export const OWNER = {
  name: process.env.OWNER_NAME || "Hatim Hussain",
  phone: process.env.OWNER_PHONE || "0321-3611921",
  wa: `https://wa.me/${process.env.NEXT_PUBLIC_OWNER_PHONE || "923213611921"}`,
};