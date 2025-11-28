-- Create orders table for MBAH SOETA FAMILY t-shirt orders
CREATE TABLE IF NOT EXISTS orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  nama_lengkap TEXT NOT NULL,
  no_whatsapp TEXT,
  alamat TEXT,
  catatan TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order items table for size selections
CREATE TABLE IF NOT EXISTS order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  ukuran TEXT NOT NULL,
  sleeve_type TEXT NOT NULL DEFAULT 'pendek',
  jumlah INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- Allow public insert (for order submissions)
CREATE POLICY "Allow public insert on orders" ON orders
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public insert on order_items" ON order_items
  FOR INSERT WITH CHECK (true);

-- Allow public read for confirmation
CREATE POLICY "Allow public read on orders" ON orders
  FOR SELECT USING (true);

CREATE POLICY "Allow public read on order_items" ON order_items
  FOR SELECT USING (true);

-- Allow public delete for order management
CREATE POLICY "Allow public delete on orders" ON orders
  FOR DELETE USING (true);

CREATE POLICY "Allow public delete on order_items" ON order_items
  FOR DELETE USING (true);
