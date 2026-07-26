export interface Coupon {
  code: string;
  /** Discount as a fraction, e.g. 0.1 = 10% off. */
  rate: number;
  description: string;
}

/** The live coupon codes customers can use at the cart. */
export const COUPONS: Coupon[] = [
  { code: "WELCOME10", rate: 0.1, description: "10% off — welcome discount" },
  { code: "LOVE15", rate: 0.15, description: "15% off your order" },
];

export function findCoupon(code: string): Coupon | undefined {
  const c = code.trim().toUpperCase();
  return COUPONS.find((x) => x.code === c);
}
