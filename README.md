@@ .. @@
+
+## Backend Setup
+
+This application uses Supabase as the backend. To set up the backend:
+
+1. **Create a Supabase Project**
+   - Go to [supabase.com](https://supabase.com)
+   - Create a new project
+   - Note your project URL and anon key
+
+2. **Environment Variables**
+   - Copy `.env.example` to `.env`
+   - Fill in your Supabase credentials:
+     ```
+     VITE_SUPABASE_URL=your_supabase_project_url
+     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
+     ```
+
+3. **Database Setup**
+   - Run the migration files in the Supabase SQL editor:
+     - `supabase/migrations/create_initial_schema.sql`
+     - `supabase/migrations/insert_sample_data.sql`
+
+4. **Authentication Setup**
+   - In Supabase Dashboard, go to Authentication > Settings
+   - Configure your authentication providers
+   - Set up email templates if needed
+
+5. **Storage Setup** (Optional)
+   - Create storage buckets for product images
+   - Set up appropriate policies for file uploads
+
+## Database Schema
+
+The application includes the following main tables:
+- `profiles` - User profiles extending auth.users
+- `categories` - Product categories
+- `products` - Product listings
+- `orders` - Order management
+- `order_items` - Individual items in orders
+- `reviews` - Product reviews and ratings
+- `ad_campaigns` - Advertising campaigns
+- `transactions` - Financial transactions
+- `wishlists` - User wishlists
+- `cart_items` - Shopping cart items
+
+## API Hooks
+
+The application includes custom React hooks for data management:
+- `useAuth()` - Authentication and user management
+- `useProducts()` - Product CRUD operations
+- `useOrders()` - Order management
+- `useCart()` - Shopping cart functionality
+- `useWishlist()` - Wishlist management
+
+## Features
+
+- **Authentication**: Email/password authentication with role-based access
+- **Product Management**: Full CRUD operations for products
+- **Order Processing**: Complete order lifecycle management
+- **Shopping Cart**: Persistent cart with real-time updates
+- **Wishlist**: Save products for later
+- **Reviews & Ratings**: Product review system
+- **Ad Campaigns**: Seller advertising platform
+- **Transactions**: Financial transaction tracking
+- **Real-time Updates**: Live data synchronization
+- **Row Level Security**: Secure data access based on user roles