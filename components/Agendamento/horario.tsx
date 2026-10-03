import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogClose } from "@/components/ui/dialog";
import {  Clock} from 'lucide-react';
import React from "react";
import { cn } from "@/lib/utils";

const Horario = ({horarios, selectedTime,setSelectedTime} : {
    horarios: string[], 
    selectedTime: string,
    setSelectedTime: React.Dispatch<React.SetStateAction<string>>
}) => {
    
    return (
            <Dialog>
                    <DialogTrigger asChild>
                        <button 
                            type="button" 
                            className="cursor-pointer flex items-center justify-center 
                            bg-white/5 border border-white/10 w-full p-4 px-10 md:px-15 rounded-xl 
                            text-white text-sm gap-3 hover:bg-white/10 transition-all">
                            <span>{selectedTime || 'HORÁRIO'}</span>
                            <Clock size={18} className="text-red-600" />
                        </button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#121212] border-white/10 text-white">
                        <DialogHeader><DialogTitle className="text-white uppercase tracking-widest">Horários Disponíveis</DialogTitle></DialogHeader>
                        <div className="grid grid-cols-3 gap-2 p-4">
                            {horarios.map(h => (
                                <DialogClose key={h} asChild>
                                    <button 
                                        onClick={() => setSelectedTime(h)}
                                        className={cn(
                                            "py-2 rounded-lg border transition-all text-sm font-medium",
                                            selectedTime === h ? "bg-red-600 border-red-600" : "bg-white/5 border-white/10 hover:border-red-600"
                                        )}
                                    >
                                        {h}
                                    </button>
                                </DialogClose>
                            ))}
                        </div>
                    </DialogContent>
            </Dialog>
  )
}

export default Horario
