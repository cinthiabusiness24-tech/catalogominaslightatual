/*
  # Minas Light — Schema completo de gestão de produtos

  ## Tabelas criadas
  
  1. **categories**
     - `id` (uuid, PK)
     - `name` (text, único) — nome exibido
     - `slug` (text, único) — versão sem acento para URL
     - `created_at`

  2. **products**
     - `id` (uuid, PK)
     - `name`, `category`, `subcategory` — identificação
     - `short_description`, `full_description` — textos
     - `features` (text[]) — características técnicas
     - `ideal_environments` (text[]) — ambientes recomendados
     - `light_type`, `material`, `tag` — atributos técnicos
     - `is_featured` — destaque no catálogo
     - `display_order` — ordem de exibição
     - `status` — ativo/inativo (somente ativos aparecem no catálogo público)
     - `created_at`, `updated_at`

  3. **product_images**
     - `id` (uuid, PK)
     - `product_id` (FK → products, cascade delete)
     - `url` — URL pública (Supabase Storage ou URL externa)
     - `storage_path` — caminho no Storage para deletar depois
     - `is_primary` — imagem principal do card
     - `display_order` — ordem na galeria
     - `created_at`

  ## Segurança (RLS)
  
  - Leitura pública: qualquer visitante pode ver categorias, produtos ativos e suas imagens
  - Escrita restrita: apenas usuários autenticados (administrador) podem criar, editar e deletar
  - Produtos inativos: visíveis apenas para usuários autenticados

  ## Storage
  
  - Bucket `product-images` criado como público para leitura
  - Upload e deleção restritos a usuários autenticados
*/

-- ============================================================
-- 1. CATEGORIES
-- ============================================================
CREATE TABLE IF NOT EXISTS categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  slug text UNIQUE NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read categories"
  ON categories FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- 2. PRODUCTS
-- ============================================================
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  category text NOT NULL DEFAULT '',
  subcategory text DEFAULT '',
  short_description text DEFAULT '',
  full_description text DEFAULT '',
  features text[] DEFAULT '{}',
  ideal_environments text[] DEFAULT '{}',
  light_type text DEFAULT '',
  material text DEFAULT '',
  tag text DEFAULT '',
  is_featured boolean DEFAULT false,
  display_order integer DEFAULT 0,
  status text DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

-- Public can read active products
CREATE POLICY "Public can read active products"
  ON products FOR SELECT
  TO anon
  USING (status = 'active');

-- Authenticated can read all products (including inactive)
CREATE POLICY "Authenticated can read all products"
  ON products FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Authenticated can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (true);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS products_updated_at ON products;
CREATE TRIGGER products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================================
-- 3. PRODUCT_IMAGES
-- ============================================================
CREATE TABLE IF NOT EXISTS product_images (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id uuid NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url text NOT NULL,
  storage_path text DEFAULT '',
  is_primary boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE product_images ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read product images"
  ON product_images FOR SELECT
  TO anon, authenticated
  USING (true);

CREATE POLICY "Authenticated can insert product images"
  ON product_images FOR INSERT
  TO authenticated
  WITH CHECK (true);

CREATE POLICY "Authenticated can update product images"
  ON product_images FOR UPDATE
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Authenticated can delete product images"
  ON product_images FOR DELETE
  TO authenticated
  USING (true);

-- ============================================================
-- 4. STORAGE BUCKET
-- ============================================================
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'product-images',
  'product-images',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Public read product images storage'
  ) THEN
    CREATE POLICY "Public read product images storage"
      ON storage.objects FOR SELECT
      TO anon, authenticated
      USING (bucket_id = 'product-images');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Authenticated upload product images'
  ) THEN
    CREATE POLICY "Authenticated upload product images"
      ON storage.objects FOR INSERT
      TO authenticated
      WITH CHECK (bucket_id = 'product-images');
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE schemaname = 'storage' AND tablename = 'objects'
    AND policyname = 'Authenticated delete product images'
  ) THEN
    CREATE POLICY "Authenticated delete product images"
      ON storage.objects FOR DELETE
      TO authenticated
      USING (bucket_id = 'product-images');
  END IF;
END $$;

-- ============================================================
-- 5. INDEXES
-- ============================================================
CREATE INDEX IF NOT EXISTS idx_products_status ON products(status);
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category);
CREATE INDEX IF NOT EXISTS idx_products_display_order ON products(display_order);
CREATE INDEX IF NOT EXISTS idx_product_images_product_id ON product_images(product_id);
CREATE INDEX IF NOT EXISTS idx_product_images_is_primary ON product_images(product_id, is_primary);
