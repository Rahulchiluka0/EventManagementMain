-- Create inventory_categories table
CREATE TABLE IF NOT EXISTS inventory_categories (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert default categories
INSERT INTO inventory_categories (name) VALUES
  ('Food'),
  ('Beverages'),
  ('Accessories'),
  ('Clothing'),
  ('Crafts'),
  ('Electronics'),
  ('Services'),
  ('Other');

-- Create inventory_products table
CREATE TABLE IF NOT EXISTS inventory_products (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  stall_id UUID NOT NULL REFERENCES stalls(id) ON DELETE CASCADE,
  category_id INTEGER REFERENCES inventory_categories(id),
  name VARCHAR(255) NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  quantity INTEGER NOT NULL DEFAULT 0,
  image_url TEXT,
  -- Common optional fields
  size VARCHAR(100),
  color VARCHAR(100),
  ingredients TEXT,
  allergens TEXT,
  dietary TEXT,
  material VARCHAR(255),
  weight VARCHAR(100),
  dimensions VARCHAR(100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  is_active BOOLEAN DEFAULT TRUE
);

-- Create inventory_transactions table for tracking inventory changes
CREATE TABLE IF NOT EXISTS inventory_transactions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id UUID NOT NULL REFERENCES inventory_products(id) ON DELETE CASCADE,
  stall_id UUID NOT NULL REFERENCES stalls(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  transaction_type VARCHAR(50) NOT NULL, -- 'add', 'remove', 'update', 'sale'
  quantity INTEGER NOT NULL,
  previous_quantity INTEGER,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);