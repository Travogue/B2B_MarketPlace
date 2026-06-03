import { Card, CardMedia, CardContent, Typography, Box, Chip, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';

const ProductCard = ({ product }) => {
  const primaryImage = product.images?.find((i) => i.isPrimary)?.url || product.images?.[0]?.url;
  const priceDisplay = product.priceRange
    ? `₹${product.priceRange.min?.toLocaleString()} - ₹${product.priceRange.max?.toLocaleString()}`
    : 'Price on Request';

  return (
    <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
      <CardMedia
        component="img"
        height="180"
        image={primaryImage || 'https://via.placeholder.com/300x180?text=No+Image'}
        alt={product.name}
        sx={{ objectFit: 'cover' }}
      />
      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Typography variant="subtitle1" fontWeight={600} gutterBottom noWrap>
          {product.name}
        </Typography>
        {product.company && (
          <Box display="flex" alignItems="center" gap={0.5} mb={1}>
            <Typography variant="body2" color="text.secondary" noWrap>
              {product.company.companyName}
            </Typography>
            {product.company.isVerified && <VerifiedIcon color="primary" sx={{ fontSize: 16 }} />}
          </Box>
        )}
        <Typography variant="h6" color="primary.main" fontWeight={700} mb={1}>
          {priceDisplay}
        </Typography>
        <Box display="flex" gap={0.5} mb={1.5} flexWrap="wrap">
          {product.moq && <Chip label={`MOQ: ${product.moq}`} size="small" variant="outlined" />}
          {product.category?.name && <Chip label={product.category.name} size="small" />}
        </Box>
        <Button component={Link} to={`/products/${product.slug}`} variant="outlined" size="small" fullWidth sx={{ mt: 'auto' }}>
          View Details
        </Button>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
