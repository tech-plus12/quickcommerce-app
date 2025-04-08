import { createSlice, createSelector } from "@reduxjs/toolkit";

const cartSlice = createSlice({
  name: "cart",
  initialState: {
    items: [],
  },
  reducers: {
    addToCart: (state, action) => {
      const { product, quantity } = action.payload;
      const existingItem = state.items.find(item => item.product.id === product.id);
      
      if (existingItem) {
        existingItem.quantity += quantity;
      } else {
        state.items.push({
          product,
          quantity,
          prescriptionStatus: product.prescription ? 'pending' : 'not_required'
        });
      }
    },

    removeFromCart: (state, action) => {
      const productId = action.payload;
      state.items = state.items.filter(item => item.product.id !== productId);
    },

    updateQuantity: (state, action) => {
      const { productId, quantity } = action.payload;
      const item = state.items.find(item => item.product.id === productId);
      if (item) {
        item.quantity = quantity;
      }
    },

    clearCart: (state) => {
      state.items = [];
    },

    updatePrescriptionStatus: (state, action) => {
      const { productId, status, prescriptionImage } = action.payload;
      const item = state.items.find(item => item.product.id === productId);
      if (item) {
        item.prescriptionStatus = status;
        item.prescriptionImage = prescriptionImage;
      }
    },

    approvePrescription: (state, action) => {
      const { productId } = action.payload;
      const item = state.items.find(item => item.product.id === productId);
      if (item) {
        item.prescriptionStatus = 'approved';
      }
    },
  },
});

export const { 
  addToCart, 
  removeFromCart, 
  updateQuantity, 
  clearCart,
  updatePrescriptionStatus,
  approvePrescription
} = cartSlice.actions;

// Memoized selectors
const selectCartItems = state => state.cart.items;

export const getCartTotal = createSelector(
  [selectCartItems],
  (items) => {
    return items.reduce((total, item) => {
      const price = parseFloat(item.product.price.replace('₹', ''));
      return total + (price * item.quantity);
    }, 0);
  }
);

export const getPrescriptionItems = createSelector(
  [selectCartItems],
  (items) => items.filter(item => item.product.prescription)
);

export default cartSlice.reducer;
