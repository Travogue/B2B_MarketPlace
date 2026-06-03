import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import {
  Container, Grid, Typography, Box, Avatar, Rating, Chip, Paper, Divider, Card, CardContent,
} from '@mui/material';
import { Verified, WorkspacePremium, LocationOn, Email, Phone, Language } from '@mui/icons-material';
import { companyAPI } from '../../services';
import ProductCard from '../../components/common/ProductCard';

const SupplierProfile = () => {
  const { slug } = useParams();
  const [data, setData] = useState(null);

  useEffect(() => {
    companyAPI.getBySlug(slug).then(({ data: res }) => setData(res.data));
  }, [slug]);

  if (!data) return <Container sx={{ py: 4 }}><Typography>Loading...</Typography></Container>;

  const { company, products, reviews } = data;

  return (
    <>
      <Helmet><title>{company.companyName} - B2B Marketplace</title></Helmet>
      <Box sx={{ bgcolor: 'primary.main', color: '#fff', py: 4 }}>
        <Container maxWidth="xl">
          <Box display="flex" alignItems="center" gap={3} flexWrap="wrap">
            <Avatar src={company.logo} sx={{ width: 80, height: 80, bgcolor: 'secondary.main', fontSize: 32 }}>
              {company.companyName?.charAt(0)}
            </Avatar>
            <Box flex={1}>
              <Box display="flex" alignItems="center" gap={1} mb={1}>
                <Typography variant="h4" fontWeight={700}>{company.companyName}</Typography>
                {company.isVerified && <Verified />}
                {company.isPremium && <WorkspacePremium color="secondary" />}
              </Box>
              <Box display="flex" alignItems="center" gap={2} flexWrap="wrap">
                <Rating value={company.rating} readOnly size="small" sx={{ '& .MuiRating-iconFilled': { color: '#FFD700' } }} />
                <Chip label={company.businessType} size="small" sx={{ bgcolor: 'rgba(255,255,255,0.2)', color: '#fff' }} />
                {company.address?.city && (
                  <Box display="flex" alignItems="center" gap={0.5}>
                    <LocationOn fontSize="small" />
                    <Typography variant="body2">{[company.address.city, company.address.state].join(', ')}</Typography>
                  </Box>
                )}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" fontWeight={600} gutterBottom>About Company</Typography>
            <Typography variant="body1" color="text.secondary" paragraph>{company.description || 'No description available.'}</Typography>

            <Divider sx={{ my: 3 }} />
            <Typography variant="h5" fontWeight={600} gutterBottom>Product Catalog</Typography>
            <Grid container spacing={2}>
              {products?.map((product) => (
                <Grid item xs={12} sm={6} md={4} key={product._id}>
                  <ProductCard product={product} />
                </Grid>
              ))}
            </Grid>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>Business Information</Typography>
              {company.gstNumber && <Typography variant="body2" mb={1}><strong>GST:</strong> {company.gstNumber}</Typography>}
              {company.yearEstablished && <Typography variant="body2" mb={1}><strong>Established:</strong> {company.yearEstablished}</Typography>}
              {company.employeeCount && <Typography variant="body2" mb={1}><strong>Employees:</strong> {company.employeeCount}</Typography>}
              {company.annualTurnover && <Typography variant="body2" mb={1}><strong>Turnover:</strong> {company.annualTurnover}</Typography>}
            </Paper>

            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} gutterBottom>Contact</Typography>
              {company.contactEmail && <Box display="flex" alignItems="center" gap={1} mb={1}><Email fontSize="small" /><Typography variant="body2">{company.contactEmail}</Typography></Box>}
              {company.contactPhone && <Box display="flex" alignItems="center" gap={1} mb={1}><Phone fontSize="small" /><Typography variant="body2">{company.contactPhone}</Typography></Box>}
              {company.website && <Box display="flex" alignItems="center" gap={1}><Language fontSize="small" /><Typography variant="body2">{company.website}</Typography></Box>}
            </Paper>

            {reviews?.length > 0 && (
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight={600} gutterBottom>Reviews</Typography>
                {reviews.map((review) => (
                  <Card key={review._id} variant="outlined" sx={{ mb: 1 }}>
                    <CardContent sx={{ py: 1.5, '&:last-child': { pb: 1.5 } }}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography variant="subtitle2">{review.reviewer?.name}</Typography>
                        <Rating value={review.rating} readOnly size="small" />
                      </Box>
                      <Typography variant="body2" color="text.secondary">{review.comment}</Typography>
                    </CardContent>
                  </Card>
                ))}
              </Paper>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default SupplierProfile;
