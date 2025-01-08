import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

export type ShippingAddress = {
  fullName: string;
  address: string;
  city: string;
  country: string;
  postalCode: string;
};

interface ShippingState {
  shippingAddress: ShippingAddress | null;
}

const initialState: ShippingState = {
  shippingAddress: null,
};

const shippingSlice = createSlice({
  name: "shipping",
  initialState,
  reducers: {
    // Action to set the shipping address
    setShippingAddress: (state, action: PayloadAction<ShippingAddress>) => {
      state.shippingAddress = action.payload;
      localStorage.setItem("shippingAddress", JSON.stringify(action.payload)); // Optional: persist in localStorage
    },

    // Action to reset the shipping address (e.g. for clearing the form or after order completion)
    clearShippingAddress: (state) => {
      state.shippingAddress = null;
      localStorage.removeItem("shippingAddress");
    },

    // Optional: load shipping address from localStorage if present
    loadShippingAddress: (state) => {
      const storedAddress = localStorage.getItem("shippingAddress");
      if (storedAddress) {
        state.shippingAddress = JSON.parse(storedAddress);
      }
    },
  },
});

export const { setShippingAddress, clearShippingAddress, loadShippingAddress } =
  shippingSlice.actions;

export default shippingSlice.reducer;
