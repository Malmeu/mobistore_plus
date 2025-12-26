-- Configuration du bucket Storage pour les images de produits
-- Ce script doit être exécuté dans l'éditeur SQL de Supabase

-- Création du bucket 'products' pour stocker les images
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Politique pour permettre l'upload public (pour l'admin)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Permettre l''upload public des images produits') THEN
    CREATE POLICY "Permettre l'upload public des images produits"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'products');
  END IF;
END $$;

-- Politique pour permettre la lecture publique des images
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Permettre la lecture publique des images produits') THEN
    CREATE POLICY "Permettre la lecture publique des images produits"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'products');
  END IF;
END $$;

-- Politique pour permettre la mise à jour des images (admin)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Permettre la mise à jour des images produits') THEN
    CREATE POLICY "Permettre la mise à jour des images produits"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'products');
  END IF;
END $$;

-- Politique pour permettre la suppression des images (admin)
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage' AND policyname = 'Permettre la suppression des images produits') THEN
    CREATE POLICY "Permettre la suppression des images produits"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'products');
  END IF;
END $$;
