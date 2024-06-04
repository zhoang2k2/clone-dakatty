import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { AccountAuth } from "../../types/AccountType";
import axios from "axios";
import type { RootState } from "../Store";

const currentAccount = {
  id:"",
  email: "",
  password: "",
};

const initialState = {
  currentAccount,
  status: "IDLE",
};

export const fetchAuthAccount = createAsyncThunk("auth-admin/fetch", async () => {
  try {
    const response = await axios.get("http://localhost:3000/admin-on-work");
    return response.data as AccountAuth;
  } catch (error) {
    console.error("Error get auth account:", error);
    throw error;
  }
});

export const addAuthAccount = createAsyncThunk(
  "auth-admin/put",
  async (authAccount: AccountAuth) => {
    try {
      const response = await axios.put(
        `http://localhost:3000/admin-on-work/`,
        authAccount
      );
      return response.data as AccountAuth;
    } catch (error) {
      console.error("fail to put auth account");
      throw error;
    }
  }
);


const AuthAccountSlice = createSlice({
  name: "accounts",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAuthAccount.fulfilled, (state, action) => {
        if (action.payload) {
          state.currentAccount = action.payload;
          state.status = "SUCCESS";
        }
      })
      .addCase(fetchAuthAccount.pending, (state) => {
        state.status = "LOADING";
      })
      .addCase(fetchAuthAccount.rejected, (state) => {
        state.status = "FAIL";
      });
  },
});

export default AuthAccountSlice;
export const selectAuthAccountState = (state: RootState) =>
  state.currentAccount;
