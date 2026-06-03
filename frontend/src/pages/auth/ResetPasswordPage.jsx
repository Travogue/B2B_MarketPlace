import { useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { Container, Paper, Typography, TextField, Button, Box } from '@mui/material';
import { authAPI } from '../../services';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await authAPI.resetPassword(token, password);
      toast.success('Password reset successful!');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to reset password');
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet><title>Reset Password - B2B Marketplace</title></Helmet>
      <Container maxWidth="sm" sx={{ py: 8 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" fontWeight={700} gutterBottom>Reset Password</Typography>
          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="New Password" type="password" required value={password}
              onChange={(e) => setPassword(e.target.value)} helperText="Minimum 6 characters" />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }} disabled={loading}>Reset Password</Button>
          </Box>
          <Box mt={2}><Link to="/login">Back to Login</Link></Box>
        </Paper>
      </Container>
    </>
  );
};

export default ResetPasswordPage;
