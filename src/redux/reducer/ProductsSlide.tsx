import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

import type { Product, ProductState } from "../../types/ProductType";
import axios from "axios";
import type { RootState } from "../Store";

const initialState: ProductState = {
  products: [],
  status: "IDLE",
};

export const fetchProducts = createAsyncThunk("products/fetch", async () => {
  try {
    const response = await axios.get("http://localhost:3000/products");
    return response.data as Product[];
  } catch (error) {
    console.error("Error when get data");
    throw error;
  }
});

export const addProduct = createAsyncThunk(
  "products/add",
  async (newProduct: Product) => {
    try {
      const response = await axios.post(
        "http://localhost:3000/products",
        newProduct
      );
      return response.data;
    } catch (error) {
      console.error("Error when adding product");
      throw error;
    }
  }
);

export const deleteProduct = createAsyncThunk(
  "products/delete",
  async (id: string) => {
    try {
      await axios.delete(`http://localhost:3000/products/${id}`);
      return id;
    } catch (error) {
      console.error("Error when deleting product");
      throw error;
    }
  }
);

export const editProduct = createAsyncThunk(
  "products/edit",
  async (selectedProduct: Product) => {
    try {
      const response = await axios.put<Product>(
        `http://localhost:3000/products/${selectedProduct.id}`,
        selectedProduct
      );
      return response.data;
    } catch (error) {
      console.error("Error when editing product");
      throw error;
    }
  }
);

// ==============================PRODUCT SLICE==============================
const productSlice = createSlice({
  name: "products",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.fulfilled, (state, action) => {
        if (action.payload) {
          state.products = action.payload;
          state.status = "SUCCESS";
        }
      })
      .addCase(fetchProducts.pending, (state) => {
        state.status = "LOADING";
      })
      .addCase(fetchProducts.rejected, (state) => {
        state.status = "FAIL";
      });
  },
});

export default productSlice;
export const selectProductState = (state: RootState) => state.products;
