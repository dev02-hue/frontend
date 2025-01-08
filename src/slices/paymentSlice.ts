import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { APiError } from "../types/ApiError";

export type PaymentMethod = "PayPal" | "CreditCard";

interface PaymentState {
  paymentMethod: string;
  loading: boolean;
  success: boolean;
  error: APiError | null;
}

const initialState: PaymentState = {
  paymentMethod: localStorage.getItem("paymentMethod") || "PayPal",
  loading: false,
  success: false,
  error: null,
};

const paymentSlice = createSlice({
  name: "payment",
  initialState,
  reducers: {
    setPaymentMethod: (state, action: PayloadAction<string>) => {
      state.paymentMethod = action.payload;
      localStorage.setItem("paymentMethod", action.payload);
    },
    resetPaymentMethod: (state) => {
      state.paymentMethod = "PayPal";
      localStorage.removeItem("paymentMethod");
    },
    paymentRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    paymentSuccess: (state) => {
      state.loading = false;
      state.success = true;
      state.error = null;
    },
    paymentFailure: (state, action: PayloadAction<APiError>) => {
      state.loading = false;
      state.success = false;
      state.error = action.payload;
    },
  },
});

// Export actions
export const {
  setPaymentMethod,
  resetPaymentMethod,
  paymentRequest,
  paymentSuccess,
  paymentFailure,
} = paymentSlice.actions;

export default paymentSlice.reducer;
