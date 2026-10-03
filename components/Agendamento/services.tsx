import { SerializedService } from "@/lib/types";
import { cn } from "@/lib/utils";
import {type Service } from "@prisma/client";

const Services = ({services, servicos, toggleServico} : {
        services: SerializedService [], 
        servicos:SerializedService [],
        toggleServico: (s: SerializedService ) => void
    }) => {
  return (
        <div className="space-y-3">
                <p className="text-xs text-gray-500 uppercase tracking-widest ml-1">Escolha os Serviços</p>
                <div className="grid grid-cols-3 gap-2">
                    {services.map((s) => (
                        <button
                            key={s.id}
                            type="button"
                            onClick={() => toggleServico(s)}
                            className={cn(
                                "py-3 cursor-pointer px-2 rounded-xl border text-[10px] font-bold uppercase transition-all",
                                servicos.some(ser => ser.name === s.name) ? "bg-red-600 border-red-600 text-white shadow-[0_0_15px_rgba(220,38,38,0.4)]" : "bg-white/5 border-white/10 text-gray-400 hover:border-white/20"
                            )}
                        >
                            {s.name}
                        </button>
                    ))}
                </div>
        </div>
  )
}

export default Services
