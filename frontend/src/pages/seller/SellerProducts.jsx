import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Chip, Button, IconButton } from '@mui/material';
import { Edit, Delete, Add } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { productAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';

const SellerProducts = () => {
  const [products, setProducts] = useState([]);

  const loadProducts = () => {
    productAPI.getAll().then(({ data }) => setProducts(data.data.products));
  };

  useEffect(() => { loadProducts(); }, []);

  const handleDelete = async (id) => {
    if (!confirm('Delete this product?')) return;
    await productAPI.delete(id);
    toast.success('Product deleted');
    loadProducts();
  };

  const statusColor = { draft: 'default', pending: 'warning', approved: 'success', rejected: 'error' };

  return (
    <>
      <PageHeader title="My Products" action={
        <Button variant="contained" startIcon={<Add />} component={Link} to="/seller/products/new">Add Product</Button>
      } />
      <Paper>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Price Range</TableCell>
              <TableCell>MOQ</TableCell>
              <TableCell>Status</TableCell>
              <TableCell>Views</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {products.map((p) => (
              <TableRow key={p._id}>
                <TableCell>{p.name}</TableCell>
                <TableCell>₹{p.priceRange?.min} - ₹{p.priceRange?.max}</TableCell>
                <TableCell>{p.moq}</TableCell>
                <TableCell><Chip label={p.status} size="small" color={statusColor[p.status]} /></TableCell>
                <TableCell>{p.viewCount}</TableCell>
                <TableCell>
                  <IconButton component={Link} to={`/seller/products/edit/${p._id}`} size="small"><Edit /></IconButton>
                  <IconButton onClick={() => handleDelete(p._id)} size="small" color="error"><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </>
  );
};

export default SellerProducts;
