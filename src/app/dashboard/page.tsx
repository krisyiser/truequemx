"use client";

import { motion } from "framer-motion";
import { Search, Filter, Plus, MapPin, Recycle, ExternalLink, Heart } from "lucide-react";
import Link from "next/link";
import { useState } from "react";

const CATEGORIES = ["Hogar", "Herramientas", "Ropa", "Servicios", "Otros"];

export default function Dashboard() {
  const [selectedCategory, setSelectedCategory] = useState("Todos");

  const mockItems = [
    { id: 1, title: "Kit de Herramientas Bosch", category: "Herramientas", looking_for: "Pintura blanca", image: "https://lh3.googleusercontent.com/d/1", distance: "2.5 km", owner: "Juan P.", points: 85 },
    { id: 2, title: "Bicicleta de Montaña R26", category: "Otros", looking_for: "Taladro o Sierra", image: "https://lh3.googleusercontent.com/d/2", distance: "1.2 km", owner: "María G.", points: 120 },
    { id: 3, title: "Mesa de Madera Rústica", category: "Hogar", looking_for: "Sillas de comedor", image: "https://lh3.googleusercontent.com/d/3", distance: "4.8 km", owner: "Carlos R.", points: 45 },
    { id: 4, title: "Curso de Inglés Básico", category: "Servicios", looking_for: "Clases de Guitarra", image: "https://lh3.googleusercontent.com/d/4", distance: "0.5 km", owner: "Lucía S.", points: 210 },
  ];

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
              placeholder="¿Qué buscas intercambiar hoy?" 
              className="w-full bg-neutral-900/50 border border-emerald-500/10 rounded-2xl py-3 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-light"
            />
          </div>

          <div className="flex items-center gap-4">
             <button className="p-3 glass hover:bg-emerald-500/20 text-white rounded-2xl transition-all">
               <Heart className="w-6 h-6" />
             </button>
             <button className="px-6 py-3 bg-emerald-500 hover:bg-emerald-600 text-[#0a0a0a] font-bold rounded-2xl transition-all flex items-center gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)]">
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
          {mockItems.map((item, i) => (
            <motion.div 
              key={item.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.05 }}
              className="glass group hover:border-emerald-500/40 transition-all duration-300 flex flex-col h-full overflow-hidden"
            >
              <div className="relative aspect-square bg-emerald-500/5 group-hover:bg-emerald-500/10 transition-colors duration-500">
                {/* Fallback pattern for missing images */}
                <div className="absolute inset-0 flex items-center justify-center opacity-20">
                   <Recycle className="w-16 h-16 text-emerald-500" />
                </div>
                <div className="absolute top-3 left-3 px-3 py-1 glass bg-black/40 text-xs font-bold text-emerald-400 rounded-lg">
                  {item.category}
                </div>
                <div className="absolute bottom-3 right-3 px-3 py-1 glass bg-black/40 text-xs font-bold text-white rounded-lg flex items-center gap-1">
                  <MapPin className="w-3 h-3 text-emerald-500" />
                  {item.distance}
                </div>
              </div>

              <div className="p-5 flex flex-col flex-1 gap-3">
                <div className="flex justify-between items-start">
                  <h3 className="text-xl font-bold font-outfit leading-tight group-hover:text-emerald-400 transition-colors">{item.title}</h3>
                </div>
                
                <div className="flex flex-col gap-1">
                  <span className="text-[10px] uppercase tracking-widest text-emerald-500 font-bold">Busco a cambio:</span>
                  <p className="text-neutral-400 font-light text-sm line-clamp-2">{item.looking_for}</p>
                </div>

                <div className="mt-auto pt-4 border-t border-emerald-500/10 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-[10px] font-bold text-emerald-400">
                       {item.owner.split(' ')[0][0]}
                    </div>
                    <div className="flex flex-col">
                      <span className="text-xs font-bold text-white">{item.owner}</span>
                      <span className="text-[10px] text-emerald-500/70 font-semibold">{item.points} pts de confianza</span>
                    </div>
                  </div>
                  
                  <button 
                    onClick={() => window.open(`https://wa.me/522821234567?text=Hola, vi tu ${item.title} en TruequeMX y me interesa cambiarlo por...`, '_blank')}
                    className="p-2.5 glass hover:bg-emerald-500/30 text-emerald-400 rounded-xl transition-all"
                  >
                    <ExternalLink className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </main>
    </div>
  );
}
