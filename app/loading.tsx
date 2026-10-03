'use client';
import { Loader2 } from "lucide-react";
import Image from "next/image";

export default function Loading() {
  return (
    <div className="fixed inset-0 z-[999] flex flex-col items-center justify-center bg-[#0a0a0a]">
      {/* Container Centralizado */}
      <div className="flex flex-col items-center gap-6">
        
        {/* Logo com pulso suave para indicar atividade */}
        <div className="relative animate-pulse">
          <Image 
            src="/logo.png" 
            alt="Logo" 
            width={80} 
            height={80} 
            className="opacity-50 rounded-full grayscale hover:grayscale-0 transition-all"
          />
          {/* Brilho vermelho de fundo para combinar com seu CSS */}
          <div className="absolute inset-0 bg-red-600/20 blur-3xl -z-10 rounded-full" />
        </div>

        {/* Spinner e Texto */}
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-red-600 animate-spin" />
          <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.4em] ml-1">
            Carregando
          </span>
        </div>
      </div>

      {/* Barra de progresso discreta no topo (opcional, estilo YouTube) */}
      <div className="absolute top-0 left-0 w-full h-[2px] bg-white/5 overflow-hidden">
        <div className="w-1/3 h-full bg-red-600 animate-[loading_2s_linear_infinite]" />
      </div>

      <style jsx>{`
        @keyframes loading {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(300%); }
        }
      `}</style>
    </div>
  );
}