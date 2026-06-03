import { useEffect, useState } from 'react';
import { Paper, Typography } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { searchAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';
import { StatCardsGrid } from '../../components/common/StatCard';

const SellerAnalytics = () => {
  const [data, setData] = useState(null);

  useEffect(() => {
    searchAPI.sellerDashboard().then(({ data: res }) => setData(res.data));
  }, []);

  const stats = data ? [
    { title: 'Total Products', value: data.stats.products, icon: 'Inventory' },
    { title: 'Total Inquiries', value: data.stats.inquiries, icon: 'QuestionAnswer' },
    { title: 'Product Views', value: data.topProducts?.reduce((s, p) => s + p.viewCount, 0), icon: 'TrendingUp' },
  ] : [];

  const chartData = data?.topProducts?.map((p) => ({ name: p.name?.substring(0, 15), views: p.viewCount, inquiries: p.inquiryCount })) || [];

  return (
    <>
      <PageHeader title="Analytics Dashboard" />
      <StatCardsGrid stats={stats} loading={!data} />
      <Paper sx={{ p: 3, mt: 4 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Top Products Performance</Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="views" fill="#1565C0" name="Views" />
            <Bar dataKey="inquiries" fill="#FF6F00" name="Inquiries" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>
    </>
  );
};

export default SellerAnalytics;
