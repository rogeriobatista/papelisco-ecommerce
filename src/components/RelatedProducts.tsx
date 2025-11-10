import Link from 'next/link';
import { Product } from '../features/products/productsSlice';
import WishlistButton from './WishlistButton';
import styles from '../styles/RelatedProducts.module.scss';

type Props = {
  currentProduct: Product;
  relatedProducts: Product[];
  loading?: boolean;
};

export default function RelatedProducts({ currentProduct, relatedProducts, loading = false }: Props) {
  if (loading) {
    return (
      <section className={styles.relatedSection}>
        <h2 className={styles.title}>Related Products</h2>
        <div className={styles.loadingContainer}>
          <div className={styles.loadingSpinner}>Loading related products...</div>
        </div>
      </section>
    );
  }

  if (relatedProducts.length === 0) {
    return null;
  }

  return (
    <section className={styles.relatedSection}>
      <h2 className={styles.title}>Related Products</h2>
      <div className={styles.productsGrid}>
        {relatedProducts.map((product) => (
          <div key={product.id} className={styles.productCard}>
            <Link 
              href={`/product/${product.id}`} 
              className={styles.productLink}
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
                <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                {product.stock !== undefined && product.stock <= 0 && (
                  <p className={styles.outOfStock}>Out of Stock</p>
                )}
              </div>
            </Link>
            <div className={styles.wishlistContainer}>
              <WishlistButton 
                productId={product.id} 
                variant="icon-only"
              />
            </div>
          </div>
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