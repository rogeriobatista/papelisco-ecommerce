import { Product } from '../features/products/productsSlice';
import ProductCard from './ProductCard';
import styles from '../styles/ProductList.module.scss';

type Props = {
  products: Product[];
};

export default function ProductList({ products }: Props) {
  if (!products.length) return <p>No products found.</p>;
  return (
    <div className={styles.grid}>
      {products.map(product => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  );
}
