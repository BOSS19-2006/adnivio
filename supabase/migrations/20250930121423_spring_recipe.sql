/*
  # Complete Adnivio Platform Schema

  1. New Tables
    - Complete all missing tables for full platform functionality
    - Add comprehensive indexes and constraints
    - Implement advanced features like notifications, analytics, etc.

  2. Security
    - Complete RLS policies for all tables
    - Advanced security rules for different user roles
    - Data validation and constraints

  3. Functions & Triggers
    - Advanced business logic functions
    - Automated processes and calculations
    - Real-time updates and notifications
*/

-- Create additional enum types
CREATE TYPE notification_type AS ENUM ('order_update', 'payment_received', 'product_approved', 'new_message', 'investment_interest', 'deal_update');
CREATE TYPE wallet_transaction_type AS ENUM ('credit', 'debit', 'hold', 'release');
CREATE TYPE kyc_status AS ENUM ('pending', 'approved', 'rejected', 'expired');

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  type notification_type NOT NULL,
  title text NOT NULL,
  message text NOT NULL,
  data jsonb,
  is_read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Wallet table for financial management
CREATE TABLE IF NOT EXISTS wallets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  balance decimal(15,2) DEFAULT 0 CHECK (balance >= 0),
  ad_balance decimal(15,2) DEFAULT 0 CHECK (ad_balance >= 0),
  pending_balance decimal(15,2) DEFAULT 0 CHECK (pending_balance >= 0),
  total_earned decimal(15,2) DEFAULT 0,
  total_spent decimal(15,2) DEFAULT 0,
  currency text DEFAULT 'INR',
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  UNIQUE(user_id)
);

-- Wallet transactions for detailed financial tracking
CREATE TABLE IF NOT EXISTS wallet_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  wallet_id uuid NOT NULL REFERENCES wallets(id) ON DELETE CASCADE,
  transaction_id uuid REFERENCES transactions(id),
  type wallet_transaction_type NOT NULL,
  amount decimal(15,2) NOT NULL,
  balance_after decimal(15,2) NOT NULL,
  description text,
  metadata jsonb,
  created_at timestamptz DEFAULT now()
);

-- KYC verification table
CREATE TABLE IF NOT EXISTS kyc_verifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  document_type text NOT NULL,
  document_number text NOT NULL,
  document_images text[],
  status kyc_status DEFAULT 'pending',
  verified_at timestamptz,
  verified_by uuid REFERENCES profiles(id),
  rejection_reason text,
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Analytics events table
CREATE TABLE IF NOT EXISTS analytics_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id),
  event_type text NOT NULL,
  event_data jsonb NOT NULL,
  session_id text,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
);

-- Product analytics table
CREATE TABLE IF NOT EXISTS product_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  date date NOT NULL,
  views integer DEFAULT 0,
  clicks integer DEFAULT 0,
  cart_adds integer DEFAULT 0,
  purchases integer DEFAULT 0,
  revenue decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(product_id, date)
);

-- Seller analytics table
CREATE TABLE IF NOT EXISTS seller_analytics (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  date date NOT NULL,
  total_views integer DEFAULT 0,
  total_orders integer DEFAULT 0,
  total_revenue decimal(12,2) DEFAULT 0,
  conversion_rate decimal(5,4) DEFAULT 0,
  avg_order_value decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  UNIQUE(seller_id, date)
);

