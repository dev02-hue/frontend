// src/slices/CartSlice.ts
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { Cart, CartItem, ShippingAddress } from "../types/Cart";

// Initial state follows the Cart type
const initialState: Cart = {
  cartItems: localStorage.getItem("cartItems")
    ? // biome-ignore lint/style/noNonNullAssertion: <explanation>
      JSON.parse(localStorage.getItem("cartItems")!)
    : [],
  shippingAddress: localStorage.getItem("shippingAddress")
    ? // biome-ignore lint/style/noNonNullAssertion: <explanation>
      JSON.parse(localStorage.getItem("shippingAddress")!)
    : {
        fullName: "",
        address: "",
        city: "",
        country: "",
        postalCode: "",
      },
  paymentMethod: localStorage.getItem("paymentMethod")
    ? // biome-ignore lint/style/noNonNullAssertion: <explanation>
      localStorage.getItem("paymentMethod")!
    : "PayPal",
  itemsPrice: 0,
  shippingPrice: 0,
  taxPrice: 0,
  totalPrice: 0,
  status: "loading",
};

// Create the cart slice
const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    // Action to add item to the cart
    addItemToCart: (state, action: PayloadAction<CartItem>) => {
      const item = action.payload;
      const existItem = state.cartItems.find((x) => x._id === item._id);

      if (existItem) {
        // Increment the quantity of the existing item
        state.cartItems = state.cartItems.map((x) =>
          x._id === existItem._id
            ? { ...x, quantity: x.quantity + item.quantity }
            : x
        );
      } else {
        // Add the new item to the cart
        state.cartItems.push({ ...item, quantity: 1 });
      }

      // Persist the updated cartItems in localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // Action to remove item from the cart
    removeItemFromCart: (state, action: PayloadAction<string>) => {
      state.cartItems = state.cartItems.filter(
        (item) => item._id !== action.payload
      );

      // persist the updated cartItems in localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // Action to update the quantity of an item in the cart
    updateItemQuantity: (
      state,
      action: PayloadAction<{ itemId: string; quantity: number }>
    ) => {
      const { itemId, quantity } = action.payload;
      const existItem = state.cartItems.find((item) => item._id === itemId);

      if (existItem) {
        // Update the quantity, ensuring it's at least 1
        existItem.quantity = quantity > 0 ? quantity : 1;
      }

      // Persist the updated cartItems in localStorage
      localStorage.setItem("cartItems", JSON.stringify(state.cartItems));
    },

    // Action to update the shipping address
    saveShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload;

      // Persist the updated shippingAddress in localStorage
      localStorage.setItem(
        "shippingAddress",
        JSON.stringify(state.shippingAddress)
      );
    },

    // Action to update the payment method
    savePaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;

      // Persist the updated payment method in localStorage
      localStorage.setItem("paymentMethod", state.paymentMethod);
    },

    // Action to reset the cart after order completion
    resetCart: (state) => {
      state.cartItems = [];
      state.itemsPrice = 0;
      state.shippingPrice = 0;
      state.taxPrice = 0;
      state.totalPrice = 0;

      // Clear cart-related data from localStorage
      localStorage.removeItem("cartItems");
      localStorage.removeItem("shippingAddress");
      localStorage.removeItem("paymentMethod");
    },

    // Action to calculate prices
    calculatePrices: (state) => {
      state.itemsPrice = state.cartItems.reduce(
        (acc, item) => acc + item.price * item.quantity,
        0
      );
      state.shippingPrice = state.itemsPrice > 100 ? 0 : 10; // Example calculation
      state.taxPrice = 0.15 * state.itemsPrice;
      state.totalPrice =
        state.itemsPrice + state.shippingPrice + state.taxPrice;
    },
  },
});

// Export the actions
export const {
  addItemToCart,
  removeItemFromCart,
  updateItemQuantity, // New action
  saveShippingAddress,
  savePaymentMethod,
  resetCart,
  calculatePrices,
} = cartSlice.actions;

// Export the reducer to use it in your store
export default cartSlice.reducer;
