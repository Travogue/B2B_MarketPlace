import { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip, Button, ButtonGroup } from '@mui/material';
import { toast } from 'react-toastify';
import { productAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';

const AdminProducts = () => {
  const [products, setProducts] = useState([]);

  const load = () => productAPI.getAll({ status: 'pending' }).then(({ data }) => setProducts(data.data.products));

  useEffect(() => { load(); }, []);

  const handleApprove = async (id, status) => {
    await productAPI.approve(id, { status });
    toast.success(`Product ${status}`);
    load();
  };

  return (
    <>
      <PageHeader title="Product Approval" subtitle="Review pending product listings" />
      <Paper>
        <Table>
          <TableHead><TableRow><TableCell>Product</TableCell><TableCell>Company</TableCell><TableCell>Price</TableCell><TableCell>Status</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>{p.company?.companyName}</TableCell>
                <TableCell>₹{p.priceRange?.min} - ₹{p.priceRange?.max}</TableCell>
                <TableCell><Chip label={p.status} size="small" color="warning" /></TableCell>
                <TableCell>
                  <ButtonGroup size="small">
                    <Button color="success" onClick={() => handleApprove(p._id, 'approved')}>Approve</Button>
                    <Button color="error" onClick={() => handleApprove(p._id, 'rejected')}>Reject</Button>
                  </ButtonGroup>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

export default AdminProducts;
