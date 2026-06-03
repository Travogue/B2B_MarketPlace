import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { notificationAPI } from '../../services';

export const fetchNotifications = createAsyncThunk('notifications/fetch', async (params) => {
  const { data } = await notificationAPI.getAll(params);
  return data.data;
});

const notificationSlice = createSlice({
  name: 'notifications',
  initialState: { items: [], unreadCount: 0, loading: false },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.items = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      });
  },
});

export default notificationSlice.reducer;
