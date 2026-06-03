import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { Container, Grid, Typography } from '@mui/material';
import { fetchCategories } from '../../store/slices/uiSlice';
import CategoryCard from '../../components/common/CategoryCard';
import PageHeader from '../../components/common/PageHeader';

const CategoriesPage = () => {
  const dispatch = useDispatch();
  const { categories } = useSelector((state) => state.ui);

  useEffect(() => { dispatch(fetchCategories()); }, [dispatch]);

  return (
    <>
      <Helmet><title>Product Categories - B2B Marketplace</title></Helmet>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <PageHeader title="Product Categories" subtitle="Browse products by industry category" />
        <Grid container spacing={3}>
          {categories.map((cat) => (
            <Grid item xs={6} sm={4} md={3} key={cat._id}><CategoryCard category={cat} /></Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default CategoriesPage;
