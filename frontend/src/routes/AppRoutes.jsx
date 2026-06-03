import { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import MainLayout from '../components/layout/MainLayout';
import DashboardLayout from '../components/layout/DashboardLayout';
import ProtectedRoute from './ProtectedRoute';

const HomePage = lazy(() => import('../pages/public/HomePage'));
const ProductListing = lazy(() => import('../pages/public/ProductListing'));
const ProductDetails = lazy(() => import('../pages/public/ProductDetails'));
const CategoriesPage = lazy(() => import('../pages/public/CategoriesPage'));
const SupplierListing = lazy(() => import('../pages/public/SupplierListing'));
const SupplierProfile = lazy(() => import('../pages/public/SupplierProfile'));
const SearchResults = lazy(() => import('../pages/public/SearchResults'));
const CMSPage = lazy(() => import('../pages/public/CMSPage'));
const ContactPage = lazy(() => import('../pages/public/ContactPage'));
const LoginPage = lazy(() => import('../pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('../pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(() => import('../pages/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('../pages/auth/ResetPasswordPage'));

const BuyerDashboard = lazy(() => import('../pages/buyer/BuyerDashboard'));
const BuyerInquiries = lazy(() => import('../pages/buyer/BuyerInquiries'));
const BuyerWishlist = lazy(() => import('../pages/buyer/BuyerWishlist'));
const BuyerProfile = lazy(() => import('../pages/buyer/BuyerProfile'));
const BuyerNotifications = lazy(() => import('../pages/buyer/BuyerNotifications'));
const BuyerChat = lazy(() => import('../pages/buyer/BuyerChat'));

const SellerDashboard = lazy(() => import('../pages/seller/SellerDashboard'));
const SellerProducts = lazy(() => import('../pages/seller/SellerProducts'));
const SellerProductForm = lazy(() => import('../pages/seller/SellerProductForm'));
const SellerInquiries = lazy(() => import('../pages/seller/SellerInquiries'));
const SellerQuotes = lazy(() => import('../pages/seller/SellerQuotes'));
const SellerCompany = lazy(() => import('../pages/seller/SellerCompany'));
const SellerSubscriptions = lazy(() => import('../pages/seller/SellerSubscriptions'));
const SellerAnalytics = lazy(() => import('../pages/seller/SellerAnalytics'));

const AdminDashboard = lazy(() => import('../pages/admin/AdminDashboard'));
const AdminUsers = lazy(() => import('../pages/admin/AdminUsers'));
const AdminSellers = lazy(() => import('../pages/admin/AdminSellers'));
const AdminProducts = lazy(() => import('../pages/admin/AdminProducts'));
const AdminCategories = lazy(() => import('../pages/admin/AdminCategories'));
const AdminCMS = lazy(() => import('../pages/admin/AdminCMS'));
const AdminBanners = lazy(() => import('../pages/admin/AdminBanners'));
const AdminSubscriptions = lazy(() => import('../pages/admin/AdminSubscriptions'));
const AdminInquiries = lazy(() => import('../pages/admin/AdminInquiries'));
const AdminReports = lazy(() => import('../pages/admin/AdminReports'));

const Loading = () => (
  <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
    <CircularProgress />
  </Box>
);

const AppRoutes = () => (
  <Suspense fallback={<Loading />}>
    <Routes>
      <Route element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="products" element={<ProductListing />} />
        <Route path="products/:slug" element={<ProductDetails />} />
        <Route path="categories" element={<CategoriesPage />} />
        <Route path="categories/:slug" element={<ProductListing />} />
        <Route path="suppliers" element={<SupplierListing />} />
        <Route path="suppliers/:slug" element={<SupplierProfile />} />
        <Route path="search" element={<SearchResults />} />
        <Route path="about-us" element={<CMSPage slug="about-us" title="About Us" />} />
        <Route path="faq" element={<CMSPage slug="faq" title="FAQ" />} />
        <Route path="privacy-policy" element={<CMSPage slug="privacy-policy" title="Privacy Policy" />} />
        <Route path="terms-conditions" element={<CMSPage slug="terms-conditions" title="Terms & Conditions" />} />
        <Route path="contact-us" element={<ContactPage />} />
        <Route path="login" element={<LoginPage />} />
        <Route path="register" element={<RegisterPage />} />
        <Route path="forgot-password" element={<ForgotPasswordPage />} />
        <Route path="reset-password/:token" element={<ResetPasswordPage />} />
      </Route>

      <Route path="buyer" element={<ProtectedRoute roles={['buyer']}><DashboardLayout role="buyer" /></ProtectedRoute>}>
        <Route index element={<BuyerDashboard />} />
        <Route path="inquiries" element={<BuyerInquiries />} />
        <Route path="wishlist" element={<BuyerWishlist />} />
        <Route path="profile" element={<BuyerProfile />} />
        <Route path="notifications" element={<BuyerNotifications />} />
        <Route path="chat" element={<BuyerChat />} />
        <Route path="chat/:id" element={<BuyerChat />} />
      </Route>

      <Route path="seller" element={<ProtectedRoute roles={['seller']}><DashboardLayout role="seller" /></ProtectedRoute>}>
        <Route index element={<SellerDashboard />} />
        <Route path="products" element={<SellerProducts />} />
        <Route path="products/new" element={<SellerProductForm />} />
        <Route path="products/edit/:id" element={<SellerProductForm />} />
        <Route path="inquiries" element={<SellerInquiries />} />
        <Route path="quotes" element={<SellerQuotes />} />
        <Route path="company" element={<SellerCompany />} />
        <Route path="subscriptions" element={<SellerSubscriptions />} />
        <Route path="analytics" element={<SellerAnalytics />} />
      </Route>

      <Route path="admin" element={<ProtectedRoute roles={['super_admin']}><DashboardLayout role="admin" /></ProtectedRoute>}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="sellers" element={<AdminSellers />} />
        <Route path="products" element={<AdminProducts />} />
        <Route path="categories" element={<AdminCategories />} />
        <Route path="cms" element={<AdminCMS />} />
        <Route path="banners" element={<AdminBanners />} />
        <Route path="subscriptions" element={<AdminSubscriptions />} />
        <Route path="inquiries" element={<AdminInquiries />} />
        <Route path="reports" element={<AdminReports />} />
      </Route>
    </Routes>
  </Suspense>
);

export default AppRoutes;
