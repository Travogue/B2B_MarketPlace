import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Grid, Paper, List, ListItemButton, ListItemText, Typography, TextField, Button, Box } from '@mui/material';
import { chatAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';

const BuyerChat = () => {
  const { id } = useParams();
  const [chats, setChats] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');

  useEffect(() => {
    chatAPI.getAll().then(({ data }) => setChats(data.data));
  }, []);

  useEffect(() => {
    if (id) {
      chatAPI.getMessages(id).then(({ data }) => {
        setMessages(data.data);
        setActiveChat(id);
      });
    }
  }, [id]);

  const handleSend = async () => {
    if (!activeChat || !newMessage.trim()) return;
    await chatAPI.sendMessage(activeChat, newMessage);
    setNewMessage('');
    const { data } = await chatAPI.getMessages(activeChat);
    setMessages(data.data);
  };

  return (
    <>
      <PageHeader title="Chat with Suppliers" />
      <Grid container spacing={2} sx={{ height: 'calc(100vh - 200px)' }}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ height: '100%', overflow: 'auto' }}>
            <List>
              {chats.map((chat) => (
                <ListItemButton key={chat._id} selected={activeChat === chat._id}
                  onClick={() => { setActiveChat(chat._id); chatAPI.getMessages(chat._id).then(({ data }) => setMessages(data.data)); }}>
                  <ListItemText
                    primary={chat.participants?.find((p) => p.role === 'seller')?.name || 'Supplier'}
                    secondary={chat.lastMessage?.substring(0, 50)}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={8}>
          <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <Box flex={1} p={2} overflow="auto">
              {messages.map((msg, i) => (
                <Box key={i} mb={1} textAlign={msg.sender?.role === 'buyer' ? 'right' : 'left'}>
                  <Paper sx={{ display: 'inline-block', p: 1.5, bgcolor: msg.sender?.role === 'buyer' ? 'primary.light' : 'grey.100' }}>
                    <Typography variant="body2">{msg.content}</Typography>
                  </Paper>
                </Box>
              ))}
            </Box>
            {activeChat && (
              <Box p={2} display="flex" gap={1} borderTop="1px solid #eee">
                <TextField fullWidth size="small" placeholder="Type a message..." value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSend()} />
                <Button variant="contained" onClick={handleSend}>Send</Button>
              </Box>
            )}
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default BuyerChat;
