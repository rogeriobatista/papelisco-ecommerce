"use client";

import React, { useEffect, useState } from 'react';
import { setProducts } from '../features/products/productsSlice';
import ProductList from '../components/ProductList';
import FilterBar from '../components/FilterBar';
import styles from '../styles/Home.module.scss';
import { useAppDispatch, useAppSelector } from './hooks';

export default function Home() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.products.items);
  const filter = useAppSelector((state) => state.products.filter);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/products');
        
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        
        const data = await response.json();
        dispatch(setProducts(data.products));
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [dispatch]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading products...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>Error: {error}</div>
      </div>
    );
  }

  // Filtering
  let filtered = items;
  if (filter.category !== 'all') {
    filtered = filtered.filter((p: any) => p.category === filter.category);
  }
  if (filter.search) {
    filtered = filtered.filter((p: any) =>
      p.name.toLowerCase().includes(filter.search.toLowerCase())
    );
  }
  // Sorting
  let sorted = [...filtered];
  switch (filter.sort) {
    case 'price-asc':
      sorted = sorted.sort((a: any, b: any) => a.price - b.price);
      break;
    case 'price-desc':
      sorted = sorted.sort((a: any, b: any) => b.price - a.price);
      break;
    case 'name-asc':
      sorted = sorted.sort((a: any, b: any) => a.name.localeCompare(b.name));
      break;
    case 'name-desc':
      sorted = sorted.sort((a: any, b: any) => b.name.localeCompare(a.name));
      break;
    case 'newest':
      // Assuming products are already ordered by newest from API
      sorted = sorted;
      break;
    case 'relevance':
    default:
      // Keep original order for relevance
      sorted = filtered;
      break;
  }

  return (
    <div className={styles.container}>
      <FilterBar />
      
      <div className={styles.resultsSection}>
        <div className={styles.resultsHeader}>
          <div className={styles.resultsCount}>
            Showing <strong>{sorted.length}</strong> {sorted.length === 1 ? 'product' : 'products'}
            {filter.search && ` for "${filter.search}"`}
            {filter.category !== 'all' && ` in ${filter.category}`}
          </div>
        </div>
        
        <ProductList products={sorted} />
      </div>
    </div>
  );
}
