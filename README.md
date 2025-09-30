
## Backend Setup

This application uses Supabase as the complete backend solution. To set up the backend:

1. **Create a Supabase Project**
   - Go to [supabase.com](https://supabase.com)
   - Create a new project
   - Note your project URL and anon key

2. **Environment Variables**
   - Copy `.env.example` to `.env`
   - Fill in your Supabase credentials:
     ```
     VITE_SUPABASE_URL=your_supabase_project_url
     VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

3. **Database Setup**
   - Run the migration files in the Supabase SQL editor:
     - `supabase/migrations/create_initial_schema.sql`
     - `supabase/migrations/insert_sample_data.sql`
     - `supabase/migrations/complete_platform_schema.sql`
     - `supabase/migrations/insert_comprehensive_sample_data.sql`

4. **Authentication Setup**
   - In Supabase Dashboard, go to Authentication > Settings
   - Configure your authentication providers
   - Set up email templates if needed

5. **Storage Setup** (Optional)
   - Create storage buckets for product images
   - Set up appropriate policies for file uploads

6. **Edge Functions Setup** (Optional)
   - Deploy edge functions for advanced features:
     - `send-notification` - Push notifications
     - `calculate-shipping` - Dynamic shipping calculation
     - `process-payment` - Payment processing
     - `decrement-product-stock` - Inventory management

## Database Schema

The application includes a comprehensive database schema with 20+ tables:

### Core Tables
- `profiles` - User profiles extending auth.users
- `categories` - Product categories
- `products` - Product listings
- `orders` - Order management
- `order_items` - Individual items in orders
- `reviews` - Product reviews and ratings
- `ad_campaigns` - Advertising campaigns
- `transactions` - Financial transactions
- `wishlists` - User wishlists
- `cart_items` - Shopping cart items

### Investment Platform Tables
- `investment_profiles` - SME funding profiles
- `investor_profiles` - Investor profiles and preferences
- `investment_interests` - Investor interest in SMEs
- `investment_deals` - Investment transactions

### Chat System Tables
- `chat_rooms` - Chat room management
- `chat_participants` - Chat room participants
- `chat_messages` - Chat messages
- `ai_chat_sessions` - AI chatbot sessions

### Advanced Features Tables
- `notifications` - System notifications
- `wallets` - User wallet management
- `wallet_transactions` - Detailed financial tracking
- `kyc_verifications` - KYC verification system
- `analytics_events` - User behavior tracking
- `product_analytics` - Product performance metrics
- `seller_analytics` - Seller performance metrics
- `coupons` - Discount coupons
- `coupon_usage` - Coupon usage tracking
- `shipping_zones` - Shipping zone management
- `shipping_rates` - Dynamic shipping rates

## API Hooks

The application includes comprehensive React hooks for all features:

### Core Hooks
- `useAuth()` - Authentication and user management
- `useProducts()` - Product CRUD operations
- `useOrders()` - Order management
- `useCart()` - Shopping cart functionality
- `useWishlist()` - Wishlist management

### Investment Platform Hooks
- `useInvestment()` - Investment platform functionality
- AI matchmaking and recommendations

### Chat System Hooks
- `useChat()` - Real-time messaging with AI integration
- WebSocket-like real-time updates

### Advanced Feature Hooks
- `useWallet()` - Financial wallet management
- `useNotifications()` - Real-time notifications
- `useAnalytics()` - Analytics and tracking
- `useCoupons()` - Coupon management

## Features

### Core E-commerce Features
- **Zero Commission Marketplace**: Complete e-commerce platform
- **AI-Powered Advertising**: Smart ad campaigns with optimization
- **Advanced Analytics**: Comprehensive business intelligence
- **Multi-role System**: Buyers, Sellers, Admins, Investors

### Investment Platform
- **SME Funding Profiles**: Complete company profiles with financials
- **Investor Dashboard**: Browse and filter investment opportunities
- **AI Matchmaking**: Intelligent SME-investor matching
- **Deal Management**: End-to-end investment process

### Communication System
- **Real-time Chat**: Buyer-Seller and Investor-SME messaging
- **AI Chatbot**: Role-based intelligent assistance
- **Rich Media Support**: Text, images, files, voice notes
- **Notification System**: Real-time updates and alerts

### Financial Management
- **Digital Wallet**: Comprehensive wallet system
- **Transaction Tracking**: Detailed financial records
- **Coupon System**: Flexible discount management
- **Dynamic Shipping**: Smart shipping calculation

### Security & Compliance
- **Row Level Security**: Database-level access control
- **KYC Verification**: Identity verification system
- **Encrypted Communications**: Secure messaging
- **Audit Trails**: Complete activity logging

### Analytics & Intelligence
- **Real-time Analytics**: Live performance metrics
- **User Behavior Tracking**: Comprehensive event tracking
- **Business Intelligence**: Advanced reporting and insights
- **AI Recommendations**: Personalized suggestions

## Advanced Functions

The backend includes sophisticated database functions:

- **Wallet Management**: Automatic balance updates and transaction logging
- **Shipping Calculation**: Dynamic shipping cost calculation
- **Coupon System**: Advanced discount application logic
- **Analytics Tracking**: Automated metrics collection
- **Notification System**: Real-time notification delivery
- **AI Matching**: Intelligent recommendation algorithms

## Real-time Features

- **Live Chat**: WebSocket-like real-time messaging
- **Notifications**: Instant push notifications
- **Order Updates**: Real-time order status changes
- **Investment Activity**: Live investment interest tracking
- **Analytics**: Real-time performance metrics

This is a complete, production-ready backend that supports all the advanced features of the Adnivio platform including the marketplace, investment platform, chat system, and AI-powered features.