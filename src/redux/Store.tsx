import { configureStore } from "@reduxjs/toolkit";
import ProductsSlide from "./reducer/ProductsSlide";
import AccountSlice from "./reducer/AccountsSlide";
import AuthAccountSlice from "./reducer/AuthAccountSlides";
import CartSlice from "./reducer/CartSlide";
import CustomerSlide from "./reducer/CustomerSlide";
import AuthCustomerSlice from "./reducer/AuthCustomerSlide";
import OrderSlide from "./reducer/OrdersSlide";

const store = configureStore({
  reducer: {
    adminAccounts: AccountSlice.reducer,
    currentAccount: AuthAccountSlice.reducer,
    products: ProductsSlide.reducer,
    cart: CartSlice.reducer,
    customers: CustomerSlide.reducer,
    currentCustomer: AuthCustomerSlice.reducer,
    order: OrderSlide.reducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export default store;
