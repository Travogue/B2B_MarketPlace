import { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip } from '@mui/material';
import { subscriptionAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';

const AdminSubscriptions = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    subscriptionAPI.getPlans({ all: true }).then(({ data }) => setPlans(data.data));
  }, []);

  return (
    <>
      <PageHeader title="Subscription Plan Management" />
      <Paper>
        <Table>
          <TableHead><TableRow><TableCell>Plan</TableCell><TableCell>Price</TableCell><TableCell>Duration</TableCell><TableCell>Max Products</TableCell><TableCell>Premium</TableCell><TableCell>Active</TableCell></TableRow></TableHead>
          <TableBody>
            {plans.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>₹{p.price?.toLocaleString()}</TableCell>
                <TableCell>{p.duration} {p.durationUnit}</TableCell>
                <TableCell>{p.maxProducts}</TableCell>
                <TableCell>{p.isPremium ? <Chip label="Premium" size="small" color="secondary" /> : '-'}</TableCell>
                <TableCell><Chip label={p.isActive ? 'Active' : 'Inactive'} size="small" color={p.isActive ? 'success' : 'default'} /></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

export default AdminSubscriptions;
