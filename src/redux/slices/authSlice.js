import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { loginUser, register as registerUser, logout as logoutUser } from '../../services/authService';
import { setAuthToken, removeAuthToken } from '../../utils/authUtils';

export const loginAsync = createAsyncThunk(
  '/login',
  async (credentials) => {
    const response = await loginUser(credentials);
    setAuthToken(response.token);
    return response;
  }
);

export const registerAsync = createAsyncThunk(
  '/register',
  async (userData, { rejectWithValue }) => {
    try {
      const data = await registerUser(userData);
      return data;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const logoutAsync = createAsyncThunk(
  '/users/logout',
  async (_, { rejectWithValue }) => {
    try {
      await logoutUser();
      removeAuthToken();
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const initialState = {
  user: null,
  isAuthenticated: false,
  loading: false,
  error: null
};

const authSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      removeAuthToken();
    },
    setUser: (state, action) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.loading = false;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // Register
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Logout
      .addCase(logoutAsync.fulfilled, (state) => {
        authSlice.caseReducers.logout(state);
      });
  }
});

export const { clearError, logout } = authSlice.actions;
export default authSlice.reducer;