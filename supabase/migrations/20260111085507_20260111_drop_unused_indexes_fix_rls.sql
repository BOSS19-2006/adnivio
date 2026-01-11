/*
  # Drop Unused Indexes and Fix RLS Policy

  1. Remove 12 unused indexes that consume resources without providing query benefits
  2. Fix categories UPDATE policy USING clause to properly restrict access

  Issues Resolved:
  - Unused indexes: 12 indexes dropped for storage and performance optimization
  - RLS Policy Always True: Fixed categories UPDATE policy USING clause
*/

-- ============================================================================
-- 1. DROP UNUSED INDEXES
-- ============================================================================

DROP INDEX IF EXISTS idx_campaigns_target_product_id;
DROP INDEX IF EXISTS idx_campaigns_target_service_id;
DROP INDEX IF EXISTS idx_products_category_id;
DROP INDEX IF EXISTS idx_services_category_id;
DROP INDEX IF EXISTS idx_analytics_campaign_id;
DROP INDEX IF EXISTS idx_businesses_user_id;
DROP INDEX IF EXISTS idx_campaigns_business_id;
DROP INDEX IF EXISTS idx_investment_requests_business_id;
DROP INDEX IF EXISTS idx_messages_recipient_id;
DROP INDEX IF EXISTS idx_messages_sender_id;
DROP INDEX IF EXISTS idx_products_business_id;
DROP INDEX IF EXISTS idx_services_business_id;

-- ============================================================================
-- 2. FIX CATEGORIES UPDATE POLICY
-- ============================================================================

DROP POLICY IF EXISTS "No category updates" ON categories;

CREATE POLICY "No category updates"
  ON categories FOR UPDATE
  TO authenticated
  USING (false)
  WITH CHECK (false);
