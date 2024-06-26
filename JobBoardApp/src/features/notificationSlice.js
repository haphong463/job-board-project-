import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getNotificationAsync,
  readNotificationAsync,
  sendNotificationAsync,
} from "../services/NotificationService";

export const getNotificationThunk = createAsyncThunk(
  "notification/fetchAll",
  async (id, { rejectWithValue }) => {
    try {
      const res = await getNotificationAsync(id);
      return res;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const readNotificationThunk = createAsyncThunk(
  "notification/read",
  async (id) => {
    const res = await readNotificationAsync(id);
    return res;
  }
);

const notificationSlice = createSlice({
  initialState: {
    list: [],
    error: null,
    status: "idle",
    unreadCount: 0, // New state for unread notifications
  },
  name: "notification",
  reducers: {
    updateNotificationBySocket: (state, action) => {
      state.list.push(action.payload); // Mark new notification as unread
      state.unreadCount++;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotificationThunk.pending, (state) => {
        state.status = "Pending";
      })
      .addCase(getNotificationThunk.fulfilled, (state, action) => {
        state.status = "Filled";
        state.list = action.payload;
        state.unreadCount = state.list.filter((item) => !item.read).length;

        state.error = null;
      })
      .addCase(getNotificationThunk.rejected, (state, action) => {
        state.status = "Rejected";
        state.error = action.payload;
      })
      .addCase(readNotificationThunk.fulfilled, (state, action) => {
        const notificationIndex = state.list.findIndex(
          (notification) => notification.id === action.payload.id
        );
        if (notificationIndex !== -1) {
          state.list[notificationIndex].read = true;
          state.unreadCount--;
        }
      });
  },
});

export const { updateNotificationBySocket, markNotificationAsRead } =
  notificationSlice.actions;

export default notificationSlice.reducer;
