import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  ArrowLeft, Save, Plus, X, Upload, Star, Trash2, MoveUp, MoveDown, Loader2
} from 'lucide-react';
import { supabase, DbProduct, DbProductImage } from '../../lib/supabase';

interface ProductFormProps {
  productId: string | null; // null = new product
  navigate: (to: string) => void;
}

type ImageItem = {
  id?: string;
  url: string;
  storage_path: string;
  is_primary: boolean;
  display_order: number;
  file?: File;        // pending upload
  uploading?: boolean;
};

type FormState = {
  name: string;
  category: string;
  subcategory: string;
  short_description: string;
  full_description: string;
  features: string[];
  ideal_environments: string[];
  light_type: string;
  material: string;
  tag: string;
  is_featured: boolean;
  display_order: number;
  status: 'active' | 'inactive';
};

const emptyForm: FormState = {
  name: '',
  category: '',
  subcategory: '',
  short_description: '',
  full_description: '',
  features: [],
  ideal_environments: [],
  light_type: '',
  material: '',
  tag: '',
  is_featured: false,
  display_order: 0,
  status: 'active',
};

const CATEGORIES = [
  'Tela Tensionada', 'Pendentes', 'Lineares', 'Embutidos', 'Decorativos', 'Externos'
];

export default function ProductForm({ productId, navigate }: ProductFormProps) {
  const isEditing = Boolean(productId);
  const [form, setForm] = useState<FormState>(emptyForm);
  const [images, setImages] = useState<ImageItem[]>([]);
  const [loading, setLoading] = useState(isEditing);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [newFeature, setNewFeature] = useState('');
  const [newEnvironment, setNewEnvironment] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load existing product
  useEffect(() => {
    if (!productId) return;
    setLoading(true);
    supabase
      .from('products')
      .select('*, product_images(*)')
      .eq('id', productId)
      .maybeSingle()
      .then(({ data }) => {
        if (!data) { navigate('/admin/products'); return; }
        const p = data as DbProduct;
        setForm({
          name: p.name,
          category: p.category,
          subcategory: p.subcategory || '',
          short_description: p.short_description,
          full_description: p.full_description,
          features: p.features || [],
          ideal_environments: p.ideal_environments || [],
          light_type: p.light_type,
          material: p.material,
          tag: p.tag || '',
          is_featured: p.is_featured,
          display_order: p.display_order,
          status: p.status,
        });
        const imgs = ((p.product_images || []) as DbProductImage[])
          .sort((a, b) => a.display_order - b.display_order)
          .map((img) => ({
            id: img.id,
            url: img.url,
            storage_path: img.storage_path || '',
            is_primary: img.is_primary,
            display_order: img.display_order,
          }));
        setImages(imgs);
        setLoading(false);
      });
  }, [productId]);

  const set = (key: keyof FormState, value: unknown) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  // Dynamic lists
  const addFeature = () => {
    const t = newFeature.trim();
    if (!t) return;
    set('features', [...form.features, t]);
    setNewFeature('');
  };
  const removeFeature = (i: number) =>
    set('features', form.features.filter((_, idx) => idx !== i));

  const addEnvironment = () => {
    const t = newEnvironment.trim();
    if (!t) return;
    set('ideal_environments', [...form.ideal_environments, t]);
    setNewEnvironment('');
  };
  const removeEnvironment = (i: number) =>
    set('ideal_environments', form.ideal_environments.filter((_, idx) => idx !== i));

  // Image upload
  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;
    const newItems: ImageItem[] = files.map((file, i) => ({
      url: URL.createObjectURL(file),
      storage_path: '',
      is_primary: images.length === 0 && i === 0,
      display_order: images.length + i,
      file,
      uploading: false,
    }));
    setImages((prev) => [...prev, ...newItems]);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const removeImage = async (index: number) => {
    const img = images[index];
    if (img.id && img.storage_path) {
      await supabase.storage.from('product-images').remove([img.storage_path]);
      await supabase.from('product_images').delete().eq('id', img.id);
    }
    setImages((prev) => {
      const next = prev.filter((_, i) => i !== index);
      if (img.is_primary && next.length > 0) {
        next[0].is_primary = true;
      }
      return next.map((img, i) => ({ ...img, display_order: i }));
    });
  };

  const setPrimary = (index: number) => {
    setImages((prev) =>
      prev.map((img, i) => ({ ...img, is_primary: i === index }))
    );
  };

  const moveImage = (index: number, dir: 'up' | 'down') => {
    setImages((prev) => {
      const next = [...prev];
      const target = dir === 'up' ? index - 1 : index + 1;
      if (target < 0 || target >= next.length) return prev;
      [next[index], next[target]] = [next[target], next[index]];
      return next.map((img, i) => ({ ...img, display_order: i }));
    });
  };

  // Upload a single image to Storage
  const uploadImage = async (img: ImageItem): Promise<ImageItem> => {
    if (!img.file) return img;
    const ext = img.file.name.split('.').pop() || 'jpg';
    const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
    const { error } = await supabase.storage
      .from('product-images')
      .upload(path, img.file, { cacheControl: '3600', upsert: false });
    if (error) throw new Error(error.message);
    const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path);
    return { ...img, url: urlData.publicUrl, storage_path: path, file: undefined };
  };

  // Save product
  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.category.trim()) {
      setError('Nome e categoria são obrigatórios.');
      return;
    }
    setError('');
    setSaving(true);

    try {
      // Upload pending images
      const uploadedImages = await Promise.all(
        images.map(async (img) => {
          if (!img.file) return img;
          setImages((prev) =>
            prev.map((x) => (x === img ? { ...x, uploading: true } : x))
          );
          const uploaded = await uploadImage(img);
          setImages((prev) =>
            prev.map((x) => (x === img ? { ...uploaded, uploading: false } : x))
          );
          return uploaded;
        })
      );

      const productData = {
        name: form.name.trim(),
        category: form.category.trim(),
        subcategory: form.subcategory.trim(),
        short_description: form.short_description.trim(),
        full_description: form.full_description.trim(),
        features: form.features,
        ideal_environments: form.ideal_environments,
        light_type: form.light_type.trim(),
        material: form.material.trim(),
        tag: form.tag.trim(),
        is_featured: form.is_featured,
        display_order: form.display_order,
        status: form.status,
      };

      let pid = productId;

      if (isEditing) {
        const { error: err } = await supabase
          .from('products')
          .update(productData)
          .eq('id', pid!);
        if (err) throw new Error(err.message);
      } else {
        const { data, error: err } = await supabase
          .from('products')
          .insert(productData)
          .select('id')
          .single();
        if (err) throw new Error(err.message);
        pid = (data as { id: string }).id;
      }

      // Sync images: delete removed ones, upsert remaining
      if (isEditing) {
        const existingIds = uploadedImages.filter((i) => i.id).map((i) => i.id);
        if (existingIds.length > 0) {
          await supabase
            .from('product_images')
            .delete()
            .eq('product_id', pid!)
            .not('id', 'in', `(${existingIds.join(',')})`);
        } else {
          await supabase.from('product_images').delete().eq('product_id', pid!);
        }
      }

      // Upsert images
      for (const img of uploadedImages) {
        if (!img.url) continue;
        if (img.id) {
          await supabase.from('product_images').update({
            is_primary: img.is_primary,
            display_order: img.display_order,
          }).eq('id', img.id);
        } else {
          await supabase.from('product_images').insert({
            product_id: pid!,
            url: img.url,
            storage_path: img.storage_path,
            is_primary: img.is_primary,
            display_order: img.display_order,
          });
        }
      }

      setSuccess(isEditing ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!');
      setTimeout(() => navigate('/admin/products'), 1200);
    } catch (err: unknown) {
      setError((err as Error).message || 'Erro ao salvar produto.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 size={24} className="animate-spin text-stone-400" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <div>
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => navigate('/admin/products')}
          className="text-stone-400 hover:text-stone-700 transition-colors"
        >
          <ArrowLeft size={18} strokeWidth={1.5} />
        </button>
        <div>
          <motion.h1
            className="font-display text-3xl text-stone-800 font-light"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {isEditing ? 'Editar Produto' : 'Novo Produto'}
          </motion.h1>
        </div>
      </div>

      <form onSubmit={handleSave}>
        <div className="grid lg:grid-cols-3 gap-6">
          {/* Main column */}
          <div className="lg:col-span-2 space-y-6">

            {/* Basic info */}
            <Section title="Informações Básicas">
              <Field label="Nome do Produto *">
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="Ex: Painel Tensionado XL Premium"
                  className="admin-input"
                  required
                />
              </Field>
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Categoria *">
                  <input
                    list="categories-list"
                    value={form.category}
                    onChange={(e) => set('category', e.target.value)}
                    placeholder="Selecione ou digite"
                    className="admin-input"
                    required
                  />
                  <datalist id="categories-list">
                    {CATEGORIES.map((c) => <option key={c} value={c} />)}
                  </datalist>
                </Field>
                <Field label="Subcategoria">
                  <input
                    type="text"
                    value={form.subcategory}
                    onChange={(e) => set('subcategory', e.target.value)}
                    placeholder="Ex: Teto, Parede..."
                    className="admin-input"
                  />
                </Field>
              </div>
            </Section>

            {/* Descriptions */}
            <Section title="Descrições">
              <Field label="Descrição Curta">
                <textarea
                  rows={2}
                  value={form.short_description}
                  onChange={(e) => set('short_description', e.target.value)}
                  placeholder="Resumo em 1–2 frases para o card do catálogo"
                  className="admin-input resize-none"
                />
              </Field>
              <Field label="Descrição Completa">
                <textarea
                  rows={5}
                  value={form.full_description}
                  onChange={(e) => set('full_description', e.target.value)}
                  placeholder="Descrição detalhada para a página do produto"
                  className="admin-input resize-none"
                />
              </Field>
            </Section>

            {/* Technical */}
            <Section title="Especificações Técnicas">
              <div className="grid sm:grid-cols-2 gap-4">
                <Field label="Tipo de Iluminação">
                  <input
                    type="text"
                    value={form.light_type}
                    onChange={(e) => set('light_type', e.target.value)}
                    placeholder="Ex: LED retroiluminado CRI >95"
                    className="admin-input"
                  />
                </Field>
                <Field label="Material">
                  <input
                    type="text"
                    value={form.material}
                    onChange={(e) => set('material', e.target.value)}
                    placeholder="Ex: Alumínio + Tecido PVC premium"
                    className="admin-input"
                  />
                </Field>
              </div>

              {/* Features */}
              <Field label="Características Técnicas">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {form.features.map((f, i) => (
                      <span key={i} className="flex items-center gap-1.5 bg-beige-200 text-stone-700 px-2.5 py-1 font-body text-xs">
                        {f}
                        <button type="button" onClick={() => removeFeature(i)} className="text-stone-400 hover:text-red-500 transition-colors">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newFeature}
                      onChange={(e) => setNewFeature(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addFeature(); } }}
                      placeholder="Digite e pressione Enter..."
                      className="flex-1 admin-input"
                    />
                    <button type="button" onClick={addFeature} className="px-3 py-2 border border-beige-300 text-stone-500 hover:text-stone-800 hover:border-stone-400 transition-colors">
                      <Plus size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </Field>

              {/* Environments */}
              <Field label="Ambientes Ideais">
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2">
                    {form.ideal_environments.map((env, i) => (
                      <span key={i} className="flex items-center gap-1.5 bg-beige-200 text-stone-700 px-2.5 py-1 font-body text-xs">
                        {env}
                        <button type="button" onClick={() => removeEnvironment(i)} className="text-stone-400 hover:text-red-500 transition-colors">
                          <X size={10} />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newEnvironment}
                      onChange={(e) => setNewEnvironment(e.target.value)}
                      onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addEnvironment(); } }}
                      placeholder="Ex: Salas de estar, Lobbies..."
                      className="flex-1 admin-input"
                    />
                    <button type="button" onClick={addEnvironment} className="px-3 py-2 border border-beige-300 text-stone-500 hover:text-stone-800 hover:border-stone-400 transition-colors">
                      <Plus size={14} strokeWidth={1.5} />
                    </button>
                  </div>
                </div>
              </Field>
            </Section>

            {/* Images */}
            <Section title="Imagens do Produto">
              <p className="font-body text-xs text-stone-400 mb-4">
                A imagem marcada com estrela será a imagem principal no catálogo.
                Formatos aceitos: JPG, PNG, WebP. Máximo 10MB por imagem.
              </p>

              {/* Upload area */}
              <div
                className="border-2 border-dashed border-beige-300 hover:border-gold-300 transition-colors p-8 text-center cursor-pointer mb-4"
                onClick={() => fileInputRef.current?.click()}
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  const files = Array.from(e.dataTransfer.files).filter(
                    (f) => f.type.startsWith('image/')
                  );
                  if (files.length) {
                    const fakeEvent = { target: { files } } as unknown as React.ChangeEvent<HTMLInputElement>;
                    handleFileSelect(fakeEvent);
                  }
                }}
              >
                <Upload size={24} strokeWidth={1} className="mx-auto text-stone-400 mb-2" />
                <p className="font-body text-sm text-stone-500">
                  Clique ou arraste imagens aqui
                </p>
                <p className="font-body text-xs text-stone-400 mt-1">
                  Múltiplos arquivos suportados
                </p>
              </div>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                className="hidden"
                onChange={handleFileSelect}
              />

              {/* Image grid */}
              {images.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {images.map((img, i) => (
                    <div key={i} className="relative group">
                      <div className="aspect-square overflow-hidden bg-beige-200">
                        <img
                          src={img.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                        {img.uploading && (
                          <div className="absolute inset-0 bg-stone-900/50 flex items-center justify-center">
                            <Loader2 size={20} className="animate-spin text-white" />
                          </div>
                        )}
                      </div>

                      {/* Primary badge */}
                      {img.is_primary && (
                        <div className="absolute top-2 left-2 bg-gold-300 text-stone-900 p-1">
                          <Star size={10} />
                        </div>
                      )}

                      {/* Overlay actions */}
                      <div className="absolute inset-0 bg-stone-900/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5">
                        {!img.is_primary && (
                          <button
                            type="button"
                            onClick={() => setPrimary(i)}
                            className="w-7 h-7 bg-gold-300 text-stone-900 flex items-center justify-center hover:bg-gold-400 transition-colors"
                            title="Definir como principal"
                          >
                            <Star size={12} />
                          </button>
                        )}
                        <button
                          type="button"
                          onClick={() => moveImage(i, 'up')}
                          disabled={i === 0}
                          className="w-7 h-7 bg-cream-200 text-stone-700 flex items-center justify-center disabled:opacity-30 hover:bg-cream-300 transition-colors"
                        >
                          <MoveUp size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => moveImage(i, 'down')}
                          disabled={i === images.length - 1}
                          className="w-7 h-7 bg-cream-200 text-stone-700 flex items-center justify-center disabled:opacity-30 hover:bg-cream-300 transition-colors"
                        >
                          <MoveDown size={12} />
                        </button>
                        <button
                          type="button"
                          onClick={() => removeImage(i)}
                          className="w-7 h-7 bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors"
                        >
                          <Trash2 size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Section>
          </div>

          {/* Side column */}
          <div className="space-y-4">
            {/* Status & settings */}
            <Section title="Publicação">
              <Field label="Status">
                <select
                  value={form.status}
                  onChange={(e) => set('status', e.target.value)}
                  className="admin-input"
                >
                  <option value="active">Ativo — visível no catálogo</option>
                  <option value="inactive">Inativo — oculto</option>
                </select>
              </Field>

              <Field label="Ordem de Exibição">
                <input
                  type="number"
                  min={0}
                  value={form.display_order}
                  onChange={(e) => set('display_order', parseInt(e.target.value) || 0)}
                  className="admin-input"
                />
                <p className="font-body text-[10px] text-stone-400 mt-1">
                  Menor número = aparece primeiro
                </p>
              </Field>

              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="font-body text-xs text-stone-700">Em destaque</p>
                  <p className="font-body text-[10px] text-stone-400">Aparece nas primeiras posições</p>
                </div>
                <button
                  type="button"
                  onClick={() => set('is_featured', !form.is_featured)}
                  className={`w-10 h-5 rounded-full transition-colors relative ${
                    form.is_featured ? 'bg-gold-300' : 'bg-beige-300'
                  }`}
                >
                  <span
                    className={`absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform ${
                      form.is_featured ? 'translate-x-5' : 'translate-x-0.5'
                    }`}
                  />
                </button>
              </div>
            </Section>

            {/* Tag */}
            <Section title="Etiqueta (opcional)">
              <Field label="Tag">
                <input
                  list="tags-list"
                  value={form.tag}
                  onChange={(e) => set('tag', e.target.value)}
                  placeholder="Ex: Novo, Premium, Exclusivo..."
                  className="admin-input"
                />
                <datalist id="tags-list">
                  {['Novo', 'Premium', 'Destaque', 'Exclusivo', 'Lançamento'].map((t) => (
                    <option key={t} value={t} />
                  ))}
                </datalist>
              </Field>
            </Section>

            {/* Save */}
            <div className="space-y-3 sticky top-20">
              {error && (
                <div className="p-3 bg-red-50 border border-red-100 font-body text-xs text-red-600">
                  {error}
                </div>
              )}
              {success && (
                <div className="p-3 bg-green-50 border border-green-100 font-body text-xs text-green-600">
                  {success}
                </div>
              )}

              <button
                type="submit"
                disabled={saving}
                className="btn-luxury w-full flex items-center justify-center gap-2.5 bg-stone-800 text-cream-100 py-3.5 hover:bg-stone-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                {saving ? (
                  <><Loader2 size={15} className="animate-spin" /> Salvando...</>
                ) : (
                  <><Save size={15} strokeWidth={1.5} /> {isEditing ? 'Salvar Alterações' : 'Criar Produto'}</>
                )}
              </button>

              <button
                type="button"
                onClick={() => navigate('/admin/products')}
                className="btn-luxury w-full py-3 border border-beige-300 text-stone-500 hover:border-stone-400 hover:text-stone-700 transition-all"
              >
                Cancelar
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-cream-100 border border-beige-200 p-6">
      <h3 className="font-display text-lg text-stone-700 font-light mb-5 pb-3 border-b border-beige-200">
        {title}
      </h3>
      <div className="space-y-4">{children}</div>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="font-body text-[10px] tracking-[0.2em] uppercase text-stone-500 block mb-1.5">
        {label}
      </label>
      {children}
    </div>
  );
}
