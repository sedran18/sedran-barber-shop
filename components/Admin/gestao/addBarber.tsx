'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog";
import { UserPlus, Clock, Calendar as CalendarIcon, Lock, Loader2 } from "lucide-react";
import React, { useState } from "react";
import { cn } from "@/lib/utils";
import { RegisterFormType } from "@/lib/types";
import { registerAction } from "@/lib/actions/register";

const DIAS_SEMANA = [
  { id: 1, label: "Seg" },
  { id: 2, label: "Ter" },
  { id: 3, label: "Qua" },
  { id: 4, label: "Qui" },
  { id: 5, label: "Sex" },
  { id: 6, label: "Sáb" },
  { id: 0, label: "Dom" },
] as const;

const AddBarber = ({ isAdding, setIsAdding }: {
  setIsAdding: React.Dispatch<React.SetStateAction<boolean>>
  isAdding: boolean,
}) => {
  const [selectedDays, setSelectedDays] = useState<Array<0 | 1| 2 | 3| 4| 5| 6>>([]);
  const [isPending, setIsPending] = useState(false);
  
  async function handleSubmit(formData: FormData) {
    setIsPending(true);
    
    const data: RegisterFormType = {
      name: formData.get("name") as string,
      email: formData.get("email") as string,
      password: formData.get("password") as string,
      confirmPassword: formData.get("confirmPassword") as string,
      startTime: formData.get("startTime") as string,
      endTime: formData.get("endTime") as string,
      daysOfWeek: selectedDays,
      role: 'EMPLOYEE'
    };

    const result = await registerAction(data);
    
    if (result.success) {
      setIsAdding(false);
      setSelectedDays([]);
    } else {
      alert(result.error);
    }
    setIsPending(false);
  }

  const toggleDay = (dayId: 0 | 1| 2 | 3| 4| 5| 6) => {
    setSelectedDays(prev => 
      prev.includes(dayId) ? prev.filter(id => id !== dayId) : [...prev, dayId]
    );
  };

  return (
    <Dialog open={isAdding} onOpenChange={setIsAdding}>
      <DialogTrigger asChild>
        <Button className="bg-red-600 cursor-pointer hover:bg-red-700 text-white rounded-xl h-12 px-6 flex gap-2 uppercase font-bold text-xs tracking-widest shadow-lg shadow-red-600/20 transition-all active:scale-95">
          <UserPlus size={18} />
          Adicionar Barbeiro
        </Button>
      </DialogTrigger>
      
      <DialogContent className="bg-[#121212] border-white/10 text-white max-w-md overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-red-600 uppercase font-black text-xl">Novo Funcionário</DialogTitle>
          <DialogDescription className="text-gray-500 text-xs">
            Cadastre o barbeiro e defina sua escala de trabalho inicial.
          </DialogDescription>
        </DialogHeader>

        <form action={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-4">
            <h4 className="text-[10px] uppercase font-black text-red-600/50 tracking-[0.2em] border-b border-white/5 pb-2 text-left">Identificação</h4>
            <div className="space-y-2 text-left">
              <label className="text-[10px] uppercase font-bold text-gray-400">Nome Completo</label>
              <Input name="name" required placeholder="Ex: Gabriel Nardes" className="bg-white/5 border-white/10 text-white h-12 focus:border-red-600 transition-colors" />
            </div>
            <div className="space-y-2 text-left">
              <label className="text-[10px] uppercase font-bold text-gray-400">E-mail de Acesso</label>
              <Input name="email" type="email" required placeholder="exemplo@sedran.com" className="bg-white/5 border-white/10 text-white h-12 focus:border-red-600 transition-colors" />
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] uppercase font-black text-red-600/50 tracking-[0.2em] border-b border-white/5 pb-2 flex items-center gap-2 text-left">
              <Lock size={12} /> Segurança
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 text-left">
                <label className="text-[10px] uppercase font-bold text-gray-400">Senha</label>
                <Input name="password" type="password" required placeholder="******" className="bg-white/5 border-white/10 text-white h-12 focus:border-red-600 transition-colors" />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[10px] uppercase font-bold text-gray-400">Confirmar</label>
                <Input name="confirmPassword" type="password" required placeholder="******" className="bg-white/5 border-white/10 text-white h-12 focus:border-red-600 transition-colors" />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] uppercase font-black text-red-600/50 tracking-[0.2em] border-b border-white/5 pb-2 flex items-center gap-2 text-left">
              <CalendarIcon size={12} /> Escala Semanal
            </h4>
            <div className="flex flex-wrap gap-2">
              {DIAS_SEMANA.map((dia) => (
                <button
                  key={dia.id}
                  type="button"
                  onClick={() => toggleDay(dia.id)}
                  className={cn(
                    "flex-1 min-w-[45px] py-2 rounded-lg border text-[10px] font-bold uppercase transition-all",
                    selectedDays.includes(dia.id) 
                      ? "bg-red-600 border-red-600 text-white shadow-md shadow-red-600/20" 
                      : "bg-white/5 border-white/10 text-gray-500 hover:border-white/30"
                  )}
                >
                  {dia.label}
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-4">
            <h4 className="text-[10px] uppercase font-black text-red-600/50 tracking-[0.2em] border-b border-white/5 pb-2 flex items-center gap-2 text-left">
              <Clock size={12} /> Turno
            </h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2 text-left">
                <label className="text-[10px] uppercase font-bold text-gray-500">Início</label>
                <Input name="startTime" type="time" defaultValue="09:00" className="bg-white/5 border-white/10 text-white h-12" />
              </div>
              <div className="space-y-2 text-left">
                <label className="text-[10px] uppercase font-bold text-gray-500">Término</label>
                <Input name="endTime" type="time" defaultValue="19:00" className="bg-white/5 border-white/10 text-white h-12" />
              </div>
            </div>
          </div>

          <div className="pt-4">
            <Button 
              type="submit" 
              disabled={isPending}
              className="w-full cursor-pointer bg-red-600 hover:bg-red-700 text-white font-black uppercase py-7 rounded-2xl shadow-xl shadow-red-600/10 flex items-center justify-center transition-all hover:-translate-y-1 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="animate-spin" />
              ) : (
                "Finalizar Cadastro"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default AddBarber;