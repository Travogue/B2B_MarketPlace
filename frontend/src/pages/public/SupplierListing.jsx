import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Grid, Skeleton } from '@mui/material';
import { companyAPI } from '../../services';
import SupplierCard from '../../components/common/SupplierCard';
import PageHeader, { PaginationBar, EmptyState } from '../../components/common/PageHeader';
import { Store } from '@mui/icons-material';

const SupplierListing = () => {
  const [data, setData] = useState({ companies: [], pagination: {} });
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);

  useEffect(() => {
    setLoading(true);
    companyAPI.getAll({ page, limit: 12 }).then(({ data: res }) => {
      setData(res.data);
      setLoading(false);
    });
  }, [page]);

  return (
    <>
      <Helmet><title>Suppliers - B2B Marketplace Portal</title></Helmet>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <PageHeader title="Verified Suppliers" subtitle="Connect with trusted B2B suppliers across India" />
        <Grid container spacing={3}>
          {loading ? Array(8).fill(null).map((_, i) => (
            <Grid item xs={12} sm={6} md={3} key={i}><Skeleton variant="rounded" height={220} /></Grid>
          )) : data.companies?.length === 0 ? (
            <Grid item xs={12}><EmptyState message="No suppliers found" icon={Store} /></Grid>
          ) : data.companies?.map((company) => (
            <Grid item xs={12} sm={6} md={3} key={company._id}><SupplierCard company={company} /></Grid>
          ))}
        </Grid>
        <PaginationBar page={page} pages={data.pagination?.pages || 1} onChange={setPage} />
      </Container>
    </>
  );
};

export default SupplierListing;
