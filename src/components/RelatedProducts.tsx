import Link from 'next/link';
import { Product } from '../features/products/productsSlice';
import { getRelatedProducts } from '../utils/relatedProducts';
import styles from '../styles/RelatedProducts.module.scss';

type Props = {
  currentProduct: Product;
  allProducts: Product[];
};

export default function RelatedProducts({ currentProduct, allProducts }: Props) {
  const relatedProducts = getRelatedProducts(currentProduct, allProducts, 4);

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className={styles.relatedSection}>
      <h2 className={styles.title}>Related Products</h2>
      <div className={styles.productsGrid}>
        {relatedProducts.map((product) => (
          <Link 
            key={product.id} 
            href={`/product/${product.id}`} 
            className={styles.productCard}
          >
            <div className={styles.imageContainer}>
              <img 
                src={product.image} 
                alt={product.name} 
                className={styles.productImage}
              />
            </div>
            <div className={styles.productInfo}>
              <h3 className={styles.productName}>{product.name}</h3>
              <p className={styles.productCategory}>
                {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
              </p>
              <p className={styles.productPrice}>${product.price}</p>
            </div>
          </Link>
        ))}
      </div>
      
      {relatedProducts.length > 0 && (
        <div className={styles.viewAllContainer}>
          <Link href="/" className={styles.viewAllLink}>
            View All Products →
          </Link>
        </div>
      )}
    </section>
  );
}