import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip, Button, Typography } from '@mui/material';
import { searchAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';
import { StatCardsGrid } from '../../components/common/StatCard';

const SellerDashboard = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    searchAPI.sellerDashboard().then(({ data: res }) => { setData(res.data); setLoading(false); });
  }, []);

  const stats = data ? [
    { title: 'Products', value: data.stats.products, icon: 'Inventory', color: 'primary.main' },
    { title: 'Total Inquiries', value: data.stats.inquiries, icon: 'QuestionAnswer', color: 'secondary.main' },
    { title: 'Open Inquiries', value: data.stats.openInquiries, icon: 'TrendingUp', color: 'warning.main' },
    { title: 'Orders', value: data.stats.orders, icon: 'People', color: 'success.main' },
  ] : [];

  return (
    <>
      <PageHeader title="Seller Dashboard" subtitle="Manage your business" action={
        <Button variant="contained" component={Link} to="/seller/products/new">Add Product</Button>
      } />
      <StatCardsGrid stats={stats} loading={loading} />

      <Paper sx={{ mt: 4, p: 2 }}>
        <Typography variant="h6" fontWeight={600} gutterBottom>Recent Inquiries</Typography>
        <Table>
          <TableHead><TableRow><TableCell>Product</TableCell><TableCell>Buyer</TableCell><TableCell>Qty</TableCell><TableCell>Status</TableCell></TableRow></TableHead>
          <TableBody>
            {data?.recentInquiries?.map((inq) => (
              <TableRow key={inq._id}>
                <TableCell>{inq.product?.name}</TableCell>
                <TableCell>{inq.buyer?.name}</TableCell>
                <TableCell>{inq.quantity}</TableCell>
                <TableCell><Chip label={inq.status} size="small" /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

export default SellerDashboard;
