/*
  # Fix Remaining Security Issues

  1. Add missing foreign key indexes
  2. Optimize RLS policies using (select auth.uid()) pattern
  3. Consolidate categories SELECT policies
  4. Fix categories UPDATE policy to be restrictive
  
  Issues Fixed:
  - Unindexed foreign keys: campaigns.target_product_id, campaigns.target_service_id, products.category_id, services.category_id
  - Auth RLS Initialization Plan: Optimize auth function calls in policies
  - Multiple Permissive Policies: Consolidate categories SELECT policies
  - RLS Policy Always True: Fix categories UPDATE policy
*/

-- ============================================================================
-- 1. ADD MISSING FOREIGN KEY INDEXES
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_campaigns_target_product_id') THEN
    CREATE INDEX idx_campaigns_target_product_id ON public.campaigns(target_product_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_campaigns_target_service_id') THEN
    CREATE INDEX idx_campaigns_target_service_id ON public.campaigns(target_service_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_products_category_id') THEN
    CREATE INDEX idx_products_category_id ON public.products(category_id);
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_indexes WHERE indexname = 'idx_services_category_id') THEN
    CREATE INDEX idx_services_category_id ON public.services(category_id);
  END IF;
END $$;

-- ============================================================================
-- 2. OPTIMIZE RLS POLICIES - BUSINESSES
-- ============================================================================

DROP POLICY IF EXISTS "Businesses update policy" ON businesses;

CREATE POLICY "Businesses update policy"
  ON businesses FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ============================================================================
-- 3. OPTIMIZE RLS POLICIES - INVESTOR_PROFILES
-- ============================================================================

DROP POLICY IF EXISTS "Investor profiles update policy" ON investor_profiles;

CREATE POLICY "Investor profiles update policy"
  ON investor_profiles FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ============================================================================
-- 4. OPTIMIZE RLS POLICIES - PRODUCTS
-- ============================================================================

DROP POLICY IF EXISTS "Products update policy" ON products;

CREATE POLICY "Products update policy"
  ON products FOR UPDATE
  TO authenticated
  USING (business_id IN (SELECT id FROM businesses WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = (SELECT auth.uid())));

-- ============================================================================
-- 5. OPTIMIZE RLS POLICIES - SERVICES
-- ============================================================================

DROP POLICY IF EXISTS "Services update policy" ON services;

CREATE POLICY "Services update policy"
  ON services FOR UPDATE
  TO authenticated
  USING (business_id IN (SELECT id FROM businesses WHERE user_id = (SELECT auth.uid())))
  WITH CHECK (business_id IN (SELECT id FROM businesses WHERE user_id = (SELECT auth.uid())));

-- ============================================================================
-- 6. CONSOLIDATE CATEGORIES SELECT POLICIES
-- ============================================================================

DROP POLICY IF EXISTS "Categories public read" ON categories;
DROP POLICY IF EXISTS "Categories authenticated read" ON categories;

CREATE POLICY "Categories read access"
  ON categories FOR SELECT
  TO public
  USING (true);

-- ============================================================================
-- 7. FIX CATEGORIES UPDATE POLICY
-- ============================================================================

DROP POLICY IF EXISTS "No category updates" ON categories;

CREATE POLICY "No category updates"
  ON categories FOR UPDATE
  TO authenticated
  WITH CHECK (false);
