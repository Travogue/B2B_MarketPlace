import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { productAPI, categoryAPI, companyAPI, bannerAPI, reviewAPI } from '../../services';

export const fetchHomeData = createAsyncThunk('ui/fetchHomeData', async () => {
  const [categories, trending, featured, topSuppliers, premiumSuppliers, reviews, banners] =
    await Promise.all([
      categoryAPI.getAll(),
      productAPI.getTrending(),
      productAPI.getFeatured(),
      companyAPI.getTop(),
      companyAPI.getPremium(),
      reviewAPI.getFeatured(),
      bannerAPI.getAll({ position: 'hero' }),
    ]);
  return {
    categories: categories.data.data,
    trending: trending.data.data,
    featured: featured.data.data,
    topSuppliers: topSuppliers.data.data,
    premiumSuppliers: premiumSuppliers.data.data,
    reviews: reviews.data.data,
    banners: banners.data.data,
  };
});

export const fetchProducts = createAsyncThunk('ui/fetchProducts', async (params) => {
  const { data } = await productAPI.getAll(params);
  return data.data;
});

export const fetchCategories = createAsyncThunk('ui/fetchCategories', async () => {
  const { data } = await categoryAPI.getAll();
  return data.data;
});

const uiSlice = createSlice({
  name: 'ui',
  initialState: {
    homeData: null,
    products: [],
    pagination: {},
    categories: [],
    loading: false,
    searchQuery: '',
  },
  reducers: {
    setSearchQuery: (state, action) => { state.searchQuery = action.payload; },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchHomeData.pending, (state) => { state.loading = true; })
      .addCase(fetchHomeData.fulfilled, (state, action) => {
        state.loading = false;
        state.homeData = action.payload;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.products = action.payload.products;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { setSearchQuery } = uiSlice.actions;
export default uiSlice.reducer;
