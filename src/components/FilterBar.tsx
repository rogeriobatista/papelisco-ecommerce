"use client";

import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../features/store';
import { setCategory, setSearch, setSort } from '../features/products/productsSlice';
import styles from '../styles/FilterBar.module.scss';

const categories = [
  'all',
  'mobile phones',
  'electronics',
  'books',
  'pencils',
  'pens',
  'gifts',
];

export default function FilterBar() {
  const dispatch = useDispatch();
  const filter = useSelector((state: any) => state.products.filter);

  return (
    <div className={styles.filterBar}>
      <select value={filter.category} onChange={e => dispatch(setCategory(e.target.value))}>
        {categories.map(cat => (
          <option key={cat} value={cat}>{cat.charAt(0).toUpperCase() + cat.slice(1)}</option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Search products..."
        value={filter.search}
        onChange={e => dispatch(setSearch(e.target.value))}
      />
      <select value={filter.sort} onChange={e => dispatch(setSort(e.target.value as any))}>
        <option value="price-asc">Price: Low to High</option>
        <option value="price-desc">Price: High to Low</option>
        <option value="name-asc">Name: A-Z</option>
        <option value="name-desc">Name: Z-A</option>
      </select>
    </div>
  );
}
