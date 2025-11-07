"use client";

import { useParams } from 'next/navigation';
import { products } from '../../../data/products';
import ProductDetails from '../../../components/ProductDetails';
import Link from 'next/link';
import styles from '../../../styles/ProductDetailsPage.module.scss';

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const product = products.find(p => p.id === productId);

  if (!product) {
    return (
      <div className={styles.container}>
        <div className={styles.notFound}>
          <h1>Product Not Found</h1>
          <p>The product you're looking for doesn't exist.</p>
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