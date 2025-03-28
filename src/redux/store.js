import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import appointmentReducer from './slices/appointmentSlice'; // Import the appointment reducer

export const store = configureStore({
  reducer: {
    auth: authReducer,
    appointments: appointmentReducer, // Add the appointment reducer
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;