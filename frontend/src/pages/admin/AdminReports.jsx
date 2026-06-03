import { useEffect, useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { searchAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';

const AdminReports = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    searchAPI.reports().then(({ data: res }) => setData(res.data));
  }, []);

  return (
    <>
      <PageHeader title="Reports & Analytics" />
      <Paper sx={{ p: 3 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Inquiry Trend (Last 6 Months)</Typography>
        <ResponsiveContainer width="100%" height={350}>
          <LineChart data={data?.inquiryTrend || []}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="count" stroke="#1565C0" strokeWidth={2} name="Inquiries" />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </>
  );
};

export default AdminReports;
