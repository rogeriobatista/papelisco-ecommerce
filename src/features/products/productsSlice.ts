import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export type Product = {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  description: string;
  stock?: number;
  sku?: string;
};

export type Filter = {
  category: string;
  search: string;
  sort: 'relevance' | 'price-asc' | 'price-desc' | 'name-asc' | 'name-desc' | 'newest';
};

interface ProductsState {
  items: Product[];
  filter: Filter;
}

const initialState: ProductsState = {
  items: [],
  filter: {
    category: 'all',
    search: '',
    sort: 'relevance',
  },
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    setProducts(state, action: PayloadAction<Product[]>) {
      state.items = action.payload;
    },
    setCategory(state, action: PayloadAction<string>) {
      state.filter.category = action.payload;
    },
    setSearch(state, action: PayloadAction<string>) {
      state.filter.search = action.payload;
    },
    setSort(state, action: PayloadAction<Filter['sort']>) {
      state.filter.sort = action.payload;
    },
  },
});

export const { setProducts, setCategory, setSearch, setSort } = productsSlice.actions;
export default productsSlice.reducer;
