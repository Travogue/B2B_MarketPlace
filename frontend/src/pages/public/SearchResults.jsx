import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Container, Grid, Typography, Box, Tabs, Tab, Paper } from '@mui/material';
import { searchAPI } from '../../services';
import ProductCard from '../../components/common/ProductCard';
import SupplierCard from '../../components/common/SupplierCard';
import PageHeader from '../../components/common/PageHeader';

const SearchResults = () => {
  const [searchParams] = useSearchParams();
  const q = searchParams.get('q') || '';
  const [results, setResults] = useState({ products: [], companies: [], categories: [] });
  const [tab, setTab] = useState(0);

  useEffect(() => {
    if (q) searchAPI.global(q).then(({ data }) => setResults(data.data));
  }, [q]);

  return (
    <>
      <Helmet><title>Search: {q} - B2B Marketplace</title></Helmet>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <PageHeader title={`Search Results for "${q}"`} subtitle={`${results.products?.length || 0} products, ${results.companies?.length || 0} suppliers found`} />
        <Tabs value={tab} onChange={(_, v) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label={`Products (${results.products?.length || 0})`} />
          <Tab label={`Suppliers (${results.companies?.length || 0})`} />
          <Tab label={`Categories (${results.categories?.length || 0})`} />
        </Tabs>

        {tab === 0 && (
          <Grid container spacing={3}>
            {results.products?.map((p) => (
              <Grid item xs={12} sm={6} md={3} key={p._id}><ProductCard product={p} /></Grid>
            ))}
          </Grid>
        )}
        {tab === 1 && (
          <Grid container spacing={3}>
            {results.companies?.map((c) => (
              <Grid item xs={12} sm={6} md={3} key={c._id}><SupplierCard company={c} /></Grid>
            ))}
          </Grid>
        )}
        {tab === 2 && (
          <Grid container spacing={2}>
            {results.categories?.map((c) => (
              <Grid item xs={12} sm={6} md={3} key={c._id}>
                <Paper sx={{ p: 2 }}>
                  <Typography variant="subtitle1" fontWeight={600} component={Link} to={`/categories/${c.slug}`}>{c.name}</Typography>
                </Paper>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default SearchResults;
