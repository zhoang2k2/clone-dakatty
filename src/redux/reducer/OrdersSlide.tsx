import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { Product } from "../../types/ProductType";
import axios from "axios";
import type { RootState } from "../Store";

interface ItemQuantity {
  productId: string;
  productQuantity: number;
}

export interface CustomerOrder {
  id: string;
  inTotal: string;
  customerId: string;
  username: string;
  password: string;
  phone: string;
  address: string;
  status: string;
  products: Product[];
  detailQuantities: ItemQuantity[];
}

export interface CustomerOrderState {
  orders: CustomerOrder[];
  status: string;
}

const initialState: CustomerOrderState = {
  orders: [],
  status: "IDLE",
};

export const fetchOrder = createAsyncThunk("order/fetch", async () => {
  try {
    const response = await axios.get("http://localhost:3000/orders");
    return response.data;
  } catch (error) {
    console.error("Error when fetch orders");
    throw error;
  }
});

export const addOrder = createAsyncThunk(
  "order/add",
  async (newOrder: CustomerOrder) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/orders",
        newOrder
      );
      return response.data;
    } catch (error) {
      console.error("Error when add new order");
      throw error;
    }
  }
);

export const editOrder = createAsyncThunk(
  "order/edit",
  async (updateOrder: CustomerOrder) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/orders/${updateOrder.id}`,
        updateOrder
      );
      return response.data;
    } catch (error) {
      console.error("Error when editing order");
      throw error;
    }
  }
);

const OrderSlide = createSlice({
  name: "order",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrder.fulfilled, (state, action) => {
        if (action.payload) {
          state.orders = action.payload;
          state.status = "SUCCESS";
        }
      })
      .addCase(fetchOrder.pending, (state) => {
        state.status = "LOADING";
      })
      .addCase(fetchOrder.rejected, (state) => {
        state.status = "FAIL";
      })
      .addCase(editOrder.fulfilled, (state, action) => {
        state.orders = state.orders.filter((order) => {
          order.id === action.payload.id;
          return action.payload;
        });
        state.status = "SUCCESS";
      });
  },
});

export default OrderSlide;
export const selectOrderState = (state: RootState) => state.order;