-- Coupons and discounts table
CREATE TABLE IF NOT EXISTS coupons (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  code text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  discount_type text NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
  discount_value decimal(10,2) NOT NULL CHECK (discount_value > 0),
  min_order_amount decimal(10,2) DEFAULT 0,
  max_discount_amount decimal(10,2),
  usage_limit integer,
  used_count integer DEFAULT 0,
  is_active boolean DEFAULT true,
  starts_at timestamptz DEFAULT now(),
  expires_at timestamptz,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Coupon usage tracking
CREATE TABLE IF NOT EXISTS coupon_usage (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  coupon_id uuid NOT NULL REFERENCES coupons(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id uuid NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  discount_amount decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now(),
  UNIQUE(coupon_id, user_id, order_id)
);

-- Shipping zones and rates
CREATE TABLE IF NOT EXISTS shipping_zones (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  countries text[],
  states text[],
  cities text[],
  postal_codes text[],
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS shipping_rates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  shipping_zone_id uuid NOT NULL REFERENCES shipping_zones(id) ON DELETE CASCADE,
  min_weight decimal(8,2) DEFAULT 0,
  max_weight decimal(8,2),
  min_order_value decimal(10,2) DEFAULT 0,
  max_order_value decimal(10,2),
  rate decimal(10,2) NOT NULL,
  free_shipping_threshold decimal(10,2),
  estimated_days_min integer DEFAULT 1,
  estimated_days_max integer DEFAULT 7,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security on new tables
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallets ENABLE ROW LEVEL SECURITY;
ALTER TABLE wallet_transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE kyc_verifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE seller_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupons ENABLE ROW LEVEL SECURITY;
ALTER TABLE coupon_usage ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;
ALTER TABLE shipping_rates ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Notifications policies
CREATE POLICY "Users can view own notifications" ON notifications
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can create notifications" ON notifications
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update own notifications" ON notifications
  FOR UPDATE USING (user_id = auth.uid());

-- Wallets policies
CREATE POLICY "Users can view own wallet" ON wallets
  FOR SELECT USING (user_id = auth.uid());

CREATE POLICY "System can manage wallets" ON wallets
  FOR ALL WITH CHECK (true);

-- Wallet transactions policies
CREATE POLICY "Users can view own wallet transactions" ON wallet_transactions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM wallets 
      WHERE wallets.id = wallet_transactions.wallet_id 
      AND wallets.user_id = auth.uid()
    )
  );

-- KYC policies
CREATE POLICY "Users can manage own KYC" ON kyc_verifications
  FOR ALL USING (user_id = auth.uid());

CREATE POLICY "Admins can view all KYC" ON kyc_verifications
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.role = 'admin'
    )
  );

-- Analytics policies
CREATE POLICY "System can create analytics events" ON analytics_events
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Sellers can view own product analytics" ON product_analytics
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM products 
      WHERE products.id = product_analytics.product_id 
      AND products.seller_id = auth.uid()
    )
  );

CREATE POLICY "Sellers can view own analytics" ON seller_analytics
  FOR SELECT USING (seller_id = auth.uid());

-- Coupons policies
CREATE POLICY "Sellers can manage own coupons" ON coupons
  FOR ALL USING (seller_id = auth.uid());

CREATE POLICY "Active coupons viewable by all" ON coupons
  FOR SELECT USING (is_active = true AND (expires_at IS NULL OR expires_at > now()));

-- Shipping policies
CREATE POLICY "Sellers can manage own shipping zones" ON shipping_zones
  FOR ALL USING (seller_id = auth.uid());

CREATE POLICY "Sellers can manage own shipping rates" ON shipping_rates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM shipping_zones 
      WHERE shipping_zones.id = shipping_rates.shipping_zone_id 
      AND shipping_zones.seller_id = auth.uid()
    )
  );

-- Create comprehensive indexes
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_notifications_is_read ON notifications(is_read);

