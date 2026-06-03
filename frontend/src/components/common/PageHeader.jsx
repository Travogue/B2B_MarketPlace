import { Box, Typography, Pagination, FormControl, InputLabel, Select, MenuItem, Grid } from '@mui/material';

const PageHeader = ({ title, subtitle, action }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" mb={3} flexWrap="wrap" gap={2}>
    <Box>
      <Typography variant="h4" fontWeight={700}>{title}</Typography>
      {subtitle && <Typography variant="body2" color="text.secondary">{subtitle}</Typography>}
    </Box>
    {action}
  </Box>
);

export const PaginationBar = ({ page, pages, onChange, sort, onSortChange, sortOptions = [] }) => (
  <Box display="flex" justifyContent="space-between" alignItems="center" mt={4} flexWrap="wrap" gap={2}>
    {sortOptions.length > 0 && (
      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Sort By</InputLabel>
        <Select value={sort || ''} label="Sort By" onChange={(e) => onSortChange(e.target.value)}>
          {sortOptions.map((opt) => (
            <MenuItem key={opt.value} value={opt.value}>{opt.label}</MenuItem>
          ))}
        </Select>
      </FormControl>
    )}
    {pages > 1 && <Pagination count={pages} page={page} onChange={(_, p) => onChange(p)} color="primary" />}
  </Box>
);

export const EmptyState = ({ message = 'No data found', icon: Icon }) => (
  <Box textAlign="center" py={8}>
    {Icon && <Icon sx={{ fontSize: 64, color: 'text.disabled', mb: 2 }} />}
    <Typography variant="h6" color="text.secondary">{message}</Typography>
  </Box>
);

export default PageHeader;
