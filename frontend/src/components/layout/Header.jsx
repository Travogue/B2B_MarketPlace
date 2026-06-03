import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  AppBar, Toolbar, Typography, Button, IconButton, Box, InputBase, Badge,
  Menu, MenuItem, Container, Drawer, List, ListItem, ListItemText, Divider,
  useMediaQuery, useTheme, Avatar,
} from '@mui/material';
import {
  Search as SearchIcon, Menu as MenuIcon, Notifications as NotifIcon,
  FavoriteBorder, Person, Store, AdminPanelSettings, Logout,
} from '@mui/icons-material';
import { styled, alpha } from '@mui/material/styles';
import { logout } from '../../store/slices/authSlice';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  '&:hover': { backgroundColor: alpha(theme.palette.common.white, 0.25) },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: '100%',
  [theme.breakpoints.up('sm')]: { marginLeft: theme.spacing(3), width: 'auto', minWidth: 300 },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  width: '100%',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 1, 1, 0),
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    width: '100%',
  },
}));

const navLinks = [
  { label: 'Products', path: '/products' },
  { label: 'Categories', path: '/categories' },
  { label: 'Suppliers', path: '/suppliers' },
  { label: 'About', path: '/about-us' },
  { label: 'Contact', path: '/contact-us' },
];

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const { unreadCount } = useSelector((state) => state.notifications);
  const [search, setSearch] = useState('');
  const [anchorEl, setAnchorEl] = useState(null);
  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) navigate(`/search?q=${encodeURIComponent(search.trim())}`);
  };

  const dashboardPath = user?.role === 'super_admin' ? '/admin' : user?.role === 'seller' ? '/seller' : '/buyer';

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
    setAnchorEl(null);
  };

  return (
    <AppBar position="sticky" color="primary" elevation={1}>
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ gap: 1 }}>
          {isMobile && (
            <IconButton color="inherit" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component={Link}
            to="/"
            sx={{ fontWeight: 700, color: 'inherit', mr: 2, whiteSpace: 'nowrap' }}
          >
            B2B Marketplace
          </Typography>

          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              {navLinks.map((link) => (
                <Button key={link.path} color="inherit" component={Link} to={link.path} size="small">
                  {link.label}
                </Button>
              ))}
            </Box>
          )}

          <Box sx={{ flexGrow: 1 }} />

          <Box component="form" onSubmit={handleSearch}>
            <Search>
              <SearchIconWrapper><SearchIcon /></SearchIconWrapper>
              <StyledInputBase
                placeholder="Search products, suppliers..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </Search>
          </Box>

          {isAuthenticated ? (
            <>
              <IconButton color="inherit" component={Link} to={`${dashboardPath}/notifications`}>
                <Badge badgeContent={unreadCount} color="error">
                  <NotifIcon />
                </Badge>
              </IconButton>
              {user?.role === 'buyer' && (
                <IconButton color="inherit" component={Link} to="/buyer/wishlist">
                  <FavoriteBorder />
                </IconButton>
              )}
              <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
                <Avatar sx={{ width: 32, height: 32, bgcolor: 'secondary.main', fontSize: 14 }}>
                  {user?.name?.charAt(0)}
                </Avatar>
              </IconButton>
              <Menu anchorEl={anchorEl} open={Boolean(anchorEl)} onClose={() => setAnchorEl(null)}>
                <MenuItem onClick={() => { navigate(dashboardPath); setAnchorEl(null); }}>
                  {user?.role === 'super_admin' ? <AdminPanelSettings sx={{ mr: 1 }} /> :
                   user?.role === 'seller' ? <Store sx={{ mr: 1 }} /> : <Person sx={{ mr: 1 }} />}
                  Dashboard
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleLogout}><Logout sx={{ mr: 1 }} /> Logout</MenuItem>
              </Menu>
            </>
          ) : (
            <>
              <Button color="inherit" component={Link} to="/login">Login</Button>
              <Button variant="contained" color="secondary" component={Link} to="/register" sx={{ ml: 1 }}>
                Register
              </Button>
            </>
          )}
        </Toolbar>
      </Container>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250, pt: 2 }}>
          <List>
            {navLinks.map((link) => (
              <ListItem key={link.path} component={Link} to={link.path} onClick={() => setDrawerOpen(false)}>
                <ListItemText primary={link.label} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>
    </AppBar>
  );
};

export default Header;
