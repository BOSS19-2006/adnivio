/*
  # Refine RLS Policies - Proper Security with Consolidated Logic

  Replace overly permissive consolidated policies with properly scoped ones
  that allow public viewing while maintaining owner-only modifications.
*/

-- ============================================================================
-- BUSINESSES: Public read, owner-only manage
-- ============================================================================

DROP POLICY IF EXISTS "Users can view businesses" ON businesses;
DROP POLICY IF EXISTS "Users can update own business" ON businesses;

CREATE POLICY "Users can view all businesses"
  ON businesses FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can update own business"
  ON businesses FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ============================================================================
-- INVESTOR PROFILES: Public read, owner-only manage
-- ============================================================================

DROP POLICY IF EXISTS "Investors can view profiles" ON investor_profiles;
DROP POLICY IF EXISTS "Investors can update own profile" ON investor_profiles;

CREATE POLICY "Anyone can view investor profiles"
  ON investor_profiles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Investors can update own profile"
  ON investor_profiles FOR UPDATE
  TO authenticated
  USING (user_id = (SELECT auth.uid()))
  WITH CHECK (user_id = (SELECT auth.uid()));

-- ============================================================================
-- PRODUCTS: Public read, owner-only manage
-- ============================================================================

DROP POLICY IF EXISTS "Products can be viewed" ON products;
DROP POLICY IF EXISTS "Business owners can update own products" ON products;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Business owners can update own products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = (SELECT auth.uid())
    )
  );

-- ============================================================================
-- SERVICES: Public read, owner-only manage
-- ============================================================================

DROP POLICY IF EXISTS "Services can be viewed" ON services;
DROP POLICY IF EXISTS "Service providers can update own services" ON services;

CREATE POLICY "Anyone can view services"
  ON services FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Service providers can update own services"
  ON services FOR UPDATE
  TO authenticated
  USING (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = (SELECT auth.uid())
    )
  )
  WITH CHECK (
    business_id IN (
      SELECT id FROM businesses WHERE user_id = (SELECT auth.uid())
    )
  );
