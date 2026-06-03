import { Outlet } from 'react-router-dom';
import { Box } from '@mui/material';
import Header from './Header';
import Footer from './Footer';

const MainLayout = () => (
  <Box display="flex" flexDirection="column" minHeight="100vh">
    <Header />
    <Box component="main" flexGrow={1}>
      <Outlet />
    </Box>
    <Footer />
  </Box>
);

export default MainLayout;
