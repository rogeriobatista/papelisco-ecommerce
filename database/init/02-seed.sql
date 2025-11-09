-- Seed data for Papelisco E-commerce Database
-- This script populates the database with initial data

-- Insert categories
INSERT INTO categories (id, name, slug, description, sort_order) VALUES
    ('550e8400-e29b-41d4-a716-446655440001', 'Mobile Phones', 'mobile-phones', 'Smartphones and mobile devices', 1),
    ('550e8400-e29b-41d4-a716-446655440002', 'Electronics', 'electronics', 'Electronic devices and gadgets', 2),
    ('550e8400-e29b-41d4-a716-446655440003', 'Books', 'books', 'Books and literature', 3),
    ('550e8400-e29b-41d4-a716-446655440004', 'Stationery', 'stationery', 'Pencils, pens, and office supplies', 4),
    ('550e8400-e29b-41d4-a716-446655440005', 'Gifts', 'gifts', 'Gift items and accessories', 5)
ON CONFLICT (id) DO NOTHING;

-- Insert sample products
INSERT INTO products (id, name, slug, description, short_description, price, compare_price, sku, stock_quantity, category_id, brand, is_featured) VALUES
    -- Mobile Phones
    ('650e8400-e29b-41d4-a716-446655440001', 'iPhone 15 Pro', 'iphone-15-pro', 'Latest iPhone with advanced camera system and titanium design', 'Premium smartphone with Pro camera system', 999.99, 1099.99, 'IPH15PRO001', 50, '550e8400-e29b-41d4-a716-446655440001', 'Apple', true),
    ('650e8400-e29b-41d4-a716-446655440002', 'Samsung Galaxy S24', 'samsung-galaxy-s24', 'Flagship Android phone with AI features', 'Android smartphone with advanced AI', 799.99, 899.99, 'SGS24001', 30, '550e8400-e29b-41d4-a716-446655440001', 'Samsung', true),
    ('650e8400-e29b-41d4-a716-446655440003', 'Google Pixel 8', 'google-pixel-8', 'Pure Android experience with excellent camera', 'Google phone with clean Android', 599.99, 699.99, 'GPX8001', 25, '550e8400-e29b-41d4-a716-446655440001', 'Google', false),
    
    -- Electronics
    ('650e8400-e29b-41d4-a716-446655440004', 'MacBook Air M3', 'macbook-air-m3', 'Lightweight laptop with M3 chip', 'Ultra-thin laptop with Apple Silicon', 1199.99, 1299.99, 'MBAM3001', 20, '550e8400-e29b-41d4-a716-446655440002', 'Apple', true),
    ('650e8400-e29b-41d4-a716-446655440005', 'iPad Pro 12.9', 'ipad-pro-12-9', 'Professional tablet with M2 chip', 'Pro tablet for creative work', 899.99, 999.99, 'IPADPRO001', 15, '550e8400-e29b-41d4-a716-446655440002', 'Apple', false),
    ('650e8400-e29b-41d4-a716-446655440006', 'AirPods Pro 2', 'airpods-pro-2', 'Premium wireless earbuds with noise cancellation', 'Wireless earbuds with ANC', 249.99, 279.99, 'APPRO2001', 100, '550e8400-e29b-41d4-a716-446655440002', 'Apple', true),
    
    -- Books
    ('650e8400-e29b-41d4-a716-446655440007', 'Clean Code', 'clean-code', 'A handbook of agile software craftsmanship', 'Essential programming book', 34.99, 39.99, 'BOOK001', 200, '550e8400-e29b-41d4-a716-446655440003', 'Prentice Hall', false),
    ('650e8400-e29b-41d4-a716-446655440008', 'The Design of Everyday Things', 'design-everyday-things', 'Classic book on design principles', 'Design psychology and usability', 19.99, 24.99, 'BOOK002', 150, '550e8400-e29b-41d4-a716-446655440003', 'Basic Books', true),
    
    -- Stationery
    ('650e8400-e29b-41d4-a716-446655440009', 'Moleskine Classic Notebook', 'moleskine-classic-notebook', 'Premium quality hardcover notebook', 'Classic black hardcover notebook', 22.99, 26.99, 'STAT001', 300, '550e8400-e29b-41d4-a716-446655440004', 'Moleskine', false),
    ('650e8400-e29b-41d4-a716-446655440010', 'Parker Jotter Pen', 'parker-jotter-pen', 'Classic ballpoint pen', 'Reliable everyday writing pen', 12.99, 15.99, 'STAT002', 500, '550e8400-e29b-41d4-a716-446655440004', 'Parker', false),
    ('650e8400-e29b-41d4-a716-446655440011', 'Staedtler Pencil Set', 'staedtler-pencil-set', 'Professional drawing pencils', 'High-quality graphite pencils', 29.99, 34.99, 'STAT003', 100, '550e8400-e29b-41d4-a716-446655440004', 'Staedtler', true),
    
    -- Gifts
    ('650e8400-e29b-41d4-a716-446655440012', 'Leather Wallet', 'leather-wallet', 'Genuine leather bifold wallet', 'Classic leather wallet', 49.99, 59.99, 'GIFT001', 75, '550e8400-e29b-41d4-a716-446655440005', 'Premium Leather', false),
    ('650e8400-e29b-41d4-a716-446655440013', 'Coffee Mug Set', 'coffee-mug-set', 'Set of 4 ceramic coffee mugs', 'Beautiful ceramic mug collection', 39.99, 44.99, 'GIFT002', 120, '550e8400-e29b-41d4-a716-446655440005', 'Home Essentials', true)
