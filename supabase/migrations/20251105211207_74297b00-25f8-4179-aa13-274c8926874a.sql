-- Create categories table
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL UNIQUE,
  icon_url TEXT,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create vendors table
CREATE TABLE public.vendors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  location TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create products table
CREATE TABLE public.products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  price DECIMAL(10, 2) NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  vendor_id UUID REFERENCES public.vendors(id) ON DELETE SET NULL,
  image_url TEXT,
  stock INTEGER DEFAULT 0,
  is_featured BOOLEAN DEFAULT FALSE,
  is_on_sale BOOLEAN DEFAULT FALSE,
  sale_price DECIMAL(10, 2),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create cart table
CREATE TABLE public.cart (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Create orders table
CREATE TABLE public.orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  user_email TEXT NOT NULL,
  order_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  status TEXT DEFAULT 'Confirmed' CHECK (status IN ('Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled')),
  total_price DECIMAL(10, 2) NOT NULL,
  delivery_address TEXT NOT NULL,
  contact_number TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create order_items table
CREATE TABLE public.order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE SET NULL,
  product_name TEXT NOT NULL,
  product_image TEXT,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vendors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cart ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- RLS Policies for categories (public read)
CREATE POLICY "Anyone can view categories"
  ON public.categories FOR SELECT
  USING (true);

-- RLS Policies for vendors (public read)
CREATE POLICY "Anyone can view vendors"
  ON public.vendors FOR SELECT
  USING (true);

-- RLS Policies for products (public read)
CREATE POLICY "Anyone can view products"
  ON public.products FOR SELECT
  USING (true);

-- RLS Policies for cart (user-specific)
CREATE POLICY "Users can view their own cart"
  ON public.cart FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert into their own cart"
  ON public.cart FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own cart"
  ON public.cart FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from their own cart"
  ON public.cart FOR DELETE
  USING (auth.uid() = user_id);

-- RLS Policies for orders (user-specific)
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- RLS Policies for order_items (through orders)
CREATE POLICY "Users can view their own order items"
  ON public.order_items FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create order items for their orders"
  ON public.order_items FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for products updated_at
CREATE TRIGGER set_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Insert sample categories
INSERT INTO public.categories (name, description) VALUES
  ('Electronics', 'Latest gadgets and electronic devices'),
  ('Fashion', 'Trendy clothing and accessories'),
  ('Home & Living', 'Furniture and home decor'),
  ('Grocery & Essentials', 'Daily necessities and groceries');

-- Insert sample vendors
INSERT INTO public.vendors (name, location, description, image_url) VALUES
  ('TechHub Delhi', 'New Delhi', 'Leading electronics retailer in North India', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=400'),
  ('Fashion Street Mumbai', 'Mumbai', 'Trendy fashion from the heart of Mumbai', 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=400'),
  ('Jaipur Handicrafts', 'Jaipur', 'Authentic Rajasthani home decor', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?w=400'),
  ('Local Mart Bangalore', 'Bangalore', 'Your neighborhood essentials store', 'https://images.unsplash.com/photo-1604719312566-8912e9227c6a?w=400');

-- Insert sample products
INSERT INTO public.products (name, description, price, sale_price, category_id, vendor_id, image_url, stock, is_featured, is_on_sale) VALUES
  ('Wireless Headphones Pro', 'Premium noise-cancelling headphones with 40-hour battery life', 4999.00, 3999.00, 
    (SELECT id FROM categories WHERE name = 'Electronics'), 
    (SELECT id FROM vendors WHERE name = 'TechHub Delhi'),
    'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=600', 50, true, true),
  
  ('Smart Watch Series 5', 'Advanced fitness tracking with heart rate monitor', 12999.00, NULL,
    (SELECT id FROM categories WHERE name = 'Electronics'),
    (SELECT id FROM vendors WHERE name = 'TechHub Delhi'),
    'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600', 30, true, false),
  
  ('Cotton Kurta Set', 'Comfortable ethnic wear for everyday use', 1499.00, 1199.00,
    (SELECT id FROM categories WHERE name = 'Fashion'),
    (SELECT id FROM vendors WHERE name = 'Fashion Street Mumbai'),
    'https://images.unsplash.com/photo-1583391733956-3750e0ff4e8b?w=600', 100, true, true),
  
  ('Designer Saree', 'Elegant silk saree for special occasions', 5999.00, NULL,
    (SELECT id FROM categories WHERE name = 'Fashion'),
    (SELECT id FROM vendors WHERE name = 'Fashion Street Mumbai'),
    'https://images.unsplash.com/photo-1610030469983-98e550d6193c?w=600', 25, false, false),
  
  ('Handcrafted Wall Art', 'Traditional Rajasthani miniature painting', 2499.00, NULL,
    (SELECT id FROM categories WHERE name = 'Home & Living'),
    (SELECT id FROM vendors WHERE name = 'Jaipur Handicrafts'),
    'https://images.unsplash.com/photo-1582053433976-25c00369fc93?w=600', 15, false, false),
  
  ('Wooden Coffee Table', 'Rustic sheesham wood coffee table', 8999.00, 7999.00,
    (SELECT id FROM categories WHERE name = 'Home & Living'),
    (SELECT id FROM vendors WHERE name = 'Jaipur Handicrafts'),
    'https://images.unsplash.com/photo-1533090481720-856c6e3c1fdc?w=600', 10, true, true),
  
  ('Organic Rice 5kg', 'Premium quality basmati rice', 599.00, NULL,
    (SELECT id FROM categories WHERE name = 'Grocery & Essentials'),
    (SELECT id FROM vendors WHERE name = 'Local Mart Bangalore'),
    'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=600', 200, false, false),
  
  ('Multi-Grain Atta 10kg', 'Healthy blend of wheat and grains', 450.00, 399.00,
    (SELECT id FROM categories WHERE name = 'Grocery & Essentials'),
    (SELECT id FROM vendors WHERE name = 'Local Mart Bangalore'),
    'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?w=600', 150, false, true);