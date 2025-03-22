import { createSlice } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity = 1 } = action.payload;
      const existingItem = state.items.find((item) => item.id === product.id);

      // Convert price string to number
      const numericPrice = Number(product.price.replace('₹', '').replace(/,/g, ''));

      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({ 
          ...product, 
          quantity,
          numericPrice // Store the numeric price
        });
      }
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter((item) => item.id !== productId);
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;

      if (quantity < 1) {
        state.items = state.items.filter((item) => item.id !== productId);
        return;
      }

      const item = state.items.find(item => item.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },

    clearCart: (state) => {
      state.items = [];
    },
  },
});

export const { addToCart, removeFromCart, updateQuantity, clearCart } = cartSlice.actions;

// Updated getCartTotal selector
export const getCartTotal = (state) => {
  return state.cart.items.reduce((total, item) => {
    return total + (item.numericPrice * item.quantity);
  }, 0);
};

export default cartSlice.reducer;