ON CONFLICT (id) DO NOTHING;

-- Insert sample product images (using placeholder images)
INSERT INTO product_images (product_id, image_url, alt_text, sort_order, is_primary) VALUES
    ('650e8400-e29b-41d4-a716-446655440001', '/images/iphone-15-pro.jpg', 'iPhone 15 Pro', 0, true),
    ('650e8400-e29b-41d4-a716-446655440002', '/images/samsung-galaxy-s24.jpg', 'Samsung Galaxy S24', 0, true),
    ('650e8400-e29b-41d4-a716-446655440003', '/images/google-pixel-8.jpg', 'Google Pixel 8', 0, true),
    ('650e8400-e29b-41d4-a716-446655440004', '/images/macbook-air-m3.jpg', 'MacBook Air M3', 0, true),
    ('650e8400-e29b-41d4-a716-446655440005', '/images/ipad-pro-12-9.jpg', 'iPad Pro 12.9', 0, true),
    ('650e8400-e29b-41d4-a716-446655440006', '/images/airpods-pro-2.jpg', 'AirPods Pro 2', 0, true),
    ('650e8400-e29b-41d4-a716-446655440007', '/images/clean-code-book.jpg', 'Clean Code Book', 0, true),
    ('650e8400-e29b-41d4-a716-446655440008', '/images/design-everyday-things.jpg', 'The Design of Everyday Things', 0, true),
    ('650e8400-e29b-41d4-a716-446655440009', '/images/moleskine-notebook.jpg', 'Moleskine Classic Notebook', 0, true),
    ('650e8400-e29b-41d4-a716-446655440010', '/images/parker-pen.jpg', 'Parker Jotter Pen', 0, true),
    ('650e8400-e29b-41d4-a716-446655440011', '/images/staedtler-pencils.jpg', 'Staedtler Pencil Set', 0, true),
    ('650e8400-e29b-41d4-a716-446655440012', '/images/leather-wallet.jpg', 'Leather Wallet', 0, true),
    ('650e8400-e29b-41d4-a716-446655440013', '/images/coffee-mug-set.jpg', 'Coffee Mug Set', 0, true)
ON CONFLICT DO NOTHING;