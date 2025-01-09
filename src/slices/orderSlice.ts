import {
  createSlice,
  createAsyncThunk,
  type PayloadAction,
} from "@reduxjs/toolkit";
import apiClient from "../apiClient"; // Assuming apiClient is set up to handle API requests
import type { Order } from "../types/order"; // Import the Order type
import type { APiError } from "../types/ApiError";

// Async thunk for creating an order
export const createOrder = createAsyncThunk(
  "order/createOrder",
  async (order: Order) => {
    const { data } = await apiClient.post<{ message: string; order: Order }>(
      "https://backend-gy2d.onrender.com/api/orders",
      order
    );
    return data.order;
  }
);

// Async thunk for getting an order by ID
export const getOrderById = createAsyncThunk(
  "order/getOrderById",
  async (orderId: string) => {
    const { data } = await apiClient.get<{ message: string; order: Order }>(
      `https://backend-gy2d.onrender.com/api/orders/${orderId}`
    );
    return data.order;
  }
);

// Async thunk for getting all orders
export const getAllOrders = createAsyncThunk("order/getAllOrders", async () => {
  const { data } = await apiClient.get<{ message: string; orders: Order[] }>(
    "https://backend-gy2d.onrender.com/api/orders"
  );
  return data.orders;
});

// Initial state interface
interface OrderState {
  order: Order | null;
  orders: Order[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: APiError | null;
}

const initialState: OrderState = {
  order: null,
  orders: [],
  status: "idle",
  error: null,
};

export const orderSlice = createSlice({
  name: "order",
  initialState,
  reducers: {
    resetOrder: (state) => {
      state.order = null;
      state.orders = [];
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.status = "loading";
      })
      .addCase(createOrder.fulfilled, (state, action: PayloadAction<Order>) => {
        state.status = "succeeded";
        state.order = action.payload;
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.error as APiError) || "Failed to create order";
      })
      .addCase(getOrderById.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getOrderById.fulfilled,
        (state, action: PayloadAction<Order>) => {
          state.status = "succeeded";
          state.order = action.payload;
        }
      )
      .addCase(getOrderById.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.error as APiError) || "Failed to fetch order";
      })
      .addCase(getAllOrders.pending, (state) => {
        state.status = "loading";
      })
      .addCase(
        getAllOrders.fulfilled,
        (state, action: PayloadAction<Order[]>) => {
          state.status = "succeeded";
          state.orders = action.payload;
        }
      )
      .addCase(getAllOrders.rejected, (state, action) => {
        state.status = "failed";
        state.error = (action.error as APiError) || "Failed to fetch orders";
      });
  },
});

// Action to reset order state
export const { resetOrder } = orderSlice.actions;

export default orderSlice.reducer;
