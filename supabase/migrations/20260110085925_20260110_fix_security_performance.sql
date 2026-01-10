/*
  # Fix Security & Performance Issues

  1. Add Missing Indexes
    - Foreign key indexes for campaigns.target_product_id
    - Foreign key indexes for campaigns.target_service_id
    - Foreign key indexes for products.category_id
    - Foreign key indexes for services.category_id

  2. Optimize RLS Policies
    - Replace auth.uid() with (select auth.uid()) in all policies for better performance
    - Applies to: users, businesses, wallets, products, services, campaigns, analytics, messages, investor_profiles, investment_requests

  3. Enable RLS on Categories
    - Table was public without RLS enabled
    - Add restrictive policy to allow public read access

  4. Security Notes
    - Indexes prevent sequential scans on foreign key lookups
    - Optimized RLS reduces per-row function evaluation overhead
    - Categories RLS ensures data integrity
*/

-- ============================================================================
-- 1. ADD MISSING FOREIGN KEY INDEXES
-- ============================================================================

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
    AND tablename = 'campaigns'
    AND indexname = 'idx_campaigns_target_product_id'
  ) THEN
    CREATE INDEX idx_campaigns_target_product_id ON campaigns(target_product_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
    AND tablename = 'campaigns'
    AND indexname = 'idx_campaigns_target_service_id'
  ) THEN
    CREATE INDEX idx_campaigns_target_service_id ON campaigns(target_service_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
    AND tablename = 'products'
    AND indexname = 'idx_products_category_id'
  ) THEN
    CREATE INDEX idx_products_category_id ON products(category_id);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_indexes
    WHERE schemaname = 'public'
    AND tablename = 'services'
    AND indexname = 'idx_services_category_id'
  ) THEN
    CREATE INDEX idx_services_category_id ON services(category_id);
  END IF;
END $$;

-- ============================================================================
-- 2. OPTIMIZE RLS POLICIES - USERS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can read own data" ON users;
CREATE POLICY "Users can read own data"
  ON users FOR SELECT
  TO authenticated
  USING ((select auth.uid()) = id);

DROP POLICY IF EXISTS "Users can update own profile" ON users;
CREATE POLICY "Users can update own profile"
  ON users FOR UPDATE
  TO authenticated
  USING ((select auth.uid()) = id)
  WITH CHECK ((select auth.uid()) = id);

-- ============================================================================
-- 3. OPTIMIZE RLS POLICIES - BUSINESSES TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can manage own business" ON businesses;
CREATE POLICY "Users can manage own business"
  ON businesses FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = businesses.user_id
      AND users.id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update own business" ON businesses;
CREATE POLICY "Users can update own business"
  ON businesses FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = businesses.user_id
      AND users.id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE users.id = businesses.user_id
      AND users.id = (select auth.uid())
    )
  );

-- ============================================================================
-- 4. OPTIMIZE RLS POLICIES - WALLETS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own wallet" ON wallets;
CREATE POLICY "Users can view own wallet"
  ON wallets FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Users can update own wallet" ON wallets;
CREATE POLICY "Users can update own wallet"
  ON wallets FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================================================
-- 5. OPTIMIZE RLS POLICIES - PRODUCTS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Business owners can manage own products" ON products;
CREATE POLICY "Business owners can manage own products"
  ON products FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = products.business_id
      AND businesses.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Business owners can update own products" ON products;
CREATE POLICY "Business owners can update own products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = products.business_id
      AND businesses.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = products.business_id
      AND businesses.user_id = (select auth.uid())
    )
  );

-- ============================================================================
-- 6. OPTIMIZE RLS POLICIES - SERVICES TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Service providers can manage own services" ON services;
CREATE POLICY "Service providers can manage own services"
  ON services FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = services.business_id
      AND businesses.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Service providers can update own services" ON services;
CREATE POLICY "Service providers can update own services"
  ON services FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = services.business_id
      AND businesses.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = services.business_id
      AND businesses.user_id = (select auth.uid())
    )
  );

-- ============================================================================
-- 7. OPTIMIZE RLS POLICIES - CAMPAIGNS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own campaigns" ON campaigns;
CREATE POLICY "Users can view own campaigns"
  ON campaigns FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = campaigns.business_id
      AND businesses.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can create campaigns" ON campaigns;
CREATE POLICY "Users can create campaigns"
  ON campaigns FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = campaigns.business_id
      AND businesses.user_id = (select auth.uid())
    )
  );

DROP POLICY IF EXISTS "Users can update own campaigns" ON campaigns;
CREATE POLICY "Users can update own campaigns"
  ON campaigns FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = campaigns.business_id
      AND businesses.user_id = (select auth.uid())
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = campaigns.business_id
      AND businesses.user_id = (select auth.uid())
    )
  );

-- ============================================================================
-- 8. OPTIMIZE RLS POLICIES - ANALYTICS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own analytics" ON analytics;
CREATE POLICY "Users can view own analytics"
  ON analytics FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM campaigns
      INNER JOIN businesses ON businesses.id = campaigns.business_id
      WHERE campaigns.id = analytics.campaign_id
      AND businesses.user_id = (select auth.uid())
    )
  );

-- ============================================================================
-- 9. OPTIMIZE RLS POLICIES - MESSAGES TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Users can view own messages" ON messages;
CREATE POLICY "Users can view own messages"
  ON messages FOR SELECT
  TO authenticated
  USING (
    sender_id = (select auth.uid()) OR recipient_id = (select auth.uid())
  );

DROP POLICY IF EXISTS "Users can send messages" ON messages;
CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  TO authenticated
  WITH CHECK (sender_id = (select auth.uid()));

-- ============================================================================
-- 10. OPTIMIZE RLS POLICIES - INVESTOR_PROFILES TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Investors can manage own profile" ON investor_profiles;
CREATE POLICY "Investors can manage own profile"
  ON investor_profiles FOR SELECT
  TO authenticated
  USING (user_id = (select auth.uid()));

DROP POLICY IF EXISTS "Investors can update own profile" ON investor_profiles;
CREATE POLICY "Investors can update own profile"
  ON investor_profiles FOR UPDATE
  TO authenticated
  USING (user_id = (select auth.uid()))
  WITH CHECK (user_id = (select auth.uid()));

-- ============================================================================
-- 11. OPTIMIZE RLS POLICIES - INVESTMENT_REQUESTS TABLE
-- ============================================================================

DROP POLICY IF EXISTS "Business owners can create requests" ON investment_requests;
CREATE POLICY "Business owners can create requests"
  ON investment_requests FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM businesses
      WHERE businesses.id = investment_requests.business_id
      AND businesses.user_id = (select auth.uid())
    )
  );

-- ============================================================================
-- 12. ENABLE RLS ON CATEGORIES TABLE
-- ============================================================================

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Anyone can view categories" ON categories;
CREATE POLICY "Anyone can view categories"
  ON categories FOR SELECT
  TO public
  USING (true);

-- ============================================================================
-- 3. PERFORMANCE NOTES
-- ============================================================================
-- All foreign key indexes now exist for optimal query performance
-- All RLS policies optimized to reduce per-row function call overhead
-- Categories table now has RLS enabled with public read access
-- Ready for production scale deployment
