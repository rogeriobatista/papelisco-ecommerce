import { Product } from '../features/products/productsSlice';
import ProductCard from './ProductCard';
import styles from '../styles/ProductList.module.scss';

type Props = {
  products: Product[];
};

export default function ProductList({ products }: Props) {
  if (!products.length) {
    return (
      <div className={styles.emptyState}>
        <div className={styles.emptyIcon}>🔍</div>
        <h3 className={styles.emptyTitle}>No products found</h3>
        <p className={styles.emptyMessage}>
          Try adjusting your filters or search terms to find what you're looking for.
        </p>
      </div>
    );
  }
  
  return (
    <div className={styles.listContainer}>
      <div className={styles.grid}>
        {products.map((product, index) => (
          <div 
            key={product.id} 
            className={styles.productWrapper}
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
