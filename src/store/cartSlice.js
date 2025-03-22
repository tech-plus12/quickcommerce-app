import { createSlice } from "@reduxjs/toolkit";

const calculateTotal = (items) => {
  return items.reduce((total, item) => {
    const price = parseFloat(item.price.replace("₹", "").replace(",", "")) || 0;
    return total + price * item.quantity;
  }, 0);
};

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
    total: 0,
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ ...product, quantity });
      }

      state.total = calculateTotal(state.items);
    },

    removeFromCart: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
      state.total = calculateTotal(state.items);
    },

    updateQuantity: (state, action) => {
      const { id, qt } = action.payload;
      const item = state.items.find((item) => item.id === id);

      if (item) {
        if (qt < 1) {
          // If the new quantity is 0, remove the item from the cart
          state.items = state.items.filter((item) => item.id !== id);
        } else {
          item.quantity = qt;
        }
      }
      state.total = state.items.reduce((sum, item) => {
        const cleanPrice = parseFloat(item.price.replace(/₹|,/g, ""));
        return sum + cleanPrice * item.quantity;
      }, 0);
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity } = cartSlice.actions;
export default cartSlice.reducer;
