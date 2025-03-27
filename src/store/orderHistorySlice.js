import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  orders: [],
  loading: false,
  error: null,
  filters: {
    status: "all",
    dateRange: null,
    searchQuery: "",
  },
};

const orderHistorySlice = createSlice({
  name: "orderHistory",
  initialState,
  reducers: {
    setOrders: (state, action) => {
      state.orders = action.payload.map((order) => ({
        ...order,
        date: order.date instanceof Date ? order.date.toISOString() : order.date,
        tracking: order.tracking || {
          status: order.status,
          steps: [
            { title: "Order Placed", completed: true },
            { title: "Processing", completed: order.status !== "pending" },
            { title: "Shipped", completed: ["shipped", "delivered"].includes(order.status) },
            { title: "Delivered", completed: order.status === "delivered" },
          ],
        },
      }));
    },
    addOrder: (state, action) => {
      const order = {
        ...action.payload,
        date: action.payload.date instanceof Date ? action.payload.date.toISOString() : action.payload.date,
        tracking: {
          status: "pending",
          steps: [
            { title: "Order Placed", completed: true },
            { title: "Processing", completed: false },
            { title: "Shipped", completed: false },
            { title: "Delivered", completed: false },
          ],
        },
      };
      state.orders.unshift(order);
    },
    updateOrderStatus: (state, action) => {
      const { orderId, status } = action.payload;
      const order = state.orders.find((order) => order.id === orderId);
      if (order) {
        order.status = status;
        order.tracking.status = status;
        order.tracking.steps = [
          { title: "Order Placed", completed: true },
          { title: "Processing", completed: status !== "pending" },
          { title: "Shipped", completed: ["shipped", "delivered"].includes(status) },
          { title: "Delivered", completed: status === "delivered" },
        ];
      }
    },
    cancelOrder: (state, action) => {
      const { orderId } = action.payload;
      const order = state.orders.find((order) => order.id === orderId);
      if (order) {
        order.status = "cancelled";
        order.tracking.status = "cancelled";
        order.tracking.steps = [
          { title: "Order Placed", completed: true },
          { title: "Processing", completed: false },
          { title: "Shipped", completed: false },
          { title: "Delivered", completed: false },
        ];
      }
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
    setError: (state, action) => {
      state.error = action.payload;
    },
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = initialState.filters;
    },
  },
});

export const { setOrders, addOrder, updateOrderStatus, cancelOrder, setLoading, setError, setFilters, clearFilters } = orderHistorySlice.actions;

export default orderHistorySlice.reducer;
