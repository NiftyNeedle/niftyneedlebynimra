export type OrderStatus =
  | "Order Received"
  | "In Production"
  | "Quality Check"
  | "Packed"
  | "Shipped"
  | "Delivered";

export const orderStages: OrderStatus[] = [
  "Order Received",
  "In Production",
  "Quality Check",
  "Packed",
  "Shipped",
  "Delivered",
];

export interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: number;
  items: { name: string; quantity: number; swatch: string }[];
  tracking?: string;
}

export const orders: Order[] = [
  {
    id: "NN-1042",
    date: "2026-07-10",
    status: "Shipped",
    total: 118,
    tracking: "NN-TRK-88213",
    items: [
      {
        name: "Blush Rose Bouquet",
        quantity: 1,
        swatch: "linear-gradient(135deg,#f3d7d2,#d3a7a1,#c0857e)",
      },
      {
        name: "Mini Strawberry Keychain",
        quantity: 2,
        swatch: "linear-gradient(135deg,#f3d7d2,#c0857e,#8fa57e)",
      },
    ],
  },
  {
    id: "NN-1031",
    date: "2026-06-22",
    status: "Delivered",
    total: 42,
    items: [
      {
        name: "Honey the Bear",
        quantity: 1,
        swatch: "linear-gradient(135deg,#e6dac6,#cbb794,#9c7f5a)",
      },
    ],
  },
  {
    id: "NN-1025",
    date: "2026-07-18",
    status: "In Production",
    total: 82,
    items: [
      {
        name: "Peony Garden Bouquet",
        quantity: 1,
        swatch: "linear-gradient(135deg,#f3d7d2,#e9c9c4,#8fa57e)",
      },
    ],
  },
];

export function getOrder(id: string) {
  return orders.find((o) => o.id === id);
}
