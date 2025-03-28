import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import {
  getAllApointments,
  createApointment,
  updateApointment,
  deleteApointment,
  getAppointmentsByDate, // Ensure this function exists in appointmentService
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
      const appointments = [];
      let currentDate = new Date(startDate);

      while (currentDate <= new Date(endDate)) {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1; // Months are 0-based
        const day = currentDate.getDate();
        const response = await getAppointmentsByDate(year, month, day);

        // Ensure response is an array and append it to appointments
        if (Array.isArray(response)) {
          appointments.push(...response);
        } else if (response.data && Array.isArray(response.data)) {
          appointments.push(...response.data);
        } else {
          console.warn('Unexpected response format:', response);
        }

        currentDate.setDate(currentDate.getDate() + 1);
      }

      return appointments;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// Initial state
const initialState = {
  appointments: [],
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
        state.loading = false;
        const index = state.appointments.findIndex(
          (apt) => apt.id === action.payload.id
        );
        if (index !== -1) {
          state.appointments[index] = action.payload;
        }
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
