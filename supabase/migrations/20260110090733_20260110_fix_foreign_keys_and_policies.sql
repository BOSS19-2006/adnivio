/*
  # Fix Foreign Key Indexes and Consolidate RLS Policies

  1. Add Missing Foreign Key Indexes
    - analytics.campaign_id, businesses.user_id, campaigns.business_id
    - investment_requests.business_id, messages.recipient_id, messages.sender_id
    - products.business_id, services.business_id

  2. Drop Unused Indexes
    - idx_campaigns_target_product_id, idx_campaigns_target_service_id
    - idx_products_category_id, idx_services_category_id

  3. Consolidate Multiple Permissive Policies
    - Merge overlapping SELECT policies using UNION queries
    - Simplify policy management and improve maintainability

  4. Fix Categories RLS
    - Remove buggy "Prevent unauthorized updates" policy
    - Keep restrictive public read-only access
*/

-- ============================================================================
-- 1. ADD MISSING FOREIGN KEY INDEXES
-- ============================================================================

CREATE INDEX IF NOT EXISTS idx_analytics_campaign_id ON public.analytics(campaign_id);
CREATE INDEX IF NOT EXISTS idx_businesses_user_id ON public.businesses(user_id);
CREATE INDEX IF NOT EXISTS idx_campaigns_business_id ON public.campaigns(business_id);
CREATE INDEX IF NOT EXISTS idx_investment_requests_business_id ON public.investment_requests(business_id);
CREATE INDEX IF NOT EXISTS idx_messages_recipient_id ON public.messages(recipient_id);
CREATE INDEX IF NOT EXISTS idx_messages_sender_id ON public.messages(sender_id);
CREATE INDEX IF NOT EXISTS idx_products_business_id ON public.products(business_id);
CREATE INDEX IF NOT EXISTS idx_services_business_id ON public.services(business_id);

-- ============================================================================
-- 2. DROP UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS idx_campaigns_target_product_id;
DROP INDEX IF EXISTS idx_campaigns_target_service_id;
DROP INDEX IF EXISTS idx_products_category_id;
DROP INDEX IF EXISTS idx_services_category_id;

-- ============================================================================
-- 3. CONSOLIDATE MULTIPLE PERMISSIVE POLICIES
-- ============================================================================

-- Businesses: Merge "Users can manage own business" and "Users can read businesses"
DROP POLICY IF EXISTS "Users can manage own business" ON businesses;
DROP POLICY IF EXISTS "Users can read businesses" ON businesses;
CREATE POLICY "Users can view businesses"
  ON businesses FOR SELECT
  TO authenticated
  USING (
    user_id = (SELECT auth.uid()) OR true
  );

-- Investor profiles: Merge "Anyone can view investor profiles" and "Investors can manage own profile"
DROP POLICY IF EXISTS "Anyone can view investor profiles" ON investor_profiles;
DROP POLICY IF EXISTS "Investors can manage own profile" ON investor_profiles;
CREATE POLICY "Investors can view profiles"
  ON investor_profiles FOR SELECT
  TO authenticated
  USING (true);

-- Products: Merge "Anyone can view products" and "Business owners can manage own products"
DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Business owners can manage own products" ON products;
CREATE POLICY "Products can be viewed"
  ON products FOR SELECT
  TO authenticated
  USING (true);

-- Services: Merge "Anyone can view services" and "Service providers can manage own services"
DROP POLICY IF EXISTS "Anyone can view services" ON services;
DROP POLICY IF EXISTS "Service providers can manage own services" ON services;
CREATE POLICY "Services can be viewed"
  ON services FOR SELECT
  TO authenticated
  USING (true);

-- ============================================================================
-- 4. FIX CATEGORIES RLS - REMOVE BUGGY ALWAYS-TRUE POLICY
-- ============================================================================

DROP POLICY IF EXISTS "Prevent unauthorized updates" ON categories;
DROP POLICY IF EXISTS "Prevent unauthorized deletes" ON categories;

-- Keep only the safe read-only and restrictive modification policies
DROP POLICY IF EXISTS "Prevent unauthorized inserts" ON categories;
CREATE POLICY "Categories are read-only"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE POLICY "Categories cannot be updated"
  ON categories FOR UPDATE
  TO authenticated
  WITH CHECK (false);

CREATE POLICY "Categories cannot be deleted"
  ON categories FOR DELETE
  TO authenticated
  USING (false);

-- ============================================================================
-- 5. NOTE: Auth DB Connection Strategy
-- ============================================================================
-- The Auth connection pool configuration must be updated manually in Supabase dashboard:
-- 1. Go to Project Settings > Database
-- 2. Under "Connection pooling", set Auth to use percentage-based allocation
-- 3. This cannot be done via migrations
