import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import config from '../../config/env.config'; // Import config
import {
  getAllApointments,
  createApointment,
  updateApointment,
  deleteApointment,
  getAppointmentsByDate, // Ensure this function exists in appointmentService
  fetchWeeklyAppointments, // Import the new function
} from '../../services/appointmentService';

// Async thunks
export const fetchAppointments = createAsyncThunk(
  'appointments/fetchAppointments',
  async (_, { rejectWithValue }) => {
    try {
      return await getAllApointments();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const addAppointment = createAsyncThunk(
  'appointments/addAppointment',
  async (appointmentData, { rejectWithValue }) => {
    try {
      return await createApointment(appointmentData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const editAppointment = createAsyncThunk(
  'appointments/editAppointment',
  async ({ id, appointmentData }, { rejectWithValue }) => {
    try {
      return await updateApointment(id, appointmentData);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const removeAppointment = createAsyncThunk(
  'appointments/removeAppointment',
  async (id, { rejectWithValue }) => {
    try {
      return await deleteApointment(id);
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const fetchWeekAppointments = createAsyncThunk(
  'appointments/fetchWeekAppointments',
  async ({ startDate, endDate }, { rejectWithValue }) => {
    try {
      return await fetchWeeklyAppointments(startDate, endDate); // Use the new function
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  appointments: [], // Ensure this is an empty array
  loading: false,
  error: null,
};

// Slice
const appointmentSlice = createSlice({
  name: 'appointments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch appointments
      .addCase(fetchAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Add appointment
      .addCase(addAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments.push(action.payload);
      })
      .addCase(addAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Edit appointment
      .addCase(editAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(editAppointment.fulfilled, (state, action) => {
        const index = state.appointments.findIndex(
          (apt) => apt.id === action.payload.id
        );
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
        state.loading = false;
      })
      .addCase(editAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Remove appointment
      .addCase(removeAppointment.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(removeAppointment.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = state.appointments.filter(
          (apt) => apt.id !== action.payload.id
        );
      })
      .addCase(removeAppointment.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch week appointments
      .addCase(fetchWeekAppointments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchWeekAppointments.fulfilled, (state, action) => {
        state.loading = false;
        state.appointments = action.payload;
      })
      .addCase(fetchWeekAppointments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = appointmentSlice.actions;
export default appointmentSlice.reducer;
