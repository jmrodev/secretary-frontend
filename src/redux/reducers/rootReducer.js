import { combineReducers } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import appointmentReducer from '../slices/appointmentSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  appointments: appointmentReducer,
});

export default rootReducer;