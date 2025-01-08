import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import apiClient from "../apiClient"; // Assuming apiClient is set up to handle API requests
import type { APiError } from "../types/ApiError";
import type { Order } from "../types/order";

// Async thunk for getting PayPal Client ID
export const getPaypalClientId = createAsyncThunk(
  "paypal/getClientId",
  async () => {
    const { data } = await apiClient.get<{ message: string; clientId: string }>(
      "/api/keys/paypal"
    );
    return data.clientId;
  }
);

// Async thunk for processing PayPal payment
export const processPaypalPayment = createAsyncThunk(
  "order/payorder",
  async (orderId: string) => {
    const { data } = await apiClient.post<{ message: string; order: Order }>(
      `api/orders/${orderId}/pay`,
      orderId
    );
    return data;
  }
);

// Initial PayPal state
interface PaypalState {
  paypalClientId: string | null;
  status: "idle" | "loading" | "succeeded" | "failed";
  error: APiError | null;
}

const initialState: PaypalState = {
  paypalClientId: null,
  status: "idle",
  error: null,
};

// PayPal slice
const paypalSlice = createSlice({
  name: "paypal",
  initialState,
  reducers: {
    resetPaypalState: (state) => {
      state.paypalClientId = null;
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    // Get PayPal Client ID
    builder
      .addCase(getPaypalClientId.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getPaypalClientId.fulfilled,
        (state, action: PayloadAction<string>) => {
          state.status = "succeeded";
          state.paypalClientId = action.payload;
        }
      )
      .addCase(getPaypalClientId.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.error as APiError) || "Failed to fetch PayPal Client ID";
      });

    // Process PayPal Payment
    builder
      .addCase(processPaypalPayment.pending, (state) => {
        state.status = "loading";
      })
      .addCase(processPaypalPayment.fulfilled, (state, action) => {
        state.status = "succeeded";
        console.log(action.payload);
      })
      .addCase(processPaypalPayment.rejected, (state, action) => {
        state.status = "failed";
        state.error =
          (action.error as APiError) || "Failed to process PayPal payment";
      });
  },
});

// Action to reset PayPal state
export const { resetPaypalState } = paypalSlice.actions;

export default paypalSlice.reducer;
