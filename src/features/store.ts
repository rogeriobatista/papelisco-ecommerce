import { configureStore } from '@reduxjs/toolkit';
import productsReducer from './products/productsSlice';
import authReducer from './auth/authSlice';
import cartReducer from './cart/cartSlice';

export const store = configureStore({
  reducer: {
    products: productsReducer,
    auth: authReducer,
    cart: cartReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
