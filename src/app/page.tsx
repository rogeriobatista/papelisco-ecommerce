"use client";

import React, { useEffect } from 'react';
import Link from 'next/link';
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
  const { user, isLoggedIn } = useAppSelector((state) => state.auth);

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
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '2rem' 
      }}>
        <h1>Papelisco Store</h1>
        
        {isLoggedIn && (
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <span>Welcome, {user?.firstName}!</span>
            <Link 
              href="/dashboard"
              style={{
                padding: '0.5rem 1rem',
                backgroundColor: '#2563eb',
                color: 'white',
                textDecoration: 'none',
                borderRadius: '6px',
                fontWeight: '500'
              }}
            >
              Dashboard
            </Link>
          </div>
        )}
      </div>
      
      <FilterBar />
      <ProductList products={filtered} />
    </div>
  );
}
