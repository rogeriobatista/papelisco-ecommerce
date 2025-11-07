import { Product } from '../features/products/productsSlice';
import { products } from '../data/products';

export function getRelatedProducts(currentProduct: Product, limit: number = 4): Product[] {
  // First, try to find products in the same category
  const sameCategory = products.filter(
    p => p.id !== currentProduct.id && p.category === currentProduct.category
  );

  // If we have enough products in the same category, return them
  if (sameCategory.length >= limit) {
    return sameCategory.slice(0, limit);
  }

  // If not enough in same category, add products from other categories
  const otherProducts = products.filter(
    p => p.id !== currentProduct.id && p.category !== currentProduct.category
  );

  // Combine same category products with others to reach the limit
  const relatedProducts = [...sameCategory, ...otherProducts].slice(0, limit);
  
  return relatedProducts;
}