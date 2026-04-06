"use client";

import { motion } from "framer-motion";
import { Mail, Lock, LogIn, UserPlus, Recycle } from "lucide-react";
import Link from "next/link";
import React, { useState } from "react";
import { createClient } from "@/utils/supabase/client";
import { useRouter } from "next/navigation";

export default function Login() {
  const supabase = createClient();
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      if (isLogin) {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });
        if (error) throw error;

        // Force a full page reload to ensure middleware picks up the new session cookies
        // router.push alone doesn't trigger middleware revalidation in all cases
        router.refresh();
        window.location.href = "/dashboard";
      } else {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/auth/callback`,
          },
        });
        if (error) throw error;

        // Check if email confirmation is required
        if (data.user && !data.session) {
          setSuccessMessage(
            "¡Registro exitoso! Revisa tu correo electrónico para confirmar tu cuenta antes de iniciar sesión."
          );
        } else if (data.session) {
          // Auto-confirmed (e.g., email confirmations disabled in Supabase)
          router.refresh();
          window.location.href = "/dashboard";
        }
      }
    } catch (err: any) {
      // Translate common Supabase error messages to Spanish
      const msg = err.message || "Ocurrió un error inesperado";
      if (msg.includes("Invalid login credentials")) {
        setError("Credenciales incorrectas. Verifica tu correo y contraseña.");
      } else if (msg.includes("Email not confirmed")) {
        setError(
          "Tu correo no ha sido confirmado. Revisa tu bandeja de entrada."
        );
      } else if (msg.includes("User already registered")) {
        setError(
          "Este correo ya está registrado. Intenta iniciar sesión."
        );
      } else {
        setError(msg);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-[#0a0a0a]">
      {/* Background Decor */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass max-w-md w-full p-8 md:p-12 relative z-10"
      >
        <div className="flex flex-col items-center gap-4 mb-8">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 flex items-center justify-center border border-emerald-500/20">
            <Recycle className="w-8 h-8 text-emerald-400" />
          </div>
          <div className="text-center">
            <h1 className="text-3xl font-black font-outfit uppercase tracking-tight">
              TruequeMX
            </h1>
            <p className="text-neutral-500 text-sm font-light uppercase tracking-widest mt-1">
              {isLogin ? "Bienvenido de nuevo" : "Crea tu cuenta local"}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-emerald-400 transition-colors" />
              <input
                id="email-input"
                required
                type="email"
                placeholder="Tu correo electrónico"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-neutral-950/50 border border-emerald-500/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-light"
              />
            </div>

            <div className="relative group">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-emerald-400 transition-colors" />
              <input
                id="password-input"
                required
                type="password"
                placeholder="Tu contraseña (mínimo 6 caracteres)"
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-neutral-950/50 border border-emerald-500/10 rounded-2xl py-4 pl-12 pr-4 text-white focus:outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all font-light"
              />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm font-medium"
            >
              {error}
            </motion.div>
          )}

          {successMessage && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium"
            >
              {successMessage}
            </motion.div>
          )}

          <button
            id="auth-submit-button"
            disabled={loading}
            className="w-full py-4 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-50 text-[#0a0a0a] font-bold rounded-2xl transition-all shadow-[0_0_20px_rgba(16,185,129,0.2)] flex items-center justify-center gap-2"
          >
            {loading
              ? "Procesando..."
              : isLogin
              ? "Iniciar Sesión"
              : "Crear Cuenta"}
            {isLogin ? (
              <LogIn className="w-5 h-5" />
            ) : (
              <UserPlus className="w-5 h-5" />
            )}
          </button>
        </form>

        <div className="mt-8 pt-8 border-t border-emerald-500/5 text-center">
          <button
            id="toggle-auth-mode"
            onClick={() => {
              setIsLogin(!isLogin);
              setError(null);
              setSuccessMessage(null);
            }}
            className="text-neutral-500 hover:text-emerald-400 transition-colors text-sm font-medium"
          >
            {isLogin
              ? "¿No tienes cuenta? Regístrate aquí"
              : "¿Ya tienes cuenta? Inicia sesión"}
          </button>
        </div>

        <div className="mt-6">
          <Link
            href="/"
            className="text-[10px] uppercase tracking-[0.2em] text-neutral-600 hover:text-white transition-colors block text-center"
          >
            Volver al inicio
          </Link>
        </div>
      </motion.div>
    </main>
  );
}
