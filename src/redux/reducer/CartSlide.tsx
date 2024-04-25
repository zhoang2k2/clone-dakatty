import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../Store";
import type { CustomerInfo } from "./CustomerSlide";

interface CartState {
  customers: CustomerInfo[];
  status: string;
}

const initialState: CartState = {
  customers: [],
  status: "IDLE",
};

export const fetchProductInCart = createAsyncThunk(
  "cart/fetch",
  async (customerId: string) => {
    try {
      const response = await axios.get(
        `http://localhost:3000/customers/${customerId}`
      );
      return response.data;
    } catch (error) {
      console.error("Error when get products in cart");
      throw error;
    }
  }
);

export const putProductsToCart = createAsyncThunk(
  "cart/add",
  async (updateStatus: CustomerInfo) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/customers/${updateStatus.id}`,
        updateStatus
      );
      return response.data;
    } catch (error) {
      console.error("Error when adding products into cart");
      throw error;
    }
  }
);

const CartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProductInCart.fulfilled, (state, action) => {
        const { customerId, products } = action.payload;
        const customerIndex = state.customers.findIndex(
          (customer) => customer.id === customerId
        );
        if (customerIndex !== -1) {
          state.customers[customerIndex].products = products;
          state.status = "SUCCESS";
        }
      })
      .addCase(fetchProductInCart.pending, (state) => {
        state.status = "LOADING";
      })
      .addCase(fetchProductInCart.rejected, (state) => {
        state.status = "FAIL";
      });
  },
});

export default CartSlice;
export const selectCartState = (state: RootState) => state.cart;
