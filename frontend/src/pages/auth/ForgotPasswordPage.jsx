import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { Container, Paper, Typography, TextField, Button, Box, Alert } from '@mui/material';
import { authAPI } from '../../services';

const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.forgotPassword(email);
      setSent(true);
      toast.success('Reset link sent to your email');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to send reset email');
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet><title>Forgot Password - B2B Marketplace</title></Helmet>
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>Forgot Password</Typography>
          {sent ? (
            <Alert severity="success">Check your email for the password reset link.</Alert>
          ) : (
            <Box component="form" onSubmit={handleSubmit}>
              <Typography variant="body2" color="text.secondary" mb={2}>Enter your email to receive a reset link.</Typography>
              <TextField fullWidth label="Email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
              <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }} disabled={loading}>Send Reset Link</Button>
            </Box>
          )}
          <Box mt={2}><Link to="/login">Back to Login</Link></Box>
        </Paper>
      </Container>
    </>
  );
};

export default ForgotPasswordPage;
