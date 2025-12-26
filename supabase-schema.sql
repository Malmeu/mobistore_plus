-- Création de la table des catégories
CREATE TABLE IF NOT EXISTS categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image_url TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table des produits
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  image_url TEXT NOT NULL,
  category TEXT NOT NULL,
  stock INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table des paramètres de livraison
CREATE TABLE IF NOT EXISTS delivery_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  wilaya TEXT UNIQUE NOT NULL,
  price DECIMAL(10, 2) NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table des images de produits
CREATE TABLE IF NOT EXISTS product_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  image_url TEXT NOT NULL,
  display_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table des commandes
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_address TEXT NOT NULL,
  wilaya TEXT NOT NULL,
  total DECIMAL(10, 2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Création de la table des articles de commande
CREATE TABLE IF NOT EXISTS order_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID REFERENCES orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insertion de données de test pour les catégories
INSERT INTO categories (name, slug, image_url) VALUES
  ('Coques', 'coques', 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=400'),
  ('Chargeurs', 'chargeurs', 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=400'),
  ('Écouteurs', 'ecouteurs', 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=400'),
  ('Câbles', 'cables', 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400'),
  ('Protections d''écran', 'protections', 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=400'),
  ('Supports', 'supports', 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=400')
ON CONFLICT (slug) DO NOTHING;

-- Insertion de données de test pour les produits
INSERT INTO products (name, description, price, image_url, category, stock) VALUES
  ('Coque iPhone 14 Pro Transparente', 'Coque de protection transparente ultra-fine pour iPhone 14 Pro', 1500, 'https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600', 'coques', 50),
  ('Coque Samsung Galaxy S23 Silicone', 'Coque en silicone souple avec protection renforcée', 1200, 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600', 'coques', 35),
  ('Chargeur Rapide 20W USB-C', 'Chargeur rapide compatible avec tous les appareils USB-C', 2500, 'https://images.unsplash.com/photo-1583863788434-e58a36330cf0?w=600', 'chargeurs', 100),
  ('Chargeur Sans Fil 15W', 'Station de charge sans fil rapide Qi certifié', 3500, 'https://images.unsplash.com/photo-1591290619762-c588f7e8e2f7?w=600', 'chargeurs', 45),
  ('Écouteurs Bluetooth TWS', 'Écouteurs sans fil avec réduction de bruit active', 4500, 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=600', 'ecouteurs', 60),
  ('Écouteurs Filaires Premium', 'Écouteurs avec micro et contrôle du volume', 1800, 'https://images.unsplash.com/photo-1484704849700-f032a568e944?w=600', 'ecouteurs', 80),
  ('Câble USB-C vers Lightning 2m', 'Câble de charge et synchronisation certifié MFi', 1500, 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600', 'cables', 120),
  ('Câble USB-C vers USB-C 1m', 'Câble de charge rapide 100W', 1200, 'https://images.unsplash.com/photo-1572569511254-d8f925fe2cbb?w=600', 'cables', 90),
  ('Protection d''écran iPhone 14', 'Verre trempé 9H ultra résistant', 800, 'https://images.unsplash.com/photo-1585060544812-6b45742d762f?w=600', 'protections', 150),
  ('Protection d''écran Samsung S23', 'Film de protection anti-rayures', 700, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600', 'protections', 130),
  ('Support Voiture Magnétique', 'Support téléphone avec fixation magnétique', 2000, 'https://images.unsplash.com/photo-1556656793-08538906a9f8?w=600', 'supports', 40),
  ('Support Bureau Réglable', 'Support de bureau avec angle ajustable', 2500, 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=600', 'supports', 55);

-- Activation de Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE delivery_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour permettre la lecture publique
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Lecture publique des produits') THEN
    CREATE POLICY "Lecture publique des produits" ON products FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Lecture publique des catégories') THEN
    CREATE POLICY "Lecture publique des catégories" ON categories FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'delivery_settings' AND policyname = 'Lecture publique des paramètres de livraison') THEN
    CREATE POLICY "Lecture publique des paramètres de livraison" ON delivery_settings FOR SELECT USING (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_images' AND policyname = 'Lecture publique des images de produits') THEN
    CREATE POLICY "Lecture publique des images de produits" ON product_images FOR SELECT USING (true);
  END IF;
END $$;

-- Politiques RLS pour les commandes (lecture et insertion publiques)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Lecture publique des commandes') THEN
    CREATE POLICY "Lecture publique des commandes" ON orders FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Insertion publique des commandes') THEN
    CREATE POLICY "Insertion publique des commandes" ON orders FOR INSERT WITH CHECK (true);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'Lecture publique des articles de commande') THEN
    CREATE POLICY "Lecture publique des articles de commande" ON order_items FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'order_items' AND policyname = 'Insertion publique des articles de commande') THEN
    CREATE POLICY "Insertion publique des articles de commande" ON order_items FOR INSERT WITH CHECK (true);
  END IF;
END $$;

-- Politiques RLS pour l'admin (modification des produits et paramètres)
-- Note: Ces politiques utilisent auth.uid() pour vérifier l'authentification
-- Pour l'instant, on utilise true pour permettre l'accès aux utilisateurs authentifiés
-- Dans une version production, vous devriez créer une table admin_users et vérifier le rôle
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Modification admin des produits') THEN
    CREATE POLICY "Modification admin des produits" ON products FOR ALL USING (auth.uid() IS NOT NULL);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'delivery_settings' AND policyname = 'Modification admin des paramètres de livraison') THEN
    CREATE POLICY "Modification admin des paramètres de livraison" ON delivery_settings FOR ALL USING (auth.uid() IS NOT NULL);
  END IF;
  
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'product_images' AND policyname = 'Modification admin des images de produits') THEN
    CREATE POLICY "Modification admin des images de produits" ON product_images FOR ALL USING (auth.uid() IS NOT NULL);
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'orders' AND policyname = 'Modification admin des commandes') THEN
    CREATE POLICY "Modification admin des commandes" ON orders FOR UPDATE USING (auth.uid() IS NOT NULL);
  END IF;
END $$;
