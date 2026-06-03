import { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip, Typography } from '@mui/material';
import { searchAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';
import { StatCardsGrid } from '../../components/common/StatCard';

const AdminDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchAPI.adminDashboard().then(({ data: res }) => { setData(res.data); setLoading(false); });
  }, []);

  const stats = data ? [
    { title: 'Total Users', value: data.stats.totalUsers, icon: 'People', color: 'primary.main' },
    { title: 'Sellers', value: data.stats.totalSellers, icon: 'Inventory', color: 'secondary.main' },
    { title: 'Pending Approvals', value: data.stats.pendingSellers + data.stats.pendingProducts, icon: 'TrendingUp', color: 'warning.main' },
    { title: 'Total Inquiries', value: data.stats.totalInquiries, icon: 'QuestionAnswer', color: 'success.main' },
  ] : [];

  return (
    <>
      <PageHeader title="Admin Dashboard" subtitle="Platform overview and management" />
      <StatCardsGrid stats={stats} loading={loading} />
      <Paper sx={{ mt: 4, p: 2 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Recent Inquiries</Typography>
        <Table>
          <TableHead><TableRow><TableCell>Product</TableCell><TableCell>Buyer</TableCell><TableCell>Status</TableCell><TableCell>Date</TableCell></TableRow></TableHead>
          <TableBody>
            {data?.recentInquiries?.map((inq) => (
              <TableRow key={inq._id}>
                <TableCell>{inq.product?.name}</TableCell>
                <TableCell>{inq.buyer?.name}</TableCell>
                <TableCell><Chip label={inq.status} size="small" /></TableCell>
                <TableCell>{new Date(inq.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

export default AdminDashboard;
