import { useState } from 'react';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { Paper, TextField, Button, Grid } from '@mui/material';
import { authAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';

const BuyerProfile = () => {
  const { user } = useSelector((state) => state.auth);
  const [form, setForm] = useState({ name: user?.name || '', phone: user?.phone || '' });
  const [passwords, setPasswords] = useState({ currentPassword: '', newPassword: '' });

  const handleUpdate = async () => {
    try {
      await authAPI.updateProfile(form);
      toast.success('Profile updated');
    } catch {
      toast.error('Failed to update profile');
    }
  };

  const handlePasswordChange = async () => {
    try {
      await authAPI.updatePassword(passwords);
      toast.success('Password updated');
      setPasswords({ currentPassword: '', newPassword: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update password');
    }
  };

  return (
    <>
      <PageHeader title="Profile Settings" />
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <TextField fullWidth label="Name" margin="normal" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
            <TextField fullWidth label="Email" margin="normal" value={user?.email || ''} disabled />
            <TextField fullWidth label="Phone" margin="normal" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
            <Button variant="contained" onClick={handleUpdate} sx={{ mt: 2 }}>Save Changes</Button>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 3 }}>
            <TextField fullWidth label="Current Password" type="password" margin="normal" value={passwords.currentPassword}
              onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })} />
            <TextField fullWidth label="New Password" type="password" margin="normal" value={passwords.newPassword}
              onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })} />
            <Button variant="contained" onClick={handlePasswordChange} sx={{ mt: 2 }}>Change Password</Button>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

export default BuyerProfile;
