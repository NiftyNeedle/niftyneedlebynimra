export interface Review {
  id: string;
  productId: string;
  author: string;
  initials: string;
  rating: number;
  date: string;
  verified: boolean;
  title: string;
  body: string;
  hasPhoto?: boolean;
}

/** Mock reviews keyed loosely by product. Fall back to generic ones. */
export const reviews: Review[] = [
  {
    id: "r1",
    productId: "p1",
    author: "Amelia R.",
    initials: "AR",
    rating: 5,
    date: "2026-05-12",
    verified: true,
    title: "More beautiful than the photos",
    body: "The blush roses are stunning and the craftsmanship is impeccable. It arrived beautifully wrapped and I'll treasure it forever.",
    hasPhoto: true,
  },
  {
    id: "r2",
    productId: "p1",
    author: "Priya S.",
    initials: "PS",
    rating: 5,
    date: "2026-04-28",
    verified: true,
    title: "Perfect anniversary gift",
    body: "My wife adores these. The colours are exactly as pictured and the stems feel sturdy. Highly recommend.",
  },
  {
    id: "r3",
    productId: "p2",
    author: "Jordan M.",
    initials: "JM",
    rating: 5,
    date: "2026-06-02",
    verified: true,
    title: "So soft and cuddly",
    body: "Honey the Bear is even cuter in person. The embroidery is neat and my daughter hasn't let go of it since it arrived.",
    hasPhoto: true,
  },
];

export function getReviewsForProduct(productId: string) {
  const specific = reviews.filter((r) => r.productId === productId);
  return specific.length > 0 ? specific : reviews;
}
