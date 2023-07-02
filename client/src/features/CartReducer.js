import { createSlice, createAction } from "@reduxjs/toolkit";

 const initialState= { 
    cartItems : [],
    cartGuitars : []
   }

export const cartSlice = createSlice({
  name: "cart_items",
initialState,

 reducers : {
  cartAdd: (state, action) => {
        const itemId = action.payload;
        const itemExists = state.cartItems[itemId.id];
        if (itemExists) {
          // If the item already exists in the cart, increment the quantity
          state.cartItems[itemId.id].qty += 1;
        } else {
          // If the item does not exist in the cart, add it with a quantity of 1
          state.cartItems[itemId.id] = {
            item: itemId,
            qty: 1,
          };
        }
      },
      cartRemove: (state, action) => {
        const itemId = action.payload;
        const item = state.cartItems[itemId.id];
      
        if (item && item.qty >= 1) {
          item.qty -= 1;
          if (item.qty === 0) {
            delete state.cartItems[itemId.id];
          }
        }
      },
       clearCart: (state) => {

        state.cartItems = []
       },
       addCustomToCart:(state, action) => {

        const itemId = action.payload;

        const itemExists = state.cartItems[itemId.id];
        if (itemExists) {
          // If the item already exists in the cart, increment the quantity
          state.cartItems[itemId.id].qty += 1;
        } else {
          // If the item does not exist in the cart, add it with a quantity of 1
          state.cartItems[itemId.id] = {
            item: itemId,
            qty: 1,
          };
        }
       },
  }
  
});
export const { cartAdd, cartRemove, clearCart, addCustomToCart } = cartSlice.actions;

export default cartSlice.reducer;
