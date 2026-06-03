import { Box, Container, Grid, Typography, Link as MuiLink, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, LinkedIn, Email, Phone, LocationOn } from '@mui/icons-material';

const footerLinks = {
  Company: [
    { label: 'About Us', path: '/about-us' },
    { label: 'Contact Us', path: '/contact-us' },
    { label: 'FAQ', path: '/faq' },
  ],
  Legal: [
    { label: 'Privacy Policy', path: '/privacy-policy' },
    { label: 'Terms & Conditions', path: '/terms-conditions' },
  ],
  Marketplace: [
    { label: 'Browse Products', path: '/products' },
    { label: 'Categories', path: '/categories' },
    { label: 'Suppliers', path: '/suppliers' },
  ],
  Account: [
    { label: 'Login', path: '/login' },
    { label: 'Register as Buyer', path: '/register?role=buyer' },
    { label: 'Register as Seller', path: '/register?role=seller' },
  ],
};

const Footer = () => (
  <Box component="footer" sx={{ bgcolor: '#1A1A2E', color: '#fff', pt: 6, pb: 3, mt: 'auto' }}>
    <Container maxWidth="xl">
      <Grid container spacing={4}>
        <Grid item xs={12} md={4}>
          <Typography variant="h6" fontWeight={700} gutterBottom>
            B2B Marketplace Portal
          </Typography>
          <Typography variant="body2" color="grey.400" paragraph>
            India's leading B2B marketplace connecting buyers with verified manufacturers, traders, and distributors.
          </Typography>
          <Box display="flex" gap={1}>
            {[Facebook, Twitter, LinkedIn].map((Icon, i) => (
              <IconButton key={i} size="small" sx={{ color: 'grey.400' }}><Icon fontSize="small" /></IconButton>
            ))}
          </Box>
        </Grid>

        {Object.entries(footerLinks).map(([title, links]) => (
          <Grid item xs={6} sm={3} md={2} key={title}>
            <Typography variant="subtitle2" fontWeight={600} gutterBottom color="secondary.light">
              {title}
            </Typography>
            {links.map((link) => (
              <Typography key={link.path} variant="body2" sx={{ mb: 0.5 }}>
                <MuiLink component={Link} to={link.path} color="grey.400" underline="hover">
                  {link.label}
                </MuiLink>
              </Typography>
            ))}
          </Grid>
        ))}

        <Grid item xs={12} md={2}>
          <Typography variant="subtitle2" fontWeight={600} gutterBottom color="secondary.light">
            Contact
          </Typography>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Email fontSize="small" color="disabled" />
            <Typography variant="body2" color="grey.400">support@b2bmarketplace.com</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1} mb={1}>
            <Phone fontSize="small" color="disabled" />
            <Typography variant="body2" color="grey.400">+91 1800-123-4567</Typography>
          </Box>
          <Box display="flex" alignItems="center" gap={1}>
            <LocationOn fontSize="small" color="disabled" />
            <Typography variant="body2" color="grey.400">Mumbai, India</Typography>
          </Box>
        </Grid>
      </Grid>

      <Box borderTop="1px solid rgba(255,255,255,0.1)" mt={4} pt={3} textAlign="center">
        <Typography variant="body2" color="grey.500">
          © {new Date().getFullYear()} B2B Marketplace Portal. All rights reserved.
        </Typography>
      </Box>
    </Container>
  </Box>
);

export default Footer;
