import { Order } from "./order"; // Import your Order type

export type CartItem = {
  image: string | undefined;
  slug: string;
  quantity: number;
  countInStock: number;
  price: number;
  _id: string;
  name: string;
};

export type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
};

export type Cart = {
  cartItems: CartItem[];
  shippingAddress: ShippingAddress; // Made optional in case it's not set
  paymentMethod: string; // Made optional
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  status: "idle" | "loading" | "succeeded" | "failed"; // Track order status
  error?: string; // Optionally use a string for error messages
  order?: Order; // Optional order field to hold order details
};
