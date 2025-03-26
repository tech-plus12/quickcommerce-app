import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const watchLaterSlice = createSlice({
  name: "watchLater",
  initialState,
  reducers: {
    addToWatchLater: (state, action) => {
      const { product } = action.payload;
      if (!state.items.find((item) => item.id === product.id)) {
        state.items.push(product);
      }
    },
    removeFromWatchLater: (state, action) => {
      const { productId } = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
    },
    clearWatchLater: (state) => {
      state.items = [];
    },
  },
});

export const { addToWatchLater, removeFromWatchLater, clearWatchLater } = watchLaterSlice.actions;
export default watchLaterSlice.reducer;
