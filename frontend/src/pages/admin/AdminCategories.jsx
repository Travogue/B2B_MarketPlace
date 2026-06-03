import { useEffect, useState } from 'react';
import { Paper, Table, TableBody, TableCell, TableHead, TableRow, Button, Dialog, DialogTitle, DialogContent, TextField, DialogActions, IconButton } from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import { toast } from 'react-toastify';
import { categoryAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');

  const load = () => categoryAPI.getAll({ all: true }).then(({ data }) => setCategories(data.data));

  useEffect(() => { load(); }, []);

  const handleCreate = async () => {
    await categoryAPI.create({ name });
    toast.success('Category created');
    setOpen(false);
    setName('');
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('Delete category?')) return;
    await categoryAPI.delete(id);
    toast.success('Deleted');
    load();
  };

  return (
    <>
      <PageHeader title="Category Management" action={<Button variant="contained" startIcon={<Add />} onClick={() => setOpen(true)}>Add Category</Button>} />
      <Paper>
        <Table>
          <TableHead><TableRow><TableCell>Name</TableCell><TableCell>Slug</TableCell><TableCell>Products</TableCell><TableCell>Actions</TableCell></TableRow></TableHead>
          <TableBody>
            {categories.map((c) => (
              <TableRow key={c._id}>
                <TableCell>{c.name}</TableCell>
                <TableCell>{c.slug}</TableCell>
                <TableCell>{c.productCount}</TableCell>
                <TableCell><IconButton color="error" onClick={() => handleDelete(c._id)}><Delete /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add Category</DialogTitle>
        <DialogContent><TextField fullWidth label="Category Name" margin="normal" value={name} onChange={(e) => setName(e.target.value)} /></DialogContent>
        <DialogActions><Button onClick={() => setOpen(false)}>Cancel</Button><Button variant="contained" onClick={handleCreate}>Create</Button></DialogActions>
      </Dialog>
    </>
  );
};

export default AdminCategories;
