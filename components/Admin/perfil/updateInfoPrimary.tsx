'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Mail, Save, User, Loader2 } from "lucide-react";
import { updateBarberFields } from "@/lib/actions/barber"; 
import { useState } from "react";

const UpdateInfoPrimary = ({email, name}: {email: string, name:  string}) => {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    
    const formData = new FormData(event.currentTarget);
    const newName = formData.get("newName") as string;
    const newEmail = formData.get("newEmail") as string;

    const oldPassword = prompt("Para salvar as alterações, digite sua senha atual:");

    if (!oldPassword) {
      alert("A senha atual é obrigatória para salvar as alterações.");
      return;
    }

    try {
      setIsPending(true);

      const result = await updateBarberFields({
        newName,
        newEmail,
        oldPassword,
        newPassword: "", 
        newConfirmPassword: ""
      });

      if (result.success) {
        alert("Perfil atualizado com sucesso!");
      } else {
        alert(result.error || "Ocorreu um erro ao atualizar.");
      }
    } catch (error) {
      alert("Erro de conexão com o servidor.");
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-8 transition-all hover:border-white/20">
      <h2 className="text-white font-bold uppercase text-xs tracking-widest mb-6 flex items-center gap-2">
        <User size={16} className="text-red-600" /> Informações Básicas
      </h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* NOME */}
        <div className="space-y-2 text-left">
          <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">Nome de Exibição</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <Input 
              name="newName"
              defaultValue={name} 
              required
              className="bg-[#121212] border-white/10 pl-10 text-white focus:border-red-600 h-12 rounded-xl" 
            />
          </div>
        </div>

        {/* EMAIL */}
        <div className="space-y-2 text-left">
          <label className="text-[10px] uppercase font-bold text-gray-500 ml-1">E-mail</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-600" size={16} />
            <Input 
              name="newEmail"
              type="email"
              defaultValue={email} 
              required
              className="bg-[#121212] border-white/10 pl-10 text-white focus:border-red-600 h-12 rounded-xl" 
            />
          </div>
        </div>

        <div className="md:col-span-2 pt-2 text-right">
          <Button 
            type="submit"
            disabled={isPending}
            className="bg-red-600 cursor-pointer hover:bg-red-700 text-white font-bold uppercase text-[10px] px-8 rounded-xl h-12 gap-2 shadow-lg shadow-red-600/10 disabled:opacity-50"
          >
            {isPending ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <>
                <Save size={16} /> Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default UpdateInfoPrimary;