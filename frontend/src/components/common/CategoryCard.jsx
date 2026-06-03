import { Card, CardActionArea, CardContent, Avatar, Typography, Box } from '@mui/material';
import { Link } from 'react-router-dom';
import * as MuiIcons from '@mui/icons-material';

const CategoryCard = ({ category }) => {
  const IconComponent = MuiIcons[category.icon] || MuiIcons.Category;

  return (
    <Card sx={{ transition: 'all 0.2s', '&:hover': { transform: 'translateY(-4px)', boxShadow: 4 } }}>
      <CardActionArea component={Link} to={`/categories/${category.slug}`}>
        <CardContent sx={{ textAlign: 'center', py: 3 }}>
          <Avatar sx={{ bgcolor: 'primary.light', width: 56, height: 56, mx: 'auto', mb: 1.5 }}>
            <IconComponent sx={{ color: 'primary.main' }} />
          </Avatar>
          <Typography variant="subtitle2" fontWeight={600}>{category.name}</Typography>
          {category.productCount > 0 && (
            <Typography variant="caption" color="text.secondary">{category.productCount} products</Typography>
          )}
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default CategoryCard;
