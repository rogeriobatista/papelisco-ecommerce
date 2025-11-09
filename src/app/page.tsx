"use client";

import React, { useEffect } from 'react';
import { setProducts } from '../features/products/productsSlice';
import { products as productsData } from '../data/products';
import ProductList from '../components/ProductList';
import FilterBar from '../components/FilterBar';
import styles from '../styles/Home.module.scss';
import { useAppDispatch, useAppSelector } from './hooks';

export default function Home() {
  const dispatch = useAppDispatch();
  const items = useAppSelector((state) => state.products.items);
  const filter = useAppSelector((state) => state.products.filter);

  useEffect(() => {
    dispatch(setProducts(productsData));
  }, [dispatch]);

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
  if (filter.sort === 'price-asc') filtered = [...filtered].sort((a: any, b: any) => a.price - b.price);
  if (filter.sort === 'price-desc') filtered = [...filtered].sort((a: any, b: any) => b.price - a.price);
  if (filter.sort === 'name-asc') filtered = [...filtered].sort((a: any, b: any) => a.name.localeCompare(b.name));
  if (filter.sort === 'name-desc') filtered = [...filtered].sort((a: any, b: any) => b.name.localeCompare(a.name));

  return (
    <div className={styles.container}>
      <FilterBar />
      <ProductList products={filtered} />
    </div>
  );
}
