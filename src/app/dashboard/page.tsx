"use client";

import { motion } from "framer-motion";
import { Search, Filter, Plus, MapPin, Recycle, ExternalLink, Heart } from "lucide-react";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

const CATEGORIES = ["Hogar", "Herramientas", "Ropa", "Servicios", "Otros"];

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<any>(null);
  const [showPublishModal, setShowPublishModal] = useState(false);
  const [itemTitle, setItemTitle] = useState("");
  const [itemCategory, setItemCategory] = useState("Hogar");
  const [itemDescription, setItemDescription] = useState("");
  const [itemLookingFor, setItemLookingFor] = useState("");
  const [itemImage, setItemImage] = useState<File | null>(null);
  const [isPublishing, setIsPublishing] = useState(false);

  useEffect(() => {
    checkUser();
    fetchItems();
  }, [selectedCategory, searchQuery]);

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    setUser(user);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    window.location.href = "/";
  };


  const fetchItems = async () => {
    setLoading(true);
    let query = supabase
      .from('items')
      .select(`
        *,
        profiles:owner_id (username, trust_points)
      `)
      .order('created_at', { ascending: false });

    if (selectedCategory !== "Todos") {
      query = query.eq('category', selectedCategory);
    }

    if (searchQuery) {
      query = query.ilike('title', `%${searchQuery}%`);
    }

    const { data, error } = await query;
    if (error) console.error("Error fetching items:", error);
    else setItems(data || []);
    setLoading(false);
  };

  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return alert("Debes iniciar sesión para publicar");
    setIsPublishing(true);

    let imageUrl = null;
    if (itemImage) {
      const fileExt = itemImage.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('items')
        .upload(fileName, itemImage);
      
      if (!uploadError) {
        const { data: { publicUrl } } = supabase.storage
          .from('items')
          .getPublicUrl(fileName);
        imageUrl = publicUrl;
      }
    }

    const { error } = await supabase.from('items').insert({
      owner_id: user.id,
      title: itemTitle,
      category: itemCategory,
      description: itemDescription,
      looking_for: itemLookingFor,
      image_url: imageUrl,
      status: 'active'
    });

    if (error) alert("Error: " + error.message);
    else {
      setShowPublishModal(false);
      setItemTitle("");
      setItemDescription("");
      setItemLookingFor("");
      setItemImage(null);
      fetchItems();
    }
    setIsPublishing(false);
  };


  return (
    <div className="min-h-screen bg-[#0a0a0a] pb-24">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-0 border-b border-emerald-500/10 rounded-none bg-[#0a0a0a]/80 py-4 px-6 mb-8">
        <div className="max-w-7xl mx-auto flex flex-col md:row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 group">
            <Recycle className="w-8 h-8 text-emerald-500 group-hover:rotate-180 transition-transform duration-700" />
            <span className="text-2xl font-black font-outfit tracking-tight">Trueque<span className="text-emerald-500">MX</span></span>
          </Link>

          <div className="flex-1 max-w-xl w-full relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="¿Qué buscas intercambiar hoy?" 
              className="w-full bg-neutral-900/50 border border-emerald-500/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-light"
            />
          </div>

          <div className="flex items-center gap-4">
             {user && (
               <button 
                 onClick={handleLogout}
                 className="px-4 py-2 text-xs font-bold text-emerald-500 hover:text-emerald-400 transition-colors uppercase tracking-widest"
               >
                 Salir
               </button>
             )}
             <button 
               onClick={() => setShowPublishModal(true)}
               className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-[#0a0a0a] font-bold rounded-2xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
             >
               <Plus className="w-5 h-5" />
               Publicar
             </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6">
        {/* Filters */}
        <div className="flex gap-3 overflow-x-auto pb-6 no-scrollbar">
          <button 
            onClick={() => setSelectedCategory("Todos")}
            className={`px-6 py-2 rounded-full transition-all whitespace-nowrap font-medium ${selectedCategory === "Todos" ? 'bg-emerald-500 text-[#0a0a0a]' : 'glass hover:bg-emerald-500/10 text-neutral-400'}`}
          >
            Todos
          </button>
          {CATEGORIES.map(cat => (
            <button 
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-6 py-2 rounded-full transition-all whitespace-nowrap font-medium ${selectedCategory === cat ? 'bg-emerald-500 text-[#0a0a0a]' : 'glass hover:bg-emerald-500/10 text-neutral-400'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Feed Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {loading ? (
             Array(8).fill(0).map((_, i) => (
                <div key={i} className="glass h-96 animate-pulse bg-emerald-500/5 rounded-3xl" />
             ))
          ) : items.length > 0 ? (
            items.map((item, i) => (
              <motion.div 
                key={item.id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="glass group hover:border-emerald-500/40 transition-all duration-300 flex flex-col h-full overflow-hidden"
              >
                <div className="relative aspect-square bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors duration-500">
                  {item.image_url ? (
                    <img src={item.image_url} alt={item.title} className="w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center opacity-20">
                       <Recycle className="w-16 h-16 text-emerald-500" />
                    </div>
                  )}
                  <div className="absolute top-3 left-3 px-3 py-1 glass bg-black/40 text-xs font-bold text-emerald-400 rounded-lg">
                    {item.category}
                  </div>
                </div>

                <div className="p-5 flex flex-col flex-1 gap-3">
                  <div className="flex justify-between items-start">
                    <h3 className="text-xl font-bold font-outfit leading-tight group-hover:text-emerald-400 transition-colors uppercase tracking-tight">{item.title}</h3>
                  </div>
                  
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">Busco a cambio:</span>
                    <p className="text-neutral-400 font-light text-sm line-clamp-2">{item.looking_for || "Cualquier oferta"}</p>
                  </div>

                  <div className="mt-auto pt-4 border-t border-emerald-500/10 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-emerald-400 uppercase">
                         {item.profiles?.username?.[0] || '?'}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs font-bold text-white">{item.profiles?.username}</span>
                        <span className="text-[10px] text-emerald-500/70 font-semibold">{item.profiles?.trust_points || 0} pts</span>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => alert(`Enviando interés por ${item.title} a ${item.profiles?.username}...`)}
                      className="p-2.5 glass hover:bg-emerald-500/30 text-emerald-400 rounded-xl transition-all"
                    >
                      <ExternalLink className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center gap-4">
               <div className="w-20 h-20 rounded-full bg-emerald-500/5 flex items-center justify-center">
                  <Search className="w-10 h-10 text-neutral-700" />
               </div>
               <div>
                 <h3 className="text-xl font-bold font-outfit text-white">No se encontraron objetos</h3>
                 <p className="text-neutral-500 font-light">Intenta con otra categoría o término de búsqueda.</p>
               </div>
            </div>
          )}
        </div>
      </main>

      <footer className="mt-20 border-t border-emerald-500/10 py-10 px-6">
         <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <Recycle className="w-6 h-6 text-emerald-500/50" />
              <span className="text-sm font-bold text-neutral-500">TruequeMX © 2024 - Veracruz & Poza Rica</span>
            </div>
            <div className="flex gap-6">
               <a href="#" className="text-xs font-bold text-neutral-500 hover:text-emerald-500 transition-colors uppercase tracking-widest">Privacidad</a>
               <a href="#" className="text-xs font-bold text-neutral-500 hover:text-emerald-500 transition-colors uppercase tracking-widest">Términos</a>
               <a href="#" className="text-xs font-bold text-neutral-500 hover:text-emerald-500 transition-colors uppercase tracking-widest">Contacto</a>
            </div>
         </div>
      </footer>

      {/* Publish Modal */}
      {showPublishModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-sm">
           <motion.div 
             initial={{ opacity: 0, scale: 0.9 }}
             animate={{ opacity: 1, scale: 1 }}
             className="glass max-w-lg w-full p-8 border-emerald-500/20"
           >
             <h2 className="text-2xl font-bold font-outfit mb-6">Nuevo Intercambio</h2>
             <form onSubmit={handlePublish} className="space-y-4">
               <div className="space-y-2">
                 <label className="text-xs font-bold text-emerald-500/70 border-emerald-500/20 uppercase tracking-widest pl-1">Título del Objeto</label>
                 <input 
                   required
                   value={itemTitle}
                   onChange={(e) => setItemTitle(e.target.value)}
                   type="text" 
                   placeholder="Ej. Cámara Vintage Nikon" 
                   className="w-full bg-neutral-900/50 border border-emerald-500/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-light"
                 />
               </div>
               
               <div className="space-y-2">
                 <label className="text-xs font-bold text-emerald-500/70 border-emerald-500/20 uppercase tracking-widest pl-1">Categoría</label>
                 <select 
                   value={itemCategory}
                   onChange={(e) => setItemCategory(e.target.value)}
                   className="w-full bg-neutral-900/50 border border-emerald-500/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-light"
                 >
                   {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
               </div>

               <div className="space-y-2">
                 <label className="text-xs font-bold text-emerald-500/70 border-emerald-500/20 uppercase tracking-widest pl-1">Imagen del Objeto</label>
                 <input 
                   type="file" 
                   accept="image/*"
                   onChange={(e) => setItemImage(e.target.files?.[0] || null)}
                   className="w-full bg-neutral-900/50 border border-emerald-500/10 rounded-2xl py-3 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-light"
                 />
               </div>

               <div className="flex gap-4 pt-4">
                 <button 
                   type="button"
                   onClick={() => setShowPublishModal(false)}
                   className="flex-1 py-4 glass hover:bg-red-500/10 text-white font-bold rounded-2xl transition-all"
                 >
                   Cancelar
                 </button>
                 <button 
                   type="submit"
                   disabled={isPublishing}
                   className="flex-1 py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-[#0a0a0a] font-bold rounded-2xl transition-all"
                 >
                   {isPublishing ? "Publicando..." : "Publicar"}
                 </button>
               </div>
             </form>
           </motion.div>
        </div>
      )}
    </div>
  );
}
