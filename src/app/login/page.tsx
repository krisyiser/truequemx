"use client";

import React, { useState, useTransition } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Lock,
  ArrowRight,
  User,
  Recycle,
  AlertCircle,
  CheckCircle2,
  Loader2,
  ChevronLeft,
} from "lucide-react";
import Link from "next/link";
import { login, signup } from "./actions";

export default function LoginPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    const formData = new FormData(event.currentTarget);
    
    startTransition(async () => {
      const result = isLogin ? await login(formData) : await signup(formData);
      
      if (result && 'error' in result && result.error) {
        setError(result.error);
      } else if (result && 'success' in result && result.success) {
        setSuccess(result.success);
      }
    });
  }

  return (
    <div className="min-h-screen w-full flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Aurora Background */}
      <div className="aurora" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "outfit" }}
        className="w-full max-w-[450px] relative z-10"
      >
        {/* Back Link */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-neutral-500 hover:text-white transition-colors mb-8 group"
        >
          <div className="w-8 h-8 rounded-full border border-white/5 flex items-center justify-center bg-white/5 group-hover:border-emerald-500/50 group-hover:text-emerald-400 transition-all">
            <ChevronLeft size={18} />
          </div>
          <span className="text-sm font-medium tracking-wide">Volver al inicio</span>
        </Link>

        <div className="glass-card p-8 md:p-10">
          {/* Logo Section */}
          <div className="flex flex-col items-center text-center mb-10">
            <motion.div
              initial={{ scale: 0.8, rotate: -10 }}
              animate={{ scale: 1, rotate: 0 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-700 flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-6"
            >
              <Recycle className="text-white w-8 h-8" />
            </motion.div>
            <h1 className="text-4xl font-black tracking-tight text-white font-outfit mb-2">
              Trueque<span className="text-emerald-500">MX</span>
            </h1>
            <p className="text-neutral-400 font-medium">
              {isLogin ? "Tu puerta a la economía circular" : "Comienza tu viaje sustentable"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            <AnimatePresence mode="wait">
              {!isLogin && (
                <motion.div
                  key="full-name"
                  initial={{ opacity: 0, height: 0, marginBottom: 0 }}
                  animate={{ opacity: 1, height: "auto", marginBottom: 20 }}
                  exit={{ opacity: 0, height: 0, marginBottom: 0 }}
                  className="relative overflow-hidden"
                >
                  <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1 mb-2 block">
                    Nombre Completo
                  </label>
                  <div className="relative group">
                    <User className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                    <input
                      name="full_name"
                      type="text"
                      required={!isLogin}
                      placeholder="Ej. Juan Pérez"
                      className="premium-input pl-14"
                    />
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div>
              <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1 mb-2 block">
                Correo Electrónico
              </label>
              <div className="relative group">
                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="nombre@ejemplo.com"
                  className="premium-input pl-14"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-end mb-2">
                <label className="text-xs font-bold text-neutral-500 uppercase tracking-widest ml-1 block">
                  Contraseña
                </label>
                {isLogin && (
                  <button type="button" className="text-[10px] uppercase font-bold tracking-tighter text-emerald-500/70 hover:text-emerald-400 transition-colors">
                    ¿Olvidaste tu contraseña?
                  </button>
                )}
              </div>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-neutral-500 group-focus-within:text-emerald-500 transition-colors" size={20} />
                <input
                  name="password"
                  type="password"
                  required
                  minLength={6}
                  placeholder="••••••••"
                  className="premium-input pl-14"
                />
              </div>
            </div>

            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-2xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-100 text-sm font-medium"
                >
                  <AlertCircle className="shrink-0 text-red-500" size={18} />
                  {error}
                </motion.div>
              )}
              {success && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 flex items-center gap-3 text-emerald-50 text-sm font-medium"
                >
                  <CheckCircle2 className="shrink-0 text-emerald-500" size={18} />
                  {success}
                </motion.div>
              )}
            </AnimatePresence>

            <button
              type="submit"
              disabled={isPending}
              className="premium-button w-full bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-600/20 flex items-center justify-center gap-3 group mt-4"
            >
              {isPending ? (
                <Loader2 className="animate-spin" size={20} />
              ) : (
                <>
                  <span className="text-lg">{isLogin ? "Iniciar Sesión" : "Crear Cuenta"}</span>
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Toggle Button */}
          <div className="mt-10 pt-8 border-t border-white/5 text-center">
            <p className="text-neutral-400 text-sm font-medium">
              {isLogin ? "¿No tienes una cuenta aún?" : "¿Ya eres parte de la red?"}
            </p>
            <button
              onClick={() => {
                setIsLogin(!isLogin);
                setError(null);
                setSuccess(null);
              }}
              className="mt-2 text-emerald-400 hover:text-emerald-300 font-bold tracking-tight transition-all active:scale-95"
            >
              {isLogin ? "Crea una cuenta ahora" : "Inicia sesión con tu cuenta"}
            </button>
          </div>
        </div>

        {/* Footer Info */}
        <p className="mt-8 text-center text-neutral-600 text-[10px] uppercase tracking-[0.3em] font-bold">
          © 2026 TruequeMX • Veracruz • México
        </p>
      </motion.div>
    </div>
  );
}
