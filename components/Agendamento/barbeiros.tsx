import { cn } from "@/lib/utils";
import { User } from "lucide-react";
import React from "react";
import {type  Barber } from "@prisma/client";
const Barbeiros = ({barber, setBarber, cabeleleiros} :{
    barber: Barber | null, 
    cabeleleiros: Barber[] 
    setBarber: React.Dispatch<React.SetStateAction<Barber | null>>
}) => {
  return (
<div className="space-y-3">
        <p className="text-xs text-gray-500 uppercase tracking-widest ml-1">Profissional</p>
            <div className="grid grid-cols-2 gap-4">
                {cabeleleiros.map(c => (
                        <button 
                            key={c.id}
                            type="button"
                            onClick={() => setBarber(c)}
                            className={cn(
                                "cursor-pointer",
                                "flex items-center gap-2 p-2 rounded-xl border transition-all",
                                barber?.name === c.name ? "bg-red-600/10 border-red-600 text-white" : "bg-white/5 border-white/10 text-gray-400"
                            )}
                        >
                            <div className={cn("p-2 rounded-full", barber?.name === c.name ? "bg-red-600 text-white" : "bg-white/10")}>
                                <User size={20} />
                            </div>
                            <span className="font-bold text-sm uppercase">{c.name}</span>
                        </button>
                    ))}
                </div>
            </div>
  )
}

export default Barbeiros
