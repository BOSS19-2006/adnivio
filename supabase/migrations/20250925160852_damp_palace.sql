/*
  # Sample Data for Adnivio Platform

  1. Categories
  2. Sample users (profiles)
  3. Products
  4. Sample orders and reviews
*/

-- Insert categories
INSERT INTO categories (id, name, slug, description, image_url, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440001', 'Electronics', 'electronics', 'Electronic devices and gadgets', 'https://images.pexels.com/photos/356056/pexels-photo-356056.jpeg', true),
  ('550e8400-e29b-41d4-a716-446655440002', 'Fashion', 'fashion', 'Clothing and accessories', 'https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg', true),
  ('550e8400-e29b-41d4-a716-446655440003', 'Health & Wellness', 'health-wellness', 'Health and wellness products', 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg', true),
  ('550e8400-e29b-41d4-a716-446655440004', 'Home & Garden', 'home-garden', 'Home decor and garden items', 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg', true),
  ('550e8400-e29b-41d4-a716-446655440005', 'Books & Media', 'books-media', 'Books, movies, and media', 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg', true);

-- Insert subcategories
INSERT INTO categories (id, name, slug, description, parent_id, is_active) VALUES
  ('550e8400-e29b-41d4-a716-446655440011', 'Smartphones', 'smartphones', 'Mobile phones and accessories', '550e8400-e29b-41d4-a716-446655440001', true),
  ('550e8400-e29b-41d4-a716-446655440012', 'Laptops', 'laptops', 'Laptops and computers', '550e8400-e29b-41d4-a716-446655440001', true),
  ('550e8400-e29b-41d4-a716-446655440013', 'Audio', 'audio', 'Headphones and speakers', '550e8400-e29b-41d4-a716-446655440001', true),
  ('550e8400-e29b-41d4-a716-446655440021', 'Men''s Clothing', 'mens-clothing', 'Clothing for men', '550e8400-e29b-41d4-a716-446655440002', true),
  ('550e8400-e29b-41d4-a716-446655440022', 'Women''s Clothing', 'womens-clothing', 'Clothing for women', '550e8400-e29b-41d4-a716-446655440002', true);

-- Note: Sample users will be created through the authentication system
-- This is just for reference of the expected profile structure

-- Sample products (these would be inserted after users are created)
-- The actual product insertion would happen through the application
-- when sellers register and add their products

-- Insert sample data that doesn't depend on auth users
-- This will be populated when users actually register and use the system