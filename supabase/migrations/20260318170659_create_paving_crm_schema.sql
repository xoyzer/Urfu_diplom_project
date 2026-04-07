/*
  # Paving Stone Business CRM Schema

  ## Overview
  Complete database schema for a paving stone business with public catalog and CRM functionality.

  ## New Tables

  ### Products
  - `products` - Product catalog (paving stones, curbs, etc.)
    - `id` (uuid, primary key)
    - `name` (text) - Product name
    - `category` (text) - Product category (брусчатка, бордюры, etc.)
    - `description` (text) - Product description
    - `price_per_sqm` (decimal) - Price per square meter
    - `photo_url` (text) - Product image URL
    - `characteristics` (jsonb) - Product specifications
    - `stock_quantity` (decimal) - Current stock in m²
    - `is_active` (boolean) - Whether product is visible on site
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### Customers
  - `customers` - Customer database
    - `id` (uuid, primary key)
    - `name` (text) - Customer name
    - `phone` (text) - Phone number
    - `email` (text) - Email address
    - `company_name` (text) - Company name (optional)
    - `address` (text) - Delivery address
    - `notes` (text) - Additional notes
    - `created_at` (timestamptz)

  ### Orders
  - `orders` - Order management
    - `id` (uuid, primary key)
    - `order_number` (text, unique) - Human-readable order number
    - `customer_id` (uuid) - Reference to customers
    - `status` (text) - Order status
    - `total_amount` (decimal) - Total order cost
    - `delivery_cost` (decimal) - Delivery cost
    - `delivery_type` (text) - манипулятор or фура
    - `delivery_address` (text) - Delivery address
    - `delivery_date` (date) - Scheduled delivery date
    - `notes` (text) - Order notes
    - `source` (text) - Order source (website, phone)
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### Order Items
  - `order_items` - Products in each order
    - `id` (uuid, primary key)
    - `order_id` (uuid) - Reference to orders
    - `product_id` (uuid) - Reference to products
    - `quantity` (decimal) - Quantity in m²
    - `price_per_sqm` (decimal) - Price at time of order
    - `subtotal` (decimal) - Item subtotal
    - `created_at` (timestamptz)

  ### Order History
  - `order_history` - Communication and status change history
    - `id` (uuid, primary key)
    - `order_id` (uuid) - Reference to orders
    - `user_id` (uuid) - Manager who made the change
    - `action_type` (text) - Type of action (status_change, comment, call)
    - `old_status` (text) - Previous status
    - `new_status` (text) - New status
    - `comment` (text) - Communication notes
    - `created_at` (timestamptz)

  ### Vehicles
  - `vehicles` - Transport fleet management
    - `id` (uuid, primary key)
    - `name` (text) - Vehicle name/number
    - `type` (text) - манипулятор or фура
    - `capacity` (decimal) - Load capacity in tons
    - `license_plate` (text) - License plate number
    - `is_active` (boolean) - Whether vehicle is in service
    - `created_at` (timestamptz)

  ### Deliveries
  - `deliveries` - Delivery schedule and tracking
    - `id` (uuid, primary key)
    - `order_id` (uuid) - Reference to orders
    - `vehicle_id` (uuid) - Reference to vehicles
    - `scheduled_date` (date) - Scheduled delivery date
    - `actual_date` (date) - Actual delivery date
    - `status` (text) - Delivery status
    - `driver_notes` (text) - Driver notes
    - `created_at` (timestamptz)
    - `updated_at` (timestamptz)

  ### Inventory Transactions
  - `inventory_transactions` - Stock movement tracking
    - `id` (uuid, primary key)
    - `product_id` (uuid) - Reference to products
    - `transaction_type` (text) - incoming, outgoing, adjustment
    - `quantity` (decimal) - Quantity change (positive or negative)
    - `order_id` (uuid) - Related order (for outgoing)
    - `notes` (text) - Transaction notes
    - `created_at` (timestamptz)

  ## Security
  - Enable RLS on all tables
  - Public read access to products
  - Authenticated (manager) access to all CRM data
  - Customers table readable by authenticated users only
*/

-- Products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL,
  description text DEFAULT '',
  price_per_sqm decimal(10,2) NOT NULL,
  photo_url text DEFAULT '',
  characteristics jsonb DEFAULT '{}'::jsonb,
  stock_quantity decimal(10,2) DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Customers table
