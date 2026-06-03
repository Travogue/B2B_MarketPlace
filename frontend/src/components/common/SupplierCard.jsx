import { Card, CardContent, Avatar, Typography, Box, Chip, Rating, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import VerifiedIcon from '@mui/icons-material/Verified';
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

const SupplierCard = ({ company }) => (
  <Card sx={{ height: '100%', transition: 'transform 0.2s', '&:hover': { transform: 'translateY(-4px)' } }}>
    <CardContent>
      <Box display="flex" alignItems="center" gap={2} mb={2}>
        <Avatar src={company.logo} alt={company.companyName} sx={{ width: 56, height: 56, bgcolor: 'primary.light' }}>
          {company.companyName?.charAt(0)}
        </Avatar>
        <Box flex={1}>
          <Box display="flex" alignItems="center" gap={0.5}>
            <Typography variant="subtitle1" fontWeight={600} noWrap>{company.companyName}</Typography>
            {company.isVerified && <VerifiedIcon color="primary" sx={{ fontSize: 18 }} />}
            {company.isPremium && <WorkspacePremiumIcon color="secondary" sx={{ fontSize: 18 }} />}
          </Box>
          <Typography variant="body2" color="text.secondary">
            {[company.address?.city, company.address?.state].filter(Boolean).join(', ')}
          </Typography>
        </Box>
      </Box>
      <Box display="flex" alignItems="center" gap={1} mb={1.5}>
        <Rating value={company.rating || 0} readOnly size="small" precision={0.5} />
        <Typography variant="body2" color="text.secondary">({company.reviewCount || 0})</Typography>
      </Box>
      <Box display="flex" gap={1} mb={2} flexWrap="wrap">
        <Chip label={company.businessType} size="small" color="primary" variant="outlined" />
        <Chip label={`${company.productCount || 0} Products`} size="small" />
      </Box>
      <Button component={Link} to={`/suppliers/${company.slug}`} variant="contained" size="small" fullWidth>
        View Profile
      </Button>
    </CardContent>
  </Card>
);

export default SupplierCard;
