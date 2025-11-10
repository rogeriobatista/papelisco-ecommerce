"use client";

import { useParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Product } from '../../../features/products/productsSlice';
import ProductDetails from '../../../components/ProductDetails';
import Link from 'next/link';
import styles from '../../../styles/ProductDetailsPage.module.scss';

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/products/${productId}`);
        
        if (!response.ok) {
          if (response.status === 404) {
            setError('Product not found');
          } else {
            setError('Failed to load product');
          }
          return;
        }
        
        const data = await response.json();
        setProduct(data);
      } catch (err) {
        setError('Failed to load product');
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId]);

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>Loading product...</div>
      </div>
    );
  }

  if (!product || error) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h1>Product Not Found</h1>
          <p>{error || "The product you're looking for doesn't exist."}</p>
          <Link href="/" className={styles.backLink}>
            ← Back to Store
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <div className={styles.breadcrumb}>
        <Link href="/" className={styles.breadcrumbLink}>
          Papelisco Store
        </Link>
        <span className={styles.breadcrumbSeparator}>›</span>
        <span className={styles.breadcrumbCurrent}>{product.name}</span>
      </div>
      
      <ProductDetails product={product} />
    </div>
  );
}