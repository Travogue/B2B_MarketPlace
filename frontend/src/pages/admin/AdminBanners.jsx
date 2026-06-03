import { useEffect, useState } from 'react';
import { Grid, Card, CardMedia, CardContent, Typography, IconButton } from '@mui/material';
import { Delete } from '@mui/icons-material';
import { bannerAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';

const AdminBanners = () => {
  const [banners, setBanners] = useState([]);

  useEffect(() => {
    bannerAPI.getAll({ all: true }).then(({ data }) => setBanners(data.data));
  }, []);

  return (
    <>
      <PageHeader title="Banner Management" subtitle="Manage homepage and promotional banners" />
      <Grid container spacing={3}>
        {banners.map((b) => (
          <Grid item xs={12} sm={6} md={4} key={b._id}>
            <Card>
              <CardMedia component="img" height="140" image={b.image} alt={b.title} />
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>{b.title}</Typography>
                <Typography variant="body2" color="text.secondary">{b.position} • Order: {b.order}</Typography>
                <IconButton color="error" size="small"><Delete /></IconButton>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default AdminBanners;
