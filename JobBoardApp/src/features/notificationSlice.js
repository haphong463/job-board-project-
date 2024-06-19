import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {
  getNotificationAsync,
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
    markNotificationAsRead: (state, action) => {
      const notificationIndex = state.list.findIndex(
        (notification) => notification.id === action.payload
      );
      if (notificationIndex !== -1) {
        state.list[notificationIndex].read = true;
        state.unreadCount--;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotificationThunk.pending, (state) => {
        state.status = "Pending";
      })
      .addCase(getNotificationThunk.fulfilled, (state, action) => {
        state.status = "Filled";
        console.log("notifications: ", action.payload);
        state.list = action.payload;
        if (state.list.length > 0) {
          state.unreadCount = state.list.map((item) => !item.isRead).length;
        }
        state.error = null;
      })
      .addCase(getNotificationThunk.rejected, (state, action) => {
        state.status = "Rejected";
        state.error = action.payload;
      });
  },
});

export const { updateNotificationBySocket, markNotificationAsRead } =
  notificationSlice.actions;

export default notificationSlice.reducer;
