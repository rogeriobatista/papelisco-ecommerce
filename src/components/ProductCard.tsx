import Link from 'next/link';
import { Product } from '../features/products/productsSlice';
import styles from '../styles/ProductCard.module.scss';

export default function ProductCard({ product }: { product: Product }) {
  return (
    <Link href={`/product/${product.id}`} className={styles.cardLink}>
      <div className={styles.card}>
        <img src={product.image} alt={product.name} className={styles.image} />
        <h2>{product.name}</h2>
        <p className={styles.category}>{product.category}</p>
        <p className={styles.price}>${product.price}</p>
        <p className={styles.description}>{product.description}</p>
      </div>
    </Link>
  );
}
