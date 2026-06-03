import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Helmet } from 'react-helmet-async';
import { toast } from 'react-toastify';
import {
  Container, Grid, Typography, Box, Button, Chip, Table, TableBody, TableCell,
  TableRow, Paper, Rating, Divider, Dialog, DialogTitle, DialogContent, TextField, DialogActions,
} from '@mui/material';
import { Verified, FavoriteBorder, RequestQuote, Chat } from '@mui/icons-material';
import { productAPI, inquiryAPI, userAPI } from '../../services';

const ProductDetails = () => {
  const { slug } = useParams();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rfqOpen, setRfqOpen] = useState(false);
  const [rfqData, setRfqData] = useState({ subject: '', message: '', quantity: 1 });

  useEffect(() => {
    productAPI.getBySlug(slug).then(({ data }) => {
      setProduct(data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  const handleRFQ = async () => {
    try {
      await inquiryAPI.create({ ...rfqData, product: product._id });
      toast.success('Inquiry submitted successfully!');
      setRfqOpen(false);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit inquiry');
    }
  };

  const handleWishlist = async () => {
    try {
      await userAPI.toggleWishlist(product._id);
      toast.success('Wishlist updated');
    } catch {
      toast.error('Failed to update wishlist');
    }
  };

  if (loading) return <Container sx={{ py: 4 }}><Typography>Loading...</Typography></Container>;
  if (!product) return <Container sx={{ py: 4 }}><Typography>Product not found</Typography></Container>;

  const primaryImage = product.images?.find((i) => i.isPrimary)?.url || product.images?.[0]?.url;

  return (
    <>
      <Helmet>
        <title>{product.seo?.metaTitle || product.name} - B2B Marketplace</title>
        <meta name="description" content={product.seo?.metaDescription || product.shortDescription} />
      </Helmet>
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={5}>
            <Paper sx={{ p: 2 }}>
              <Box component="img" src={primaryImage || 'https://via.placeholder.com/500'} alt={product.name}
                sx={{ width: '100%', borderRadius: 2, maxHeight: 400, objectFit: 'cover' }} />
              <Box display="flex" gap={1} mt={2} flexWrap="wrap">
                {product.images?.map((img, i) => (
                  <Box key={i} component="img" src={img.url} alt="" sx={{ width: 72, height: 72, objectFit: 'cover', borderRadius: 1, cursor: 'pointer' }} />
                ))}
              </Box>
            </Paper>
          </Grid>

          <Grid item xs={12} md={7}>
            <Typography variant="h4" fontWeight={700} gutterBottom>{product.name}</Typography>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
              <Rating value={product.rating} readOnly size="small" precision={0.5} />
              <Typography variant="body2" color="text.secondary">({product.reviewCount} reviews)</Typography>
            </Box>

            <Typography variant="h5" color="primary.main" fontWeight={700} mb={2}>
              ₹{product.priceRange?.min?.toLocaleString()} - ₹{product.priceRange?.max?.toLocaleString()} / {product.priceRange?.unit}
            </Typography>

            <Box display="flex" gap={1} mb={2} flexWrap="wrap">
              <Chip label={`MOQ: ${product.moq} ${product.priceRange?.unit}`} color="primary" />
              {product.tags?.map((tag) => <Chip key={tag} label={tag} size="small" variant="outlined" />)}
            </Box>

            <Typography variant="body1" color="text.secondary" paragraph>{product.shortDescription || product.description?.substring(0, 200)}</Typography>

            {product.company && (
              <Paper variant="outlined" sx={{ p: 2, mb: 3 }}>
                <Box display="flex" alignItems="center" gap={1}>
                  <Typography variant="subtitle1" fontWeight={600} component={Link} to={`/suppliers/${product.company.slug}`}>
                    {product.company.companyName}
                  </Typography>
                  {product.company.isVerified && <Verified color="primary" fontSize="small" />}
                </Box>
              </Paper>
            )}

            <Box display="flex" gap={2} flexWrap="wrap">
              {isAuthenticated && user?.role === 'buyer' && (
                <>
                  <Button variant="contained" startIcon={<RequestQuote />} onClick={() => setRfqOpen(true)}>Request Quote</Button>
                  <Button variant="outlined" startIcon={<FavoriteBorder />} onClick={handleWishlist}>Wishlist</Button>
                  <Button variant="outlined" startIcon={<Chat />}>Chat Supplier</Button>
                </>
              )}
              {!isAuthenticated && (
                <Button variant="contained" component={Link} to="/login">Login to Request Quote</Button>
              )}
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 4 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Typography variant="h5" fontWeight={600} gutterBottom>Product Description</Typography>
            <Typography variant="body1" color="text.secondary" paragraph whiteSpace="pre-line">{product.description}</Typography>
          </Grid>
          <Grid item xs={12} md={4}>
            <Typography variant="h5" fontWeight={600} gutterBottom>Specifications</Typography>
            <Table size="small">
              <TableBody>
                {product.specifications?.map((spec, i) => (
                  <TableRow key={i}>
                    <TableCell sx={{ fontWeight: 600 }}>{spec.key}</TableCell>
                    <TableCell>{spec.value}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Grid>
        </Grid>
      </Container>

      <Dialog open={rfqOpen} onClose={() => setRfqOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Request for Quote (RFQ)</DialogTitle>
        <DialogContent>
          <TextField fullWidth label="Subject" margin="normal" value={rfqData.subject}
            onChange={(e) => setRfqData({ ...rfqData, subject: e.target.value })} />
          <TextField fullWidth label="Quantity" type="number" margin="normal" value={rfqData.quantity}
            onChange={(e) => setRfqData({ ...rfqData, quantity: parseInt(e.target.value) })} />
          <TextField fullWidth label="Message" multiline rows={4} margin="normal" value={rfqData.message}
            onChange={(e) => setRfqData({ ...rfqData, message: e.target.value })} />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRfqOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleRFQ}>Submit Inquiry</Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default ProductDetails;
