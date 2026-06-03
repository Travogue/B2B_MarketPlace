import { Grid, Card, CardContent, Typography, Box, Skeleton } from '@mui/material';
import { TrendingUp, People, Inventory, QuestionAnswer } from '@mui/icons-material';

const icons = { TrendingUp, People, Inventory, QuestionAnswer };

const StatCard = ({ title, value, icon = 'TrendingUp', color = 'primary.main', subtitle }) => {
  const Icon = icons[icon] || TrendingUp;
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>{title}</Typography>
            <Typography variant="h4" fontWeight={700}>{value ?? 0}</Typography>
            {subtitle && <Typography variant="caption" color="text.secondary">{subtitle}</Typography>}
          </Box>
          <Box sx={{ bgcolor: `${color}15`, p: 1.5, borderRadius: 2 }}>
            <Icon sx={{ color, fontSize: 28 }} />
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export const StatCardsGrid = ({ stats, loading }) => {
  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3, 4].map((i) => (
          <Grid item xs={12} sm={6} md={3} key={i}>
            <Skeleton variant="rounded" height={120} />
          </Grid>
        ))}
      </Grid>
    );
  }

  return (
    <Grid container spacing={3}>
      {stats.map((stat) => (
        <Grid item xs={12} sm={6} md={3} key={stat.title}>
          <StatCard {...stat} />
        </Grid>
      ))}
    </Grid>
  );
};

export default StatCard;
