import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Box, Container, Typography, Button, Grid, TextField, InputAdornment,
  Card, CardContent, Avatar, Rating, Skeleton,
} from '@mui/material';
import { Search, ArrowForward, VerifiedUser } from '@mui/icons-material';
import { fetchHomeData } from '../../store/slices/uiSlice';
import ProductCard from '../../components/common/ProductCard';
import SupplierCard from '../../components/common/SupplierCard';
import CategoryCard from '../../components/common/CategoryCard';

const HomePage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { homeData, loading } = useSelector((state) => state.ui);

  useEffect(() => { dispatch(fetchHomeData()); }, [dispatch]);

  const handleSearch = (e) => {
    e.preventDefault();
    const q = e.target.search.value.trim();
    if (q) navigate(`/search?q=${encodeURIComponent(q)}`);
  };

  const heroBanner = homeData?.banners?.[0];

  return (
    <>
      <Helmet>
        <title>B2B Marketplace Portal - Connect with Verified Suppliers</title>
        <meta name="description" content="India's leading B2B marketplace. Find manufacturers, traders and distributors." />
      </Helmet>

      {/* Hero Section */}
      <Box
        sx={{
          background: heroBanner?.image
            ? `linear-gradient(rgba(13,71,161,0.85), rgba(13,71,161,0.85)), url(${heroBanner.image}) center/cover`
            : 'linear-gradient(135deg, #0D47A1 0%, #1565C0 100%)',
          color: '#fff',
          py: { xs: 6, md: 10 },
        }}
      >
        <Container maxWidth="lg" textAlign="center">
          <Typography variant="h2" fontWeight={700} gutterBottom sx={{ fontSize: { xs: '2rem', md: '3rem' } }}>
            {heroBanner?.title || 'Connect with Verified B2B Suppliers'}
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9, mb: 4, fontSize: { xs: '1rem', md: '1.25rem' } }}>
            {heroBanner?.subtitle || 'Find manufacturers, traders & distributors across India'}
          </Typography>

          <Box component="form" onSubmit={handleSearch} maxWidth={600} mx="auto" mb={3}>
            <TextField
              name="search"
              fullWidth
              placeholder="Search products, suppliers, categories..."
              InputProps={{
                startAdornment: <InputAdornment position="start"><Search sx={{ color: 'grey.500' }} /></InputAdornment>,
                sx: { bgcolor: '#fff', borderRadius: 2 },
              }}
            />
          </Box>

          <Box display="flex" gap={2} justifyContent="center" flexWrap="wrap">
            <Button variant="contained" color="secondary" size="large" component={Link} to="/products" endIcon={<ArrowForward />}>
              Browse Products
            </Button>
            <Button variant="outlined" size="large" component={Link} to="/register?role=seller"
              sx={{ color: '#fff', borderColor: '#fff', '&:hover': { borderColor: '#fff', bgcolor: 'rgba(255,255,255,0.1)' } }}>
              Register as Supplier
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Featured Categories */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={1}>Featured Categories</Typography>
        <Typography variant="body1" color="text.secondary" textAlign="center" mb={4}>Explore products by industry</Typography>
        <Grid container spacing={2}>
          {(loading ? Array(8).fill(null) : homeData?.categories?.slice(0, 8) || []).map((cat, i) => (
            <Grid item xs={6} sm={4} md={3} key={cat?._id || i}>
              {loading ? <Skeleton variant="rounded" height={140} /> : <CategoryCard category={cat} />}
            </Grid>
          ))}
        </Grid>
        <Box textAlign="center" mt={3}>
          <Button component={Link} to="/categories" variant="outlined">View All Categories</Button>
        </Box>
      </Container>

      {/* Trending Products */}
      <Box bgcolor="background.default" py={6}>
        <Container maxWidth="xl">
          <Typography variant="h4" fontWeight={700} mb={4}>Trending Products</Typography>
          <Grid container spacing={3}>
            {(loading ? Array(4).fill(null) : homeData?.trending || []).map((product, i) => (
              <Grid item xs={12} sm={6} md={3} key={product?._id || i}>
                {loading ? <Skeleton variant="rounded" height={320} /> : <ProductCard product={product} />}
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Top Suppliers */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
          <Typography variant="h4" fontWeight={700}>Top Suppliers</Typography>
          <Button component={Link} to="/suppliers" endIcon={<ArrowForward />}>View All</Button>
        </Box>
        <Grid container spacing={3}>
          {(homeData?.topSuppliers || []).map((company) => (
            <Grid item xs={12} sm={6} md={3} key={company._id}>
              <SupplierCard company={company} />
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Premium Suppliers */}
      {(homeData?.premiumSuppliers?.length > 0) && (
        <Box bgcolor="primary.main" color="#fff" py={6}>
          <Container maxWidth="xl">
            <Typography variant="h4" fontWeight={700} mb={4}>Premium Suppliers</Typography>
            <Grid container spacing={3}>
              {homeData.premiumSuppliers.map((company) => (
                <Grid item xs={12} sm={6} md={3} key={company._id}>
                  <SupplierCard company={company} />
                </Grid>
              ))}
            </Grid>
          </Container>
        </Box>
      )}

      {/* Customer Reviews */}
      <Container maxWidth="xl" sx={{ py: 6 }}>
        <Typography variant="h4" fontWeight={700} textAlign="center" mb={4}>What Our Customers Say</Typography>
        <Grid container spacing={3}>
          {(homeData?.reviews || []).map((review) => (
            <Grid item xs={12} md={4} key={review._id}>
              <Card sx={{ height: '100%' }}>
                <CardContent>
                  <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar src={review.reviewer?.avatar}>{review.reviewer?.name?.charAt(0)}</Avatar>
                    <Box>
                      <Typography variant="subtitle2" fontWeight={600}>{review.reviewer?.name}</Typography>
                      <Rating value={review.rating} readOnly size="small" />
                    </Box>
                  </Box>
                  <Typography variant="body2" color="text.secondary">{review.comment}</Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box bgcolor="secondary.main" color="#fff" py={6} textAlign="center">
        <Container maxWidth="md">
          <VerifiedUser sx={{ fontSize: 48, mb: 2 }} />
          <Typography variant="h4" fontWeight={700} gutterBottom>Join as a Verified Supplier</Typography>
          <Typography variant="body1" sx={{ opacity: 0.9, mb: 3 }}>
            Reach millions of buyers. List your products and grow your business.
          </Typography>
          <Button variant="contained" size="large" component={Link} to="/register?role=seller"
            sx={{ bgcolor: '#fff', color: 'secondary.main', '&:hover': { bgcolor: '#f5f5f5' } }}>
            Get Started Free
          </Button>
        </Container>
      </Box>
    </>
  );
};

export default HomePage;
