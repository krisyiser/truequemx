"use client";

import { motion } from "framer-motion";
import { Mail, Lock, LogIn, UserPlus, Recycle } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Login() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;
        router.push("/dashboard");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
              username: email.split("@")[0],
            },
          },
        });
        if (error) throw error;
        alert("¡Registro exitoso! Ya puedes iniciar sesión.");
        setIsLogin(true);
      }
    } catch (err: any) {
      setError(err.message || "Ocurrió un error inesperado.");
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center px-6 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -ms-[50%] w-full max-w-[1000px] h-96 bg-emerald-500/10 blur-[150px] rounded-full pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md glass p-8 border-emerald-500/20 relative z-10"
      >
        <div className="flex flex-col items-center gap-4 mb-10">
          <Link href="/" className="flex items-center gap-2 group">
            <Recycle className="w-10 h-10 text-emerald-500 group-hover:rotate-180 transition-transform duration-700" />
            <span className="text-3xl font-black font-outfit tracking-tight">Trueque<span className="text-emerald-500">MX</span></span>
          </Link>
          <div className="text-center">
            <h2 className="text-2xl font-bold font-outfit text-white">
              {isLogin ? "¡Hola de nuevo!" : "Crea tu cuenta"}
            </h2>
            <p className="text-sm text-neutral-500 font-light mt-1">
              {isLogin ? "Accede para seguir intercambiando." : "Únete a la economía circular de Veracruz."}
            </p>
          </div>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 rounded-xl bg-red-500/20 border border-red-500/30 text-red-300 text-sm font-medium animate-shake">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-500/70 border-emerald-500/20 uppercase tracking-widest pl-1">Email</label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input 
                type="email" 
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com" 
                className="w-full bg-neutral-900/50 border border-emerald-500/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-light"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-emerald-500/70 border-emerald-500/20 uppercase tracking-widest pl-1">Contraseña</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
              <input 
                type="password" 
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••" 
                className="w-full bg-neutral-900/50 border border-emerald-500/10 rounded-2xl py-3.5 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-light"
              />
            </div>
          </div>

          {!isLogin && (
             <div className="space-y-2">
               <label className="text-xs font-bold text-emerald-500/70 border-emerald-500/20 uppercase tracking-widest pl-1">Nombre Completo</label>
               <input 
                 type="text" 
                 required
                 value={fullName}
                 onChange={(e) => setFullName(e.target.value)}
                 placeholder="Ej. Juan Pérez" 
                 className="w-full bg-neutral-900/50 border border-emerald-500/10 rounded-2xl py-3.5 px-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-light"
               />
             </div>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-[#0a0a0a] font-bold rounded-2xl py-4 transition-all shadow-[0_0_25px_rgba(16,185,129,0.25)] hover:scale-[1.02] active:scale-[0.98] mt-6 flex items-center justify-center gap-2"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-[#0a0a0a]/30 border-t-[#0a0a0a] rounded-full animate-spin" />
            ) : (
              <>
                {isLogin ? <LogIn className="w-5 h-5" /> : <UserPlus className="w-5 h-5" />}
                {isLogin ? "Iniciar Sesión" : "Registrarse"}
              </>
            )}
          </button>
        </form>

        <div className="mt-8 text-center">
          <button 
            onClick={() => setIsLogin(!isLogin)}
            className="text-neutral-400 text-sm font-medium hover:text-emerald-500 transition-colors"
          >
            {isLogin ? "¿No tienes cuenta? Registrate aquí" : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