CREATE TABLE IF NOT EXISTS customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  phone text NOT NULL,
  email text DEFAULT '',
  company_name text DEFAULT '',
  address text DEFAULT '',
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES customers(id) ON DELETE RESTRICT,
  status text NOT NULL DEFAULT 'Новый',
  total_amount decimal(10,2) DEFAULT 0,
  delivery_cost decimal(10,2) DEFAULT 0,
  delivery_type text DEFAULT '',
  delivery_address text DEFAULT '',
  delivery_date date,
  notes text DEFAULT '',
  source text NOT NULL DEFAULT 'website',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Order items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  product_id uuid REFERENCES products(id) ON DELETE RESTRICT,
  quantity decimal(10,2) NOT NULL,
  price_per_sqm decimal(10,2) NOT NULL,
  subtotal decimal(10,2) NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Order history table
CREATE TABLE IF NOT EXISTS order_history (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  user_id uuid REFERENCES auth.users(id),
  action_type text NOT NULL,
  old_status text DEFAULT '',
  new_status text DEFAULT '',
  comment text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Vehicles table
CREATE TABLE IF NOT EXISTS vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  type text NOT NULL,
  capacity decimal(10,2) NOT NULL,
  license_plate text NOT NULL,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

-- Deliveries table
CREATE TABLE IF NOT EXISTS deliveries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES vehicles(id) ON DELETE SET NULL,
  scheduled_date date NOT NULL,
  actual_date date,
  status text NOT NULL DEFAULT 'Запланирована',
  driver_notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Inventory transactions table
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid REFERENCES products(id) ON DELETE RESTRICT,
  transaction_type text NOT NULL,
  quantity decimal(10,2) NOT NULL,
  order_id uuid REFERENCES orders(id) ON DELETE SET NULL,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_orders_customer_id ON orders(customer_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_order_history_order_id ON order_history(order_id);
CREATE INDEX IF NOT EXISTS idx_deliveries_scheduled_date ON deliveries(scheduled_date);
CREATE INDEX IF NOT EXISTS idx_inventory_transactions_product_id ON inventory_transactions(product_id);

-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_history ENABLE ROW LEVEL SECURITY;
ALTER TABLE vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE deliveries ENABLE ROW LEVEL SECURITY;
ALTER TABLE inventory_transactions ENABLE ROW LEVEL SECURITY;

-- RLS Policies for products (public can read active products, authenticated can manage)
CREATE POLICY "Anyone can view active products"
  ON products FOR SELECT
  USING (is_active = true);

CREATE POLICY "Authenticated users can view all products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for customers (authenticated only)
CREATE POLICY "Authenticated users can view customers"
  ON customers FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert customers"
  ON customers FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update customers"
  ON customers FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete customers"
  ON customers FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for orders (authenticated only)
CREATE POLICY "Authenticated users can view orders"
  ON orders FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update orders"
  ON orders FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete orders"
  ON orders FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for order_items (authenticated only)
CREATE POLICY "Authenticated users can view order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update order items"
  ON order_items FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete order items"
  ON order_items FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for order_history (authenticated only)
CREATE POLICY "Authenticated users can view order history"
  ON order_history FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert order history"
  ON order_history FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- RLS Policies for vehicles (authenticated only)
CREATE POLICY "Authenticated users can view vehicles"
  ON vehicles FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert vehicles"
  ON vehicles FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update vehicles"
  ON vehicles FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete vehicles"
  ON vehicles FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for deliveries (authenticated only)
CREATE POLICY "Authenticated users can view deliveries"
  ON deliveries FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert deliveries"
  ON deliveries FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated users can update deliveries"
  ON deliveries FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated users can delete deliveries"
  ON deliveries FOR DELETE
  TO authenticated
  USING (true);

-- RLS Policies for inventory_transactions (authenticated only)
CREATE POLICY "Authenticated users can view inventory transactions"
  ON inventory_transactions FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated users can insert inventory transactions"
  ON inventory_transactions FOR INSERT
  TO authenticated
  WITH CHECK (true);

-- Function to update product stock after inventory transaction
CREATE OR REPLACE FUNCTION update_product_stock()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE products
  SET stock_quantity = stock_quantity + NEW.quantity,
      updated_at = now()
  WHERE id = NEW.product_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_product_stock
  AFTER INSERT ON inventory_transactions
  FOR EACH ROW
  EXECUTE FUNCTION update_product_stock();

-- Function to generate order number
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number := 'ORD-' || TO_CHAR(NEW.created_at, 'YYYYMMDD') || '-' || LPAD(nextval('order_number_seq')::text, 4, '0');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE SEQUENCE IF NOT EXISTS order_number_seq;

CREATE TRIGGER trigger_generate_order_number
  BEFORE INSERT ON orders
  FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();

-- Function to update order updated_at timestamp
CREATE OR REPLACE FUNCTION update_order_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at := now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_order_timestamp
  BEFORE UPDATE ON orders
  FOR EACH ROW
  EXECUTE FUNCTION update_order_timestamp();