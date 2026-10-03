'use client';

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useState } from 'react'
import { Eye, EyeOff, Lock, Loader2 } from 'lucide-react';
import { updateBarberFields } from "@/lib/actions/barber"; // Ajuste o caminho

const UpdatePassword = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    const newPassword = formData.get("newPassword") as string;
    const newConfirmPassword = formData.get("newConfirmPassword") as string;

    // 1. Validação básica no client
    if (newPassword !== newConfirmPassword) {
      alert("As novas senhas não coincidem!");
      return;
    }

    if (newPassword.length < 8) {
      alert("A nova senha deve ter pelo menos 8 caracteres.");
      return;
    }

    // 2. Pedir senha antiga por segurança
    const oldPassword = prompt("Para alterar sua senha, confirme a senha atual:");

    if (!oldPassword) {
      alert("Confirmação de senha é obrigatória.");
      return;
    }

    try {
      setIsPending(true);

      // 3. Chamar a Action (mantendo nome e email como string vazia para não alterar)
      const result = await updateBarberFields({
        newName: "", 
        newEmail: "",
        oldPassword,
        newPassword,
        newConfirmPassword
      });

      if (result.success) {
        alert("Senha alterada com sucesso!");
        (event.target as HTMLFormElement).reset(); // Limpa os campos
      } else {
        alert(result.error || "Erro ao atualizar senha.");
      }
    } catch (error) {
      alert("Erro na comunicação com o servidor.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 transition-all hover:border-white/20">
      <h2 className="text-white font-bold uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
        <Lock size={16} className="text-red-600" /> Alterar Senha
      </h2>
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NOVA SENHA */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Nova Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <Input 
                name="newPassword"
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required
                className="bg-[#121212] border-white/10 pl-10 text-white focus:border-red-600 h-12 rounded-xl" 
              />
              <button 
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-white"
              >
                {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          {/* CONFIRMAR SENHA */}
          <div className="space-y-2 text-left">
            <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Confirmar Senha</label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
              <Input 
                name="newConfirmPassword"
                type={showPassword ? "text" : "password"} 
                placeholder="••••••••" 
                required
                className="bg-[#121212] border-white/10 pl-10 text-white focus:border-red-600 h-12 rounded-xl" 
              />
            </div>
          </div>
        </div>

        <div className="pt-2 text-right">
          <Button 
            type="submit"
            disabled={isPending}
            className="cursor-pointer bg-red-600 hover:bg-red-700 text-white font-bold uppercase text-[10px] px-8 rounded-xl h-12 gap-2 shadow-lg shadow-red-600/10 disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              "Atualizar Senha"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

export default UpdatePassword;