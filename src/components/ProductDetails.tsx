"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Product } from '../features/products/productsSlice';
import { useAppDispatch } from '../features/hooks';
import { addToCart, openCart } from '../features/cart/cartSlice';
import RelatedProducts from './RelatedProducts';
import styles from '../styles/ProductDetails.module.scss';

type Props = {
  product: Product;
};

export default function ProductDetails({ product }: Props) {
  const [quantity, setQuantity] = useState(1);
  const [isAddingToCart, setIsAddingToCart] = useState(false);
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    
    // Add item to cart
    dispatch(addToCart({ product, quantity }));
    
    // Show success feedback
    setTimeout(() => {
      setIsAddingToCart(false);
      // Optionally open the cart
      dispatch(openCart());
    }, 500);
  };

  const handleBuyNow = () => {
    // Add to cart first
    dispatch(addToCart({ product, quantity }));
    // Navigate to checkout page
    router.push('/checkout');
  };

  return (
    <div className={styles.productDetails}>
      <div className={styles.imageSection}>
        <img 
          src={product.image} 
          alt={product.name} 
          className={styles.productImage}
        />
      </div>
      
      <div className={styles.infoSection}>
        <h1 className={styles.productName}>{product.name}</h1>
        
        <div className={styles.categoryBadge}>
          {product.category.charAt(0).toUpperCase() + product.category.slice(1)}
        </div>
        
        <div className={styles.price}>
          ${product.price.toFixed(2)}
        </div>
        
        <div className={styles.description}>
          <h3>Description</h3>
          <p>{product.description}</p>
        </div>
        
        <div className={styles.productFeatures}>
          <h3>Product Features</h3>
          <ul>
            {product.category === 'mobile phones' && (
              <>
                <li>Latest processor technology</li>
                <li>High-resolution camera</li>
                <li>Long-lasting battery</li>
                <li>5G connectivity</li>
              </>
            )}
            {product.category === 'electronics' && (
              <>
                <li>E-ink display technology</li>
                <li>Weeks of battery life</li>
                <li>Waterproof design</li>
                <li>Adjustable backlight</li>
              </>
            )}
            {product.category === 'books' && (
              <>
                <li>Complete series collection</li>
                <li>High-quality printing</li>
                <li>Durable hardcover binding</li>
                <li>Collector's edition</li>
              </>
            )}
            {(product.category === 'pencils' || product.category === 'pens') && (
              <>
                <li>Smooth writing experience</li>
                <li>Ergonomic design</li>
                <li>Long-lasting ink/graphite</li>
                <li>Professional quality</li>
              </>
            )}
            {product.category === 'gifts' && (
              <>
                <li>No expiration date</li>
                <li>Valid at all locations</li>
                <li>Digital or physical delivery</li>
                <li>Perfect for any occasion</li>
              </>
            )}
          </ul>
        </div>
        
        <div className={styles.purchaseSection}>
          <div className={styles.quantitySelector}>
            <label htmlFor="quantity">Quantity:</label>
            <select 
              id="quantity"
              value={quantity} 
              onChange={(e) => setQuantity(Number(e.target.value))}
              className={styles.quantitySelect}
            >
              {[...Array(10)].map((_, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}
                </option>
              ))}
            </select>
          </div>
          
          <div className={styles.actionButtons}>
            <button 
              onClick={handleAddToCart} 
              className={`${styles.addToCartBtn} ${isAddingToCart ? styles.loading : ''}`}
              disabled={isAddingToCart}
            >
              {isAddingToCart ? 'Adding...' : 'Add to Cart'}
            </button>
            <button 
              onClick={handleBuyNow} 
              className={styles.buyNowBtn}
            >
              Buy Now
            </button>
          </div>
          
          <div className={styles.totalPrice}>
            <strong>Total: ${(product.price * quantity).toFixed(2)}</strong>
          </div>
        </div>
      </div>
      
      <div className={styles.relatedProductsSection}>
        <RelatedProducts currentProduct={product} />
      </div>
    </div>
  );
}