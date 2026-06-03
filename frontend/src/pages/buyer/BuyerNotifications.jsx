import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { List, ListItem, ListItemText, ListItemIcon, Paper, Typography, IconButton, Chip, Box } from '@mui/material';
import { Notifications, Circle, Delete } from '@mui/icons-material';
import { fetchNotifications } from '../../store/slices/notificationSlice';
import { notificationAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';

const BuyerNotifications = () => {
  const dispatch = useDispatch();
  const { items, unreadCount } = useSelector((state) => state.notifications);

  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  const handleMarkAllRead = async () => {
    await notificationAPI.markAllAsRead();
    dispatch(fetchNotifications());
  };

  return (
    <>
      <PageHeader title="Notifications" subtitle={`${unreadCount} unread`} action={
        unreadCount > 0 && <Chip label="Mark all read" onClick={handleMarkAllRead} clickable color="primary" />
      } />
      <Paper>
        <List>
          {items.length === 0 ? (
            <Box p={4} textAlign="center"><Typography color="text.secondary">No notifications</Typography></Box>
          ) : items.map((notif) => (
            <ListItem key={notif._id} divider secondaryAction={
              <IconButton edge="end"><Delete fontSize="small" /></IconButton>
            }>
              <ListItemIcon>{notif.isRead ? <Notifications color="disabled" /> : <Circle color="primary" sx={{ fontSize: 12 }} />}</ListItemIcon>
              <ListItemText primary={notif.title} secondary={notif.message} />
            </ListItem>
          ))}
        </List>
      </Paper>
    </>
  );
};

export default BuyerNotifications;
