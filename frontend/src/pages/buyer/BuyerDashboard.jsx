import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Grid, Typography, Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip, Button } from '@mui/material';
import { searchAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';
import { StatCardsGrid } from '../../components/common/StatCard';

const BuyerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchAPI.buyerDashboard().then(({ data: res }) => {
      setData(res.data);
      setLoading(false);
    });
  }, []);

  const stats = data ? [
    { title: 'Total Inquiries', value: data.stats.inquiries, icon: 'QuestionAnswer', color: 'primary.main' },
    { title: 'Orders', value: data.stats.orders, icon: 'Inventory', color: 'success.main' },
    { title: 'Wishlist Items', value: data.stats.wishlistCount, icon: 'TrendingUp', color: 'secondary.main' },
  ] : [];

  return (
    <>
      <PageHeader title="Buyer Dashboard" subtitle="Manage your inquiries and orders" />
      <StatCardsGrid stats={stats} loading={loading} />

      <Paper sx={{ mt: 4, p: 2 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Recent Inquiries</Typography>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Product</TableCell>
              <TableCell>Supplier</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Date</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {data?.recentInquiries?.map((inq) => (
              <TableRow key={inq._id}>
                <TableCell>{inq.product?.name}</TableCell>
                <TableCell>{inq.company?.companyName}</TableCell>
                <TableCell><Chip label={inq.status} size="small" color={inq.status === 'open' ? 'warning' : 'success'} /></TableCell>
                <TableCell>{new Date(inq.createdAt).toLocaleDateString()}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <Button component={Link} to="/buyer/inquiries" sx={{ mt: 2 }}>View All Inquiries</Button>
      </Paper>
    </>
  );
};

export default BuyerDashboard;
