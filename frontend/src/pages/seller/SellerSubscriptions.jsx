import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Grid, Card, CardContent, Typography, Button, List, ListItem, ListItemIcon, ListItemText, Chip } from '@mui/material';
import { Check, WorkspacePremium } from '@mui/icons-material';
import { subscriptionAPI } from '../../services';
import PageHeader from '../../components/common/PageHeader';

const SellerSubscriptions = () => {
  const [plans, setPlans] = useState([]);

  useEffect(() => {
    subscriptionAPI.getPlans().then(({ data }) => setPlans(data.data));
  }, []);

  const handleSubscribe = async (planId) => {
    try {
      await subscriptionAPI.subscribe(planId);
      toast.success('Subscription activated!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to subscribe');
    }
  };

  return (
    <>
      <PageHeader title="Subscription Plans" subtitle="Choose a plan to grow your business" />
      <Grid container spacing={3}>
        {plans.map((plan) => (
          <Grid item xs={12} md={4} key={plan._id}>
            <Card sx={{ height: '100%', border: plan.isPremium ? '2px solid' : 'none', borderColor: 'secondary.main' }}>
              <CardContent>
                {plan.isPremium && <Chip icon={<WorkspacePremium />} label="Premium" color="secondary" size="small" sx={{ mb: 1 }} />}
                <Typography variant="h5" fontWeight={700}>{plan.name}</Typography>
                <Typography variant="h4" color="primary.main" fontWeight={700} my={2}>
                  {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString()}`}
                  <Typography component="span" variant="body2" color="text.secondary">/{plan.durationUnit}</Typography>
                </Typography>
                <List dense>
                  {plan.features?.map((f) => (
                    <ListItem key={f} disableGutters><ListItemIcon sx={{ minWidth: 32 }}><Check color="success" fontSize="small" /></ListItemIcon><ListItemText primary={f} /></ListItem>
                  ))}
                </List>
                <Button fullWidth variant={plan.isPremium ? 'contained' : 'outlined'} color={plan.isPremium ? 'secondary' : 'primary'}
                  onClick={() => handleSubscribe(plan._id)} sx={{ mt: 2 }}>
                  {plan.price === 0 ? 'Current Plan' : 'Subscribe'}
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </>
  );
};

export default SellerSubscriptions;