CREATE INDEX IF NOT EXISTS idx_wallets_user_id ON wallets(user_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_wallet_id ON wallet_transactions(wallet_id);
CREATE INDEX IF NOT EXISTS idx_wallet_transactions_created_at ON wallet_transactions(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_kyc_verifications_user_id ON kyc_verifications(user_id);
CREATE INDEX IF NOT EXISTS idx_kyc_verifications_status ON kyc_verifications(status);

CREATE INDEX IF NOT EXISTS idx_analytics_events_user_id ON analytics_events(user_id);
CREATE INDEX IF NOT EXISTS idx_analytics_events_event_type ON analytics_events(event_type);
CREATE INDEX IF NOT EXISTS idx_analytics_events_created_at ON analytics_events(created_at DESC);

CREATE INDEX IF NOT EXISTS idx_product_analytics_product_id ON product_analytics(product_id);
CREATE INDEX IF NOT EXISTS idx_product_analytics_date ON product_analytics(date DESC);

CREATE INDEX IF NOT EXISTS idx_seller_analytics_seller_id ON seller_analytics(seller_id);
CREATE INDEX IF NOT EXISTS idx_seller_analytics_date ON seller_analytics(date DESC);

CREATE INDEX IF NOT EXISTS idx_coupons_seller_id ON coupons(seller_id);
CREATE INDEX IF NOT EXISTS idx_coupons_code ON coupons(code);
CREATE INDEX IF NOT EXISTS idx_coupons_is_active ON coupons(is_active);

-- Create triggers for updated_at columns
CREATE TRIGGER update_wallets_updated_at BEFORE UPDATE ON wallets
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_kyc_verifications_updated_at BEFORE UPDATE ON kyc_verifications
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_coupons_updated_at BEFORE UPDATE ON coupons
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Advanced Functions

-- Function to create wallet for new users
CREATE OR REPLACE FUNCTION create_user_wallet()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO wallets (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create wallet when user profile is created
CREATE TRIGGER create_user_wallet_trigger
  AFTER INSERT ON profiles
  FOR EACH ROW EXECUTE FUNCTION create_user_wallet();

-- Function to update wallet balance
CREATE OR REPLACE FUNCTION update_wallet_balance(
  p_user_id uuid,
  p_amount decimal,
  p_type wallet_transaction_type,
  p_description text DEFAULT NULL,
  p_transaction_id uuid DEFAULT NULL
)
RETURNS boolean AS $$
DECLARE
  v_wallet_id uuid;
  v_current_balance decimal;
  v_new_balance decimal;
BEGIN
  -- Get wallet info
  SELECT id, balance INTO v_wallet_id, v_current_balance
  FROM wallets WHERE user_id = p_user_id;
  
  IF v_wallet_id IS NULL THEN
    RAISE EXCEPTION 'Wallet not found for user %', p_user_id;
  END IF;
  
  -- Calculate new balance
  IF p_type = 'credit' THEN
    v_new_balance := v_current_balance + p_amount;
  ELSIF p_type = 'debit' THEN
    IF v_current_balance < p_amount THEN
      RAISE EXCEPTION 'Insufficient balance. Current: %, Required: %', v_current_balance, p_amount;
    END IF;
    v_new_balance := v_current_balance - p_amount;
  ELSE
    v_new_balance := v_current_balance;
  END IF;
  
  -- Update wallet balance
  UPDATE wallets SET 
    balance = v_new_balance,
    updated_at = now()
  WHERE id = v_wallet_id;
  
  -- Record transaction
  INSERT INTO wallet_transactions (
    wallet_id, transaction_id, type, amount, balance_after, description
  ) VALUES (
    v_wallet_id, p_transaction_id, p_type, p_amount, v_new_balance, p_description
  );
  
  RETURN true;
END;
$$ language 'plpgsql';

-- Function to calculate shipping cost
CREATE OR REPLACE FUNCTION calculate_shipping_cost(
  p_seller_id uuid,
  p_weight decimal,
  p_order_value decimal,
  p_destination jsonb
)
RETURNS decimal AS $$
DECLARE
  v_shipping_cost decimal := 0;
  v_zone_id uuid;
  v_rate decimal;
  v_free_threshold decimal;
BEGIN
  -- Find applicable shipping zone (simplified logic)
  SELECT sz.id INTO v_zone_id
  FROM shipping_zones sz
  WHERE sz.seller_id = p_seller_id
    AND sz.is_active = true
  LIMIT 1;
  
  IF v_zone_id IS NOT NULL THEN
    -- Get shipping rate
    SELECT sr.rate, sr.free_shipping_threshold 
    INTO v_rate, v_free_threshold
    FROM shipping_rates sr
    WHERE sr.shipping_zone_id = v_zone_id
      AND sr.is_active = true
      AND (sr.min_weight IS NULL OR p_weight >= sr.min_weight)
      AND (sr.max_weight IS NULL OR p_weight <= sr.max_weight)
      AND (sr.min_order_value IS NULL OR p_order_value >= sr.min_order_value)
      AND (sr.max_order_value IS NULL OR p_order_value <= sr.max_order_value)
    ORDER BY sr.rate ASC
    LIMIT 1;
    
    -- Apply free shipping if threshold met
    IF v_free_threshold IS NOT NULL AND p_order_value >= v_free_threshold THEN
      v_shipping_cost := 0;
    ELSE
      v_shipping_cost := COALESCE(v_rate, 50); -- Default shipping cost
    END IF;
  ELSE
    v_shipping_cost := 50; -- Default shipping cost
  END IF;
  
  RETURN v_shipping_cost;
END;
$$ language 'plpgsql';

-- Function to apply coupon
CREATE OR REPLACE FUNCTION apply_coupon(
  p_coupon_code text,
  p_user_id uuid,
  p_order_total decimal,
  p_seller_id uuid
)
RETURNS jsonb AS $$
DECLARE
  v_coupon_id uuid;
  v_discount_type text;
  v_discount_value decimal;
  v_min_order_amount decimal;
  v_max_discount_amount decimal;
  v_usage_limit integer;
  v_used_count integer;
  v_discount_amount decimal := 0;
  v_result jsonb;
BEGIN
  -- Get coupon details
  SELECT id, discount_type, discount_value, min_order_amount, 
         max_discount_amount, usage_limit, used_count
  INTO v_coupon_id, v_discount_type, v_discount_value, v_min_order_amount,
       v_max_discount_amount, v_usage_limit, v_used_count
  FROM coupons
  WHERE code = p_coupon_code
    AND seller_id = p_seller_id
    AND is_active = true
    AND (starts_at IS NULL OR starts_at <= now())
    AND (expires_at IS NULL OR expires_at > now());
  
  IF v_coupon_id IS NULL THEN
    RETURN jsonb_build_object('success', false, 'error', 'Invalid or expired coupon');
  END IF;
  
  -- Check usage limit
  IF v_usage_limit IS NOT NULL AND v_used_count >= v_usage_limit THEN
    RETURN jsonb_build_object('success', false, 'error', 'Coupon usage limit exceeded');
  END IF;
  
  -- Check minimum order amount
  IF v_min_order_amount IS NOT NULL AND p_order_total < v_min_order_amount THEN
    RETURN jsonb_build_object('success', false, 'error', 
      format('Minimum order amount of %s required', v_min_order_amount));
  END IF;
  
  -- Calculate discount
  IF v_discount_type = 'percentage' THEN
    v_discount_amount := p_order_total * (v_discount_value / 100);
  ELSE
    v_discount_amount := v_discount_value;
  END IF;
  
  -- Apply maximum discount limit
  IF v_max_discount_amount IS NOT NULL AND v_discount_amount > v_max_discount_amount THEN
    v_discount_amount := v_max_discount_amount;
  END IF;
  
  -- Ensure discount doesn't exceed order total
  IF v_discount_amount > p_order_total THEN
    v_discount_amount := p_order_total;
  END IF;
  
  RETURN jsonb_build_object(
    'success', true,
    'coupon_id', v_coupon_id,
    'discount_amount', v_discount_amount,
    'final_amount', p_order_total - v_discount_amount
  );
END;
$$ language 'plpgsql';

-- Function to send notification
CREATE OR REPLACE FUNCTION send_notification(
  p_user_id uuid,
  p_type notification_type,
  p_title text,
  p_message text,
  p_data jsonb DEFAULT NULL
)
RETURNS uuid AS $$
DECLARE
  v_notification_id uuid;
BEGIN
  INSERT INTO notifications (user_id, type, title, message, data)
  VALUES (p_user_id, p_type, p_title, p_message, p_data)
  RETURNING id INTO v_notification_id;
  
  RETURN v_notification_id;
END;
$$ language 'plpgsql';

-- Function to update product analytics
CREATE OR REPLACE FUNCTION update_product_analytics(
  p_product_id uuid,
  p_event_type text,
  p_revenue decimal DEFAULT 0
)
RETURNS void AS $$
DECLARE
  v_today date := CURRENT_DATE;
BEGIN
  INSERT INTO product_analytics (product_id, date, views, clicks, cart_adds, purchases, revenue)
  VALUES (
    p_product_id, 
    v_today,
    CASE WHEN p_event_type = 'view' THEN 1 ELSE 0 END,
    CASE WHEN p_event_type = 'click' THEN 1 ELSE 0 END,
    CASE WHEN p_event_type = 'cart_add' THEN 1 ELSE 0 END,
    CASE WHEN p_event_type = 'purchase' THEN 1 ELSE 0 END,
    p_revenue
  )
  ON CONFLICT (product_id, date)
  DO UPDATE SET
    views = product_analytics.views + CASE WHEN p_event_type = 'view' THEN 1 ELSE 0 END,
    clicks = product_analytics.clicks + CASE WHEN p_event_type = 'click' THEN 1 ELSE 0 END,
    cart_adds = product_analytics.cart_adds + CASE WHEN p_event_type = 'cart_add' THEN 1 ELSE 0 END,
    purchases = product_analytics.purchases + CASE WHEN p_event_type = 'purchase' THEN 1 ELSE 0 END,
    revenue = product_analytics.revenue + p_revenue;
END;
$$ language 'plpgsql';

-- Trigger to update product analytics on product view
CREATE OR REPLACE FUNCTION track_product_view()
RETURNS TRIGGER AS $$
BEGIN
  PERFORM update_product_analytics(NEW.id, 'view');
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger for product views (when views_count is updated)
CREATE TRIGGER track_product_view_trigger
  AFTER UPDATE OF views_count ON products
  FOR EACH ROW 
  WHEN (NEW.views_count > OLD.views_count)
  EXECUTE FUNCTION track_product_view();