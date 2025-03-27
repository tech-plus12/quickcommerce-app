import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import cartReducer from "./cartSlice";
import watchLaterReducer from "./watchLaterSlice";
import orderHistoryReducer from "./orderHistorySlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    cart: cartReducer,
    watchLater: watchLaterReducer,
    orderHistory: orderHistoryReducer,
  },
});
