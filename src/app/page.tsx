"use client";

import { motion } from "framer-motion";
import { ArrowRight, Recycle, ShieldCheck, MapPin } from "lucide-react";
import Link from "next/link";

export default function Home() {
  return (
    <main className="relative flex flex-col items-center justify-center px-6 pt-24 pb-12 overflow-hidden">
      <div className="absolute top-0 left-1/2 -ms-[50%] w-full max-w-[1200px] h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="flex flex-col items-center gap-6 text-center max-w-4xl"
      >
        <div className="px-4 py-1.5 rounded-full glass flex items-center gap-2 border-emerald-500/20">
          <Recycle className="w-4 h-4 text-emerald-400" />
          <span className="text-emerald-400 text-sm font-medium tracking-wide font-outfit uppercase">
            Economía Circular Local
          </span>
        </div>
        
        <h1 className="text-6xl md:text-8xl font-black tracking-tight leading-[1.05] font-outfit">
           TruequeMX <br />
          <span className="emerald-text-gradient">Veracruz & Poza Rica</span>
        </h1>
        
        <p className="max-w-2xl text-lg md:text-xl text-neutral-400 font-light leading-relaxed">
          Intercambia lo que ya no usas por lo que necesitas. Únete a la red de trueque más grande del estado y ayuda a construir un futuro sostenible.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 mt-8">
          <Link href="/login">
            <button className="px-8 py-4 bg-emerald-500 hover:bg-emerald-600 text-[#0a0a0a] font-bold rounded-2xl shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-all hover:scale-105 active:scale-95 flex items-center gap-2">
              Empezar ahora
              <ArrowRight className="w-5 h-5" />
            </button>
          </Link>
          <Link href="/dashboard">
            <button className="px-8 py-4 glass hover:bg-emerald-500/10 text-white font-semibold rounded-2xl transition-all flex items-center gap-2">
              Explorar objetos
            </button>
          </Link>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32 w-full max-w-6xl">
        {[
          { icon: <ShieldCheck className="w-8 h-8 text-emerald-400" />, title: "Seguro y Confiable", desc: "Sistema de puntos de confianza basado en intercambios exitosos." },
          { icon: <MapPin className="w-8 h-8 text-emerald-400" />, title: "100% Local", desc: "Encuentra personas cerca de ti en Veracruz, Poza Rica y Papantla." },
          { icon: <Recycle className="w-8 h-8 text-emerald-400" />, title: "Zero Desperdicio", desc: "Promueve la sostenibilidad dando una segunda vida a tus objetos." }
        ].map((feat, i) => (
          <motion.div 
            key={i}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + i * 0.1, duration: 0.6 }}
            className="p-8 glass group hover:border-emerald-500/30 transition-all duration-500 cursor-default"
          >
            <div className="mb-4 transform group-hover:scale-110 transition-transform duration-300">
              {feat.icon}
            </div>
            <h3 className="text-xl font-bold font-outfit mb-2">{feat.title}</h3>
            <p className="text-neutral-500 leading-relaxed font-light">{feat.desc}</p>
          </motion.div>
        ))}
      </div>
    </main>
  );
}
