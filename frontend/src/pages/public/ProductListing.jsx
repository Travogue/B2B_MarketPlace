import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useSearchParams, useParams } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Container, Grid, Box, Skeleton, TextField, FormControl, InputLabel, Select, MenuItem, Paper } from '@mui/material';
import { fetchProducts, fetchCategories } from '../../store/slices/uiSlice';
import ProductCard from '../../components/common/ProductCard';
import PageHeader, { PaginationBar, EmptyState } from '../../components/common/PageHeader';
import { Inventory } from '@mui/icons-material';

const sortOptions = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Top Rated' },
];

const ProductListing = () => {
  const dispatch = useDispatch();
  const { slug } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { products, pagination, categories, loading } = useSelector((state) => state.ui);
  const [filters, setFilters] = useState({
    page: 1,
    sort: 'newest',
    category: '',
    minPrice: '',
    maxPrice: '',
    search: '',
  });

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  useEffect(() => {
    const params = {
      page: searchParams.get('page') || 1,
      sort: searchParams.get('sort') || 'newest',
      category: searchParams.get('category') || '',
      minPrice: searchParams.get('minPrice') || '',
      maxPrice: searchParams.get('maxPrice') || '',
      search: searchParams.get('search') || '',
    };
    if (slug) {
      const cat = categories.find((c) => c.slug === slug);
      if (cat) params.category = cat._id;
    }
    setFilters(params);
    dispatch(fetchProducts(params));
  }, [dispatch, searchParams, slug, categories]);

  const updateParams = (updates) => {
    const newParams = new URLSearchParams(searchParams);
    Object.entries(updates).forEach(([k, v]) => {
      if (v) newParams.set(k, v);
      else newParams.delete(k);
    });
    setSearchParams(newParams);
  };

  return (
    <>
      <Helmet><title>Products - B2B Marketplace Portal</title></Helmet>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <PageHeader title="Browse Products" subtitle="Find products from verified suppliers" />

        <Grid container spacing={3}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 2, position: 'sticky', top: 80 }}>
              <TextField fullWidth size="small" label="Search" value={filters.search}
                onChange={(e) => updateParams({ search: e.target.value, page: 1 })} sx={{ mb: 2 }} />
              <FormControl fullWidth size="small" sx={{ mb: 2 }}>
                <InputLabel>Category</InputLabel>
                <Select value={filters.category} label="Category"
                  onChange={(e) => updateParams({ category: e.target.value, page: 1 })}>
                  <MenuItem value="">All</MenuItem>
                  {categories.map((c) => <MenuItem key={c._id} value={c._id}>{c.name}</MenuItem>)}
                </Select>
              </FormControl>
              <TextField fullWidth size="small" label="Min Price" type="number" sx={{ mb: 2 }}
                onBlur={(e) => updateParams({ minPrice: e.target.value, page: 1 })} />
              <TextField fullWidth size="small" label="Max Price" type="number"
                onBlur={(e) => updateParams({ maxPrice: e.target.value, page: 1 })} />
            </Paper>
          </Grid>

          <Grid item xs={12} md={9}>
            <Grid container spacing={3}>
              {loading ? Array(6).fill(null).map((_, i) => (
                <Grid item xs={12} sm={6} md={4} key={i}><Skeleton variant="rounded" height={320} /></Grid>
              )) : products.length === 0 ? (
                <Grid item xs={12}><EmptyState message="No products found" icon={Inventory} /></Grid>
              ) : products.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
            <PaginationBar
              page={pagination.page || 1}
              pages={pagination.pages || 1}
              onChange={(p) => updateParams({ page: p })}
              sort={filters.sort}
              onSortChange={(s) => updateParams({ sort: s, page: 1 })}
              sortOptions={sortOptions}
            />
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default ProductListing;
