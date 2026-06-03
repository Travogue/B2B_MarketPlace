import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Paper, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem } from '@mui/material';
import { companyAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';

const SellerCompany = () => {
  const [form, setForm] = useState({
    companyName: '', description: '', businessType: 'manufacturer', gstNumber: '',
    contactEmail: '', contactPhone: '', website: '',
    address: { street: '', city: '', state: '', pincode: '' },
    yearEstablished: '', employeeCount: '', annualTurnover: '',
  });

  useEffect(() => {
    companyAPI.getMy().then(({ data }) => setForm({ ...form, ...data.data })).catch(() => {});
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await companyAPI.save(form);
      toast.success('Company profile saved');
    } catch {
      toast.error('Failed to save profile');
    }
  };

  return (
    <>
      <PageHeader title="Company Profile" subtitle="Complete your business profile for verification" />
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2} component="form" onSubmit={handleSubmit}>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Company Name" required value={form.companyName} onChange={(e) => setForm({ ...form, companyName: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Business Type</InputLabel>
              <Select value={form.businessType} label="Business Type" onChange={(e) => setForm({ ...form, businessType: e.target.value })}>
                {['manufacturer', 'trader', 'distributor', 'service_provider', 'other'].map((t) => (
                  <MenuItem key={t} value={t}>{t.replace('_', ' ')}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12}><TextField fullWidth label="Description" multiline rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="GST Number" value={form.gstNumber} onChange={(e) => setForm({ ...form, gstNumber: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Contact Email" value={form.contactEmail} onChange={(e) => setForm({ ...form, contactEmail: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Contact Phone" value={form.contactPhone} onChange={(e) => setForm({ ...form, contactPhone: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="Website" value={form.website} onChange={(e) => setForm({ ...form, website: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="City" value={form.address?.city} onChange={(e) => setForm({ ...form, address: { ...form.address, city: e.target.value } })} /></Grid>
          <Grid item xs={12} sm={6}><TextField fullWidth label="State" value={form.address?.state} onChange={(e) => setForm({ ...form, address: { ...form.address, state: e.target.value } })} /></Grid>
          <Grid item xs={12}><Button type="submit" variant="contained" size="large">Save Profile</Button></Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default SellerCompany;
