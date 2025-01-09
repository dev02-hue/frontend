// src/slices/productSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { Product, ProductState } from "../types/Product";
import type { RootState } from "../store";
import type { APiError } from "../types/ApiError";
import { getError } from "../utils";
import apiClient from "../apiClient";

export const fetchProducts = createAsyncThunk<
  Product[],
  void,
  { rejectValue: string }
>("products/fetch", async (_, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.get(
      "https://backend-gy2d.onrender.com/api/products"
    );
    return data;
  } catch (err) {
    return rejectWithValue(getError(err as APiError));
  }
});

export const fetchProductDetailsBySlug = createAsyncThunk<
  Product,
  string,
  { rejectValue: string }
>("products/fetchDetails", async (slug, { rejectWithValue }) => {
  try {
    console.log("Fetching URL:", `/api/products/slug/${slug}`);
    const { data } = await apiClient.get(
      `https://backend-gy2d.onrender.com/api/products/slug/${slug}`
    );
    return data;
  } catch (err) {
    return rejectWithValue(getError(err as APiError));
  }
});

// Thunk for adding a new product
export const addProducts = createAsyncThunk<
  Product,
  Product,
  { rejectValue: string }
>("products/add", async (newProduct, { rejectWithValue }) => {
  try {
    const { data } = await apiClient.post(
      "https://backend-gy2d.onrender.com/api/products/addproducts",
      newProduct
    );
    return data;
  } catch (err) {
    return rejectWithValue(getError(err as APiError));
  }
});

// Delete a product by ID
export const deleteProduct = createAsyncThunk<
  string, // The payload will just be the product ID
  string,
  { rejectValue: string }
>("products/delete", async (id, { rejectWithValue }) => {
  try {
    await apiClient.delete(
      `https://backend-gy2d.onrender.com/api/products/${id}`
    );
    return id; // Return the product ID to remove it from the state
  } catch (err) {
    return rejectWithValue(getError(err as APiError));
  }
});

const initialState: ProductState = {
  products: [],
  productDetails: null,
  loading: false,
  error: null,
};

export const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {
    addProducts: (state, action) => {
      // Assuming action.payload contains the new product
      state.products.push(action.payload); // Add new product to the state
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle fetching all products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload; // Store fetched products
        state.loading = false;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch products.";
      });

    // Handle fetching product details by slug
    builder
      .addCase(fetchProductDetailsBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.productDetails = null; // Reset productDetails when loading starts
      })
      .addCase(fetchProductDetailsBySlug.fulfilled, (state, action) => {
        state.productDetails = action.payload; // Store the fetched product details
        state.loading = false;
      })
      .addCase(fetchProductDetailsBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch product details.";
      });

    builder
      .addCase(addProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addProducts.fulfilled, (state, action) => {
        state.products.push(action.payload); // Add the new product to the list
        state.loading = false;
      })
      .addCase(addProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to add product.";
      });

    builder
      .addCase(deleteProduct.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        // Remove the deleted product by filtering out the matching product ID
        state.products = state.products.filter(
          (product) => product._id !== action.payload
        );
        state.loading = false;
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete product.";
      });
  },
});

// Selectors to get product data
export const selectProducts = (state: RootState) => state.products.products;
export const selectProductDetails = (state: RootState) =>
  state.products.productDetails;
export const selectLoading = (state: RootState) => state.products.loading;
export const selectError = (state: RootState) => state.products.error;

export default productSlice.reducer;
