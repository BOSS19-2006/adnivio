/*
  # Comprehensive Security Fix - Foreign Keys, Indexes, and RLS Policies

  1. Ensure all foreign key indexes exist for optimal performance
  2. Drop all unused indexes (campaigns.target_product_id, campaigns.target_service_id, products.category_id, services.category_id)
  3. Consolidate duplicate RLS policies:
     - Drop multiple SELECT policies and keep ONE per table
     - Ensure UNION-based approach for business logic
  4. Fix categories RLS - remove always-true UPDATE policy
*/

-- ============================================================================
-- 1. ENSURE ALL FOREIGN KEY INDEXES EXIST
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_analytics_campaign_id') THEN
    CREATE INDEX idx_analytics_campaign_id ON public.analytics(campaign_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_businesses_user_id') THEN
    CREATE INDEX idx_businesses_user_id ON public.businesses(user_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_campaigns_business_id') THEN
    CREATE INDEX idx_campaigns_business_id ON public.campaigns(business_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_investment_requests_business_id') THEN
    CREATE INDEX idx_investment_requests_business_id ON public.investment_requests(business_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_messages_recipient_id') THEN
    CREATE INDEX idx_messages_recipient_id ON public.messages(recipient_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_messages_sender_id') THEN
    CREATE INDEX idx_messages_sender_id ON public.messages(sender_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_products_business_id') THEN
    CREATE INDEX idx_products_business_id ON public.products(business_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_services_business_id') THEN
    CREATE INDEX idx_services_business_id ON public.services(business_id);
  END IF;
END $$;

-- ============================================================================
-- 2. DROP ALL UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS idx_campaigns_target_product_id;
DROP INDEX IF EXISTS idx_campaigns_target_service_id;
DROP INDEX IF EXISTS idx_products_category_id;
DROP INDEX IF EXISTS idx_services_category_id;

-- ============================================================================
-- 3. CONSOLIDATE RLS POLICIES - BUSINESSES
-- ============================================================================

DROP POLICY IF EXISTS "Users can manage own business" ON businesses;
DROP POLICY IF EXISTS "Users can read businesses" ON businesses;
DROP POLICY IF EXISTS "Users can view all businesses" ON businesses;
DROP POLICY IF EXISTS "Users can update own business" ON businesses;

CREATE POLICY "Businesses read policy"
  ON businesses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Businesses update policy"
  ON businesses FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 4. CONSOLIDATE RLS POLICIES - INVESTOR_PROFILES
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view investor profiles" ON investor_profiles;
DROP POLICY IF EXISTS "Investors can manage own profile" ON investor_profiles;
DROP POLICY IF EXISTS "Investors can update own profile" ON investor_profiles;

CREATE POLICY "Investor profiles read policy"
  ON investor_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Investor profiles update policy"
  ON investor_profiles FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid())
  WITH CHECK (user_id = auth.uid());

-- ============================================================================
-- 5. CONSOLIDATE RLS POLICIES - PRODUCTS
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view products" ON products;
DROP POLICY IF EXISTS "Business owners can manage own products" ON products;
DROP POLICY IF EXISTS "Business owners can update own products" ON products;

CREATE POLICY "Products read policy"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Products update policy"
  ON products FOR UPDATE
  TO authenticated
  USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()))
  WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

-- ============================================================================
-- 6. CONSOLIDATE RLS POLICIES - SERVICES
-- ============================================================================

DROP POLICY IF EXISTS "Anyone can view services" ON services;
DROP POLICY IF EXISTS "Service providers can manage own services" ON services;
DROP POLICY IF EXISTS "Service providers can update own services" ON services;

CREATE POLICY "Services read policy"
  ON services FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Services update policy"
  ON services FOR UPDATE
  TO authenticated
  USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()))
  WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));

-- ============================================================================
-- 7. FIX CATEGORIES - REMOVE ALWAYS-TRUE UPDATE POLICY
-- ============================================================================

DROP POLICY IF EXISTS "Prevent unauthorized updates" ON categories;
DROP POLICY IF EXISTS "Prevent unauthorized deletes" ON categories;
DROP POLICY IF EXISTS "Categories are read-only" ON categories;
DROP POLICY IF EXISTS "Categories cannot be updated" ON categories;
DROP POLICY IF EXISTS "Categories cannot be deleted" ON categories;
DROP POLICY IF EXISTS "Anyone can view categories" ON categories;

-- Recreate with proper restrictive policies
CREATE POLICY "Categories public read"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Categories authenticated read"
  ON categories FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "No category inserts"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (false);

CREATE POLICY "No category updates"
  ON categories FOR UPDATE
  TO authenticated
  WITH CHECK (false);

CREATE POLICY "No category deletes"
  ON categories FOR DELETE
  TO authenticated
  USING (false);
