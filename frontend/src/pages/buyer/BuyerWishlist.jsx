import { useEffect, useState } from 'react';
import { Grid } from '@mui/material';
import { userAPI } from '../../services';
import ProductCard from '../../components/common/ProductCard';
import PageHeader, { EmptyState } from '../../components/common/PageHeader';
import { Favorite } from '@mui/icons-material';

const BuyerWishlist = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    userAPI.getWishlist().then(({ data }) => setProducts(data.data));
  }, []);

  return (
    <>
      <PageHeader title="My Wishlist" subtitle="Products you've saved" />
      {products.length === 0 ? (
        <EmptyState message="Your wishlist is empty" icon={Favorite} />
      ) : (
        <Grid container spacing={3}>
          {products.map((product) => (
            <Grid item xs={12} sm={6} md={3} key={product._id}><ProductCard product={product} /></Grid>
          ))}
        </Grid>
      )}
    </>
  );
};

export default BuyerWishlist;
