import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { APiError } from "../types/ApiError";
import { resetCart } from "./CartSlice";
import type { AppDispatch } from "../store";
import apiClient from "../apiClient";
import type { User } from "../types/User"; // Use the defined User type
import axios from "axios";

// Define the shape of your user state
interface UserState {
  userInfo: User[] | null; // userInfo is now an array of User or null
  currentUserId: string | null; // New property to track logged-in user
  loading: boolean;
  error: APiError | null;
}

const initialState: UserState = {
  userInfo: null,
  currentUserId: null, // Initialize as null
  loading: false,
  error: null,
};

// Async thunk to get users
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  const response = await apiClient.get("/api/users");
  return response.data;
});

export const deleteUser = createAsyncThunk<
  string, // The return type (userId)
  string, // The argument type (userId)
  { rejectValue: string } // The error type returned by rejectWithValue
>("users/deleteUser", async (userId: string, { rejectWithValue }) => {
  try {
    await apiClient.delete(`/api/users/${userId}`);
    console.log("Deleting user with ID:", userId);
    return userId; // Return the userId to remove it from the state
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      console.log("Error deleting user:", error.response?.data);
      return rejectWithValue(
        error.response.data.message || "Failed to delete user"
      );
    }
    console.log("An unknown error occurred:", error);
    return rejectWithValue("An unknown error occurred");
  }
});

// export const  = createAsyncThunk(
//   "users/addUser",
//   async (userData: Partial<User>) => {
//     const response = await apiClient.post("/api/users/createuser", userData);
//     return response.data;
//   }
// );

export const addUser = createAsyncThunk<
  User,
  { name: string; email: string; password: string; role: string }
>("user/addUser", async (userData) => {
  const response = await apiClient.post("/api/users/createuser", userData);
  return response.data;
});

// Async thunk for user sign-in
export const signIn = createAsyncThunk<
  User,
  { email: string; password: string }
>("user/signIn", async (userData) => {
  const response = await apiClient.post("/api/users/signin", userData);
  localStorage.setItem("userInfo", JSON.stringify(response.data));
  return response.data;
});

// Async thunk for user sign-up
export const signUp = createAsyncThunk<
  User,
  { name: string; email: string; password: string }
>("user/signUp", async (userData) => {
  const response = await apiClient.post("/api/users/signup", userData);
  localStorage.setItem("userInfo", JSON.stringify(response.data));
  return response.data;
});

export const setUserFromLocalStorage = createAsyncThunk(
  "user/setUserFromLocalStorage",
  async () => {
    const userInfo = localStorage.getItem("userInfo");
    return userInfo ? JSON.parse(userInfo) : null;
  }
);

// Create user slice
const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    signOut(state) {
      state.userInfo = null;
      state.currentUserId = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Handle sign-in
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUserId = action.payload._id;
        state.userInfo = [action.payload];
        localStorage.setItem("userInfo", JSON.stringify([action.payload]));
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error as APiError;
      })
      // Handle sign-up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.currentUserId = action.payload._id;
        state.userInfo = [action.payload]; // Set user info as an array with a single user
        localStorage.setItem("userInfo", JSON.stringify([action.payload])); // Store in localStorage as an array
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error as APiError;
      })
      // Handle fetching users
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.userInfo = action.payload;
      })
      // Handle deleting a user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.userInfo =
          state.userInfo?.filter((user) => user._id !== action.payload) || null;
      })
      // Handle adding a user
      .addCase(addUser.fulfilled, (state, action) => {
        if (state.userInfo) {
          state.userInfo.push(action.payload);
        } else {
          state.userInfo = [action.payload];
        }
      })
      .addCase(setUserFromLocalStorage.fulfilled, (state, action) => {
        state.userInfo = action.payload;
      });
  },
});

// Export actions and reducer
export const { signOut } = userSlice.actions;
export default userSlice.reducer;

export const handleSignOut = () => (dispatch: AppDispatch) => {
  dispatch(signOut());
  dispatch(resetCart());
  localStorage.removeItem("userInfo");
  window.location.href = "/signin";
};
