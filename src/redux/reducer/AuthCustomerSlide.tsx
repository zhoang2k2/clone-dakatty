import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../Store";

export interface CurrentCustomer {
  id: string;
  username: string;
  password: string;
}

const currentCustomerAccount: CurrentCustomer = {
  id: "",
  username: "",
  password: "",
};

const initialState = {
  currentCustomerAccount,
  status: "IDLE",
};

export const fetchAuthCustomer = createAsyncThunk("auth-customer/fetch", async () => {
  try {
    const response = await axios.get("http://localhost:3000/customer-online");
    return response.data;
  } catch (error) {
    console.error("Error get auth customer account:", error);
    throw error;
  }
});

export const addAuthCustomer = createAsyncThunk(
  "auth-account/put",
  async (authAccount: CurrentCustomer) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/customer-online/`,
        authAccount
      );
      return response.data as CurrentCustomer;
    } catch (error) {
      console.error("fail to put auth customer account");
      throw error;
    }
  }
);

const AuthCustomerSlice = createSlice({
  name: "currentCustomer",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthCustomer.fulfilled, (state, action) => {
        if (action.payload) {
          state.currentCustomerAccount = action.payload;
          state.status = "SUCCESS";
        }
      })
      .addCase(fetchAuthCustomer.pending, (state) => {
        state.status = "LOADING";
      })
      .addCase(fetchAuthCustomer.rejected, (state) => {
        state.status = "FAIL";
      });
  },
});

export default AuthCustomerSlice;
export const selectAuthCustomerState = (state: RootState) =>
  state.currentCustomer;
