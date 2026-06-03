import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Paper, TextField, Button, Grid, FormControl, InputLabel, Select, MenuItem, Typography } from '@mui/material';
import { productAPI, categoryAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';

const SellerProductForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [form, setForm] = useState({
    name: '', description: '', shortDescription: '', category: '', subcategory: '',
    moq: 1, priceRange: { min: 0, max: 0, unit: 'piece' }, tags: '', specifications: [],
  });
  const [specKey, setSpecKey] = useState('');
  const [specValue, setSpecValue] = useState('');

  useEffect(() => {
    categoryAPI.getAll().then(({ data }) => setCategories(data.data));
    if (id) {
      productAPI.getAll().then(({ data }) => {
        const product = data.data.products.find((p) => p._id === id);
        if (product) setForm({ ...product, tags: product.tags?.join(', ') || '' });
      });
    }
  }, [id]);

  useEffect(() => {
    if (form.category) {
      categoryAPI.getSubcategories({ category: form.category }).then(({ data }) => setSubcategories(data.data));
    }
  }, [form.category]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags.split(',').map((t) => t.trim()).filter(Boolean),
      priceRange: { ...form.priceRange, min: Number(form.priceRange.min), max: Number(form.priceRange.max) },
    };
    try {
      if (id) await productAPI.update(id, payload);
      else await productAPI.create(payload);
      toast.success(id ? 'Product updated' : 'Product created');
      navigate('/seller/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to save product');
    }
  };

  const addSpec = () => {
    if (specKey && specValue) {
      setForm({ ...form, specifications: [...form.specifications, { key: specKey, value: specValue }] });
      setSpecKey('');
      setSpecValue('');
    }
  };

  return (
    <>
      <PageHeader title={id ? 'Edit Product' : 'Add New Product'} />
      <Paper sx={{ p: 3 }}>
        <Grid container spacing={2} component="form" onSubmit={handleSubmit}>
          <Grid item xs={12}><TextField fullWidth label="Product Name" required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Grid>
          <Grid item xs={12}><TextField fullWidth label="Short Description" value={form.shortDescription} onChange={(e) => setForm({ ...form, shortDescription: e.target.value })} /></Grid>
          <Grid item xs={12}><TextField fullWidth label="Description" multiline rows={4} required value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth required>
              <InputLabel>Category</InputLabel>
              <Select value={form.category} label="Category" onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {categories.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} sm={6}>
            <FormControl fullWidth>
              <InputLabel>Subcategory</InputLabel>
              <Select value={form.subcategory} label="Subcategory" onChange={(e) => setForm({ ...form, subcategory: e.target.value })}>
                {subcategories.map((s) => <MenuItem key={s._id} value={s._id}>{s.name}</MenuItem>)}
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={4}><TextField fullWidth label="Min Price" type="number" required value={form.priceRange.min} onChange={(e) => setForm({ ...form, priceRange: { ...form.priceRange, min: e.target.value } })} /></Grid>
          <Grid item xs={4}><TextField fullWidth label="Max Price" type="number" required value={form.priceRange.max} onChange={(e) => setForm({ ...form, priceRange: { ...form.priceRange, max: e.target.value } })} /></Grid>
          <Grid item xs={4}><TextField fullWidth label="MOQ" type="number" value={form.moq} onChange={(e) => setForm({ ...form, moq: e.target.value })} /></Grid>
          <Grid item xs={12}><TextField fullWidth label="Tags (comma separated)" value={form.tags} onChange={(e) => setForm({ ...form, tags: e.target.value })} /></Grid>
          <Grid item xs={12}>
            <Typography variant="subtitle2" gutterBottom>Specifications</Typography>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={5}><TextField fullWidth size="small" label="Key" value={specKey} onChange={(e) => setSpecKey(e.target.value)} /></Grid>
              <Grid item xs={5}><TextField fullWidth size="small" label="Value" value={specValue} onChange={(e) => setSpecValue(e.target.value)} /></Grid>
              <Grid item xs={2}><Button onClick={addSpec}>Add</Button></Grid>
            </Grid>
            {form.specifications.map((s, i) => (
              <Typography key={i} variant="body2">{s.key}: {s.value}</Typography>
            ))}
          </Grid>
          <Grid item xs={12}>
            <Button type="submit" variant="contained" size="large">{id ? 'Update Product' : 'Create Product'}</Button>
          </Grid>
        </Grid>
      </Paper>
    </>
  );
};

export default SellerProductForm;
