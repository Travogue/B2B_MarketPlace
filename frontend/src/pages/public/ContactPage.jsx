import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import { Container, Grid, Typography, TextField, Button, Paper, Box } from '@mui/material';
import { Email, Phone, LocationOn } from '@mui/icons-material';
import { cmsAPI } from '../../services';

const ContactPage = () => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', subject: '', message: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await cmsAPI.contact(form);
      toast.success('Message sent successfully!');
      setForm({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch {
      toast.error('Failed to send message');
    }
    setLoading(false);
  };

  return (
    <>
      <Helmet><title>Contact Us - B2B Marketplace</title></Helmet>
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography variant="h3" fontWeight={700} textAlign="center" gutterBottom>Contact Us</Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>We'd love to hear from you</Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 3, height: '100%' }}>
              {[
                { icon: Email, label: 'Email', value: 'support@b2bmarketplace.com' },
                { icon: Phone, label: 'Phone', value: '+91 1800-123-4567' },
                { icon: LocationOn, label: 'Address', value: 'Mumbai, Maharashtra, India' },
              ].map(({ icon: Icon, label, value }) => (
                <Box display="flex" gap={2} mb={3} key={label}>
                  <Icon color="primary" />
                  <Box>
                    <Typography variant="subtitle2" fontWeight={600}>{label}</Typography>
                    <Typography variant="body2" color="text.secondary">{value}</Typography>
                  </Box>
                </Box>
              ))}
            </Paper>
          </Grid>
          <Grid item xs={12} md={7}>
            <Paper sx={{ p: 3 }}>
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Email" type="email" required value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Subject" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Message" multiline rows={5} required value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} />
                  </Grid>
                  <Grid item xs={12}>
                    <Button type="submit" variant="contained" size="large" disabled={loading}>Send Message</Button>
                  </Grid>
                </Grid>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ContactPage;
