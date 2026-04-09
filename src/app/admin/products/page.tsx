"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/Button";
import { Input, Textarea } from "@/components/ui/Input";

interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  imageUrl: string | null;
  brand: string | null;
  featured: boolean;
  createdAt: string;
}

const EMPTY_FORM = {
  name: "",
  description: "",
  price: "",
  brand: "",
  imageUrl: "",
  featured: false,
};

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState<number | null>(null);
  const [error, setError] = useState("");
  const [uploading, setUploading] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  async function fetchProducts() {
    setLoading(true);
    const res = await fetch("/api/products");
    const json = await res.json();
    if (json.success) setProducts(json.data);
    setLoading(false);
  }

  function openAdd() {
    setEditing(null);
    setForm(EMPTY_FORM);
    setError("");
    setShowModal(true);
  }

  function openEdit(p: Product) {
    setEditing(p);
    setForm({
      name: p.name,
      description: p.description,
      price: String(p.price),
      brand: p.brand ?? "",
      imageUrl: p.imageUrl ?? "",
      featured: p.featured,
    });
    setError("");
    setShowModal(true);
  }

  function closeModal() {
    setShowModal(false);
    setEditing(null);
    setError("");
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch("/api/upload", { method: "POST", body: fd });
    const json = await res.json();
    if (json.success) {
      setForm((f) => ({ ...f, imageUrl: json.data.url }));
    } else {
      setError(json.error ?? "Uppladdning misslyckades");
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = "";
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSaving(true);

    const payload = {
      name: form.name,
      description: form.description,
      price: parseFloat(form.price),
      brand: form.brand || null,
      imageUrl: form.imageUrl || null,
      featured: form.featured,
    };

    const url = editing ? `/api/products/${editing.id}` : "/api/products";
    const method = editing ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    const json = await res.json();

    if (json.success) {
      await fetchProducts();
      closeModal();
    } else {
      setError(json.error ?? "Något gick fel");
    }
    setSaving(false);
  }

  async function handleDelete(id: number) {
    if (!confirm("Är du säker på att du vill ta bort denna produkt?")) return;
    setDeleting(id);
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setDeleting(null);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Produkter</h1>
          <p className="text-slate-500 text-sm mt-1">{products.length} produkter totalt</p>
        </div>
        <Button onClick={openAdd}>+ Lägg till produkt</Button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-slate-400">Laddar produkter...</div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 py-20 text-center">
          <div className="text-4xl mb-3">📦</div>
          <p className="text-slate-500 text-sm">Inga produkter än. Klicka på &quot;Lägg till produkt&quot; för att börja.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map((p) => (
            <div key={p.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden flex flex-col">
              <div className="relative h-48 bg-slate-100">
                {p.imageUrl ? (
                  <Image
                    src={p.imageUrl}
                    alt={p.name}
                    fill
                    className="object-cover"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-slate-300 text-5xl">📷</div>
                )}
                {p.featured && (
                  <span className="absolute top-2 left-2 bg-blue-600 text-white text-xs font-semibold px-2 py-0.5 rounded-full">
                    Utvald
                  </span>
                )}
              </div>
              <div className="p-5 flex flex-col flex-1">
                {p.brand && <div className="text-xs text-blue-600 font-semibold uppercase tracking-wide mb-1">{p.brand}</div>}
                <h3 className="font-semibold text-slate-900 text-sm leading-snug mb-1">{p.name}</h3>
                <p className="text-slate-500 text-xs leading-relaxed line-clamp-2 flex-1">{p.description}</p>
                <div className="mt-4 flex items-center justify-between">
                  <span className="text-lg font-bold text-slate-900">
                    {p.price.toLocaleString("sv-SE")} kr
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => openEdit(p)}
                      className="text-xs px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200 font-medium transition-colors"
                    >
                      Redigera
                    </button>
                    <button
                      onClick={() => handleDelete(p.id)}
                      disabled={deleting === p.id}
                      className="text-xs px-3 py-1.5 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 font-medium transition-colors disabled:opacity-50"
                    >
                      {deleting === p.id ? "..." : "Ta bort"}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={closeModal} />
          <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <h2 className="text-lg font-semibold text-slate-900">
                {editing ? "Redigera produkt" : "Ny produkt"}
              </h2>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600 text-xl leading-none">✕</button>
            </div>

            <form onSubmit={handleSave} className="p-6 space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl px-4 py-3">
                  {error}
                </div>
              )}

              {/* Image */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-slate-700">Produktbild</label>
                {form.imageUrl && (
                  <div className="relative h-40 rounded-xl overflow-hidden bg-slate-100 mb-2">
                    <Image
                      src={form.imageUrl}
                      alt="Förhandsvisning"
                      fill
                      className="object-cover"
                      sizes="448px"
                    />
                    <button
                      type="button"
                      onClick={() => setForm((f) => ({ ...f, imageUrl: "" }))}
                      className="absolute top-2 right-2 bg-white/80 hover:bg-white text-slate-700 rounded-lg px-2 py-0.5 text-xs font-medium"
                    >
                      Ta bort
                    </button>
                  </div>
                )}
                <div className="flex gap-2">
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="product-image-upload"
                  />
                  <label
                    htmlFor="product-image-upload"
                    className={`flex-1 flex items-center justify-center gap-2 border-2 border-dashed rounded-xl py-3 text-sm font-medium cursor-pointer transition-colors ${
                      uploading
                        ? "border-slate-200 text-slate-400 cursor-wait"
                        : "border-slate-200 text-slate-500 hover:border-blue-400 hover:text-blue-600"
                    }`}
                  >
                    {uploading ? "Laddar upp..." : "📷 Välj bild"}
                  </label>
                </div>
              </div>

              <Input
                label="Produktnamn"
                required
                placeholder="t.ex. Daikin Emura 3 – 3,5 kW"
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              />

              <Input
                label="Varumärke"
                placeholder="t.ex. Daikin"
                value={form.brand}
                onChange={(e) => setForm((f) => ({ ...f, brand: e.target.value }))}
              />

              <Textarea
                label="Beskrivning"
                required
                placeholder="Beskriv produkten..."
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />

              <Input
                label="Pris (kr)"
                required
                type="number"
                min="0"
                step="1"
                placeholder="t.ex. 12900"
                value={form.price}
                onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              />

              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.featured}
                  onChange={(e) => setForm((f) => ({ ...f, featured: e.target.checked }))}
                  className="w-4 h-4 rounded accent-blue-600"
                />
                <span className="text-sm text-slate-700 font-medium">Visa som utvald produkt</span>
              </label>

              <div className="flex gap-3 pt-2">
                <Button type="button" variant="secondary" className="flex-1" onClick={closeModal}>
                  Avbryt
                </Button>
                <Button type="submit" loading={saving} className="flex-1">
                  {editing ? "Spara ändringar" : "Lägg till"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
