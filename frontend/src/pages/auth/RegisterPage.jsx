import { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import {
  Container, Paper, Typography, TextField, Button, Box, Divider, Alert,
  ToggleButtonGroup, ToggleButton,
} from '@mui/material';
import { PersonAdd, ShoppingCart, Store } from '@mui/icons-material';
import { register, clearError } from '../../store/slices/authSlice';

const RegisterPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { loading, error } = useSelector((state) => state.auth);
  const [form, setForm] = useState({
    name: '', email: '', password: '', phone: '',
    role: searchParams.get('role') || 'buyer',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    dispatch(clearError());
    const result = await dispatch(register(form));
    if (register.fulfilled.match(result)) {
      toast.success('Registration successful!');
      navigate(form.role === 'seller' ? '/seller' : '/buyer');
    }
  };

  return (
    <>
      <Helmet><title>Register - B2B Marketplace</title></Helmet>
      <Container maxWidth="sm" sx={{ py: 6 }}>
        <Paper sx={{ p: 4 }}>
          <Box textAlign="center" mb={3}>
            <PersonAdd color="primary" sx={{ fontSize: 48, mb: 1 }} />
            <Typography variant="h4" fontWeight={700}>Create Account</Typography>
          </Box>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

          <ToggleButtonGroup value={form.role} exclusive fullWidth sx={{ mb: 3 }}
            onChange={(_, val) => val && setForm({ ...form, role: val })}>
            <ToggleButton value="buyer"><ShoppingCart sx={{ mr: 1 }} /> Buyer</ToggleButton>
            <ToggleButton value="seller"><Store sx={{ mr: 1 }} /> Seller</ToggleButton>
          </ToggleButtonGroup>

          <Box component="form" onSubmit={handleSubmit}>
            <TextField fullWidth label="Full Name" margin="normal" required value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextField fullWidth label="Email" type="email" margin="normal" required value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })} />
            <TextField fullWidth label="Phone" margin="normal" value={form.phone}
              onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <TextField fullWidth label="Password" type="password" margin="normal" required value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })} helperText="Minimum 6 characters" />
            <Button type="submit" fullWidth variant="contained" size="large" sx={{ mt: 3 }} disabled={loading}>
              {loading ? 'Creating account...' : 'Register'}
            </Button>
          </Box>

          <Divider sx={{ my: 3 }} />
          <Typography variant="body2" textAlign="center">
            Already have an account? <Link to="/login">Login here</Link>
          </Typography>
        </Paper>
      </Container>
    </>
  );
};

export default RegisterPage;
