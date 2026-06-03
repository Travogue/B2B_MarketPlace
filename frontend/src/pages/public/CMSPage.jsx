import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Container, Typography, Box, Skeleton } from '@mui/material';
import { cmsAPI } from '../../services';

const CMSPage = ({ slug, title }) => {
  const [page, setPage] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    cmsAPI.getBySlug(slug).then(({ data }) => {
      setPage(data.data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [slug]);

  return (
    <>
      <Helmet><title>{page?.seo?.metaTitle || title} - B2B Marketplace</title></Helmet>
      <Container maxWidth="md" sx={{ py: 6 }}>
        {loading ? <Skeleton variant="rounded" height={400} /> : (
          <>
            <Typography variant="h3" fontWeight={700} gutterBottom>{page?.title || title}</Typography>
            <Box dangerouslySetInnerHTML={{ __html: page?.content || '<p>Content coming soon.</p>' }} sx={{ '& h1, & h2': { mt: 3, mb: 2 } }} />
          </>
        )}
      </Container>
    </>
  );
};

export default CMSPage;
