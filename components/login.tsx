"use client";

import { useState } from "react";
import Image from "next/image";
import { Mail, Lock, Eye, EyeOff, LogIn, ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Link from "next/link";
import { signIn } from "next-auth/react";

const LoginForm = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState(false)
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    if (!email  || !password) return setErro(true);

    try {
      const result = await signIn("credentials", {
        email,
        password,
        redirect: false,
      });

      if (result?.error) {
        setErro(true);
        return;
      }

      window.location.href = "/admin/dashboard";
    } catch (err) {
      console.log(err);
      setErro(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#0A0A0A] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-600/10 blur-[120px] rounded-full pointer-events-none" />

      <Link 
        href="/" 
        className="z-30 absolute top-8 left-3 text-gray-500 hover:text-white flex items-center gap-2 text-xs font-bold uppercase transition-all group"
      >
        <ChevronLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
        Voltar
      </Link>

      <div className="w-full max-w-md z-10">
        <div className="flex flex-col items-center mb-3">
          <div className="p-3 bg-white/5 rounded-full border border-white/10 mb-6 shadow-2xl">
            <Image src="/logo.png" alt="Logo SEDRAN" width={80} height={80} priority />
          </div>
          <h1 className="text-2xl font-black text-white tracking-tighter uppercase italic">
            Acesso <span className="text-red-600">Restrito</span>
          </h1>
        </div>

        <div className="bg-white/5 border border-white/10 p-5 py-8  rounded-[2.5rem] shadow-2xl backdrop-blur-sm">
            {erro && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                <div className="h-2 w-2 rounded-full bg-red-600 animate-pulse" />
                <p className="text-red-500 text-xs font-bold uppercase tracking-widest">
                  Credenciais Inválidas
                </p>
              </div>
            )}

          <form className="space-y-6" onSubmit={handleSubmit}>
            
            <div className="space-y-2">
              <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest ml-1">E-mail Profissional</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-600 transition-colors" size={18} />
                <Input 
                  type="email" 
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="sedran@gmail.com" 
                  className="bg-white/5 border-white/10 pl-12 h-14 text-white rounded-2xl focus:border-red-600 transition-all outline-none"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center ml-1">
                <label className="text-[10px] uppercase font-black text-gray-500 tracking-widest">Sua Senha</label>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-600 group-focus-within:text-red-600 transition-colors" size={18} />
                <Input 
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"} 
                  placeholder="••••••••" 
                  className="bg-white/5 border-white/10 pl-12 pr-12 h-14 text-white rounded-2xl focus:border-red-600 transition-all outline-none"
                  required
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <Button 
              type="submit" 
              disabled={isLoading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-black py-7 rounded-2xl uppercase tracking-[0.2em] shadow-xl shadow-red-600/20 active:scale-95 transition-all flex gap-3"
            >
              {isLoading ? (
                <div className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn size={18} />
                  Entrar no Sistema
                </>
              )}
            </Button>
          </form>
        </div>

        {/* Footer */}
        <p className="mt-8 text-center text-gray-600 text-[10px] uppercase tracking-widest leading-loose">
          Desenvolvido por <span className="text-white font-bold">SEDRAN</span> <br />
          © 2026 SEDRAN Barber Shop • Todos os direitos reservados.
        </p>
      </div>
    </div>
  );
};

export default LoginForm;