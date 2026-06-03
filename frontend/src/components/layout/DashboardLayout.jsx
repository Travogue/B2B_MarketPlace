import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Box, Drawer, List, ListItemButton, ListItemIcon, ListItemText,
  Toolbar, AppBar, Typography, IconButton, useMediaQuery, useTheme, Divider,
} from '@mui/material';
import {
  Menu as MenuIcon, Dashboard, Inventory, People, Category, Article, Image,
  Subscriptions, QuestionAnswer, BarChart, Store, Business, Analytics,
  Favorite, Chat, Notifications, Person, Logout, RateReview,
} from '@mui/icons-material';
import { logout } from '../../store/slices/authSlice';

const menuConfig = {
  admin: [
    { label: 'Dashboard', path: '/admin', icon: Dashboard },
    { label: 'Users', path: '/admin/users', icon: People },
    { label: 'Seller Approval', path: '/admin/sellers', icon: Store },
    { label: 'Product Approval', path: '/admin/products', icon: Inventory },
    { label: 'Categories', path: '/admin/categories', icon: Category },
    { label: 'CMS Pages', path: '/admin/cms', icon: Article },
    { label: 'Banners', path: '/admin/banners', icon: Image },
    { label: 'Subscriptions', path: '/admin/subscriptions', icon: Subscriptions },
    { label: 'Inquiries', path: '/admin/inquiries', icon: QuestionAnswer },
    { label: 'Reports', path: '/admin/reports', icon: BarChart },
  ],
  seller: [
    { label: 'Dashboard', path: '/seller', icon: Dashboard },
    { label: 'Products', path: '/seller/products', icon: Inventory },
    { label: 'Company Profile', path: '/seller/company', icon: Business },
    { label: 'Inquiries', path: '/seller/inquiries', icon: QuestionAnswer },
    { label: 'Quotations', path: '/seller/quotes', icon: RateReview },
    { label: 'Subscriptions', path: '/seller/subscriptions', icon: Subscriptions },
    { label: 'Analytics', path: '/seller/analytics', icon: Analytics },
  ],
  buyer: [
    { label: 'Dashboard', path: '/buyer', icon: Dashboard },
    { label: 'Inquiries', path: '/buyer/inquiries', icon: QuestionAnswer },
    { label: 'Wishlist', path: '/buyer/wishlist', icon: Favorite },
    { label: 'Chat', path: '/buyer/chat', icon: Chat },
    { label: 'Notifications', path: '/buyer/notifications', icon: Notifications },
    { label: 'Profile', path: '/buyer/profile', icon: Person },
  ],
};

const DRAWER_WIDTH = 260;

const DashboardLayout = ({ role }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const menuItems = menuConfig[role] || [];

  const drawer = (
    <Box>
      <Toolbar>
        <Typography variant="h6" fontWeight={700} color="primary">
          {role === 'admin' ? 'Admin Panel' : role === 'seller' ? 'Seller Hub' : 'Buyer Portal'}
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItemButton
            key={item.path}
            selected={location.pathname === item.path}
            onClick={() => { navigate(item.path); setMobileOpen(false); }}
          >
            <ListItemIcon><item.icon color="primary" /></ListItemIcon>
            <ListItemText primary={item.label} />
          </ListItemButton>
        ))}
        <Divider sx={{ my: 1 }} />
        <ListItemButton onClick={() => { dispatch(logout()); navigate('/'); }}>
          <ListItemIcon><Logout color="error" /></ListItemIcon>
          <ListItemText primary="Logout" />
        </ListItemButton>
      </List>
    </Box>
  );

  return (
    <Box display="flex" minHeight="100vh">
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1, bgcolor: 'background.paper', color: 'text.primary' }}>
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" onClick={() => setMobileOpen(!mobileOpen)} sx={{ mr: 2 }}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" flexGrow={1} fontWeight={600}>
            B2B Marketplace Portal
          </Typography>
        </Toolbar>
      </AppBar>

      <Box component="nav" width={{ md: DRAWER_WIDTH }} flexShrink={{ md: 0 }}>
        {isMobile ? (
          <Drawer variant="temporary" open={mobileOpen} onClose={() => setMobileOpen(false)}
            ModalProps={{ keepMounted: true }} sx={{ '& .MuiDrawer-paper': { width: DRAWER_WIDTH } }}>
            {drawer}
          </Drawer>
        ) : (
          <Drawer variant="permanent" sx={{
            '& .MuiDrawer-paper': { width: DRAWER_WIDTH, boxSizing: 'border-box', borderRight: '1px solid #e0e0e0' },
          }}>
            {drawer}
          </Drawer>
        )}
      </Box>

      <Box component="main" flexGrow={1} p={3} sx={{ mt: 8, bgcolor: 'background.default', minHeight: '100vh' }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default DashboardLayout;
