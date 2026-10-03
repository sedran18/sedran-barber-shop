import { Dialog, DialogContent, DialogTrigger, DialogTitle, DialogHeader } from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Calendar as CalendarIcon, X } from "lucide-react";
import React, { useMemo, useState } from "react";
import { ptBR } from "date-fns/locale";

const Data = ({ setSelectedDate, selectedDate }: {
    selectedDate: Date | undefined,
    setSelectedDate: React.Dispatch<React.SetStateAction<Date>>
}) => {
    const [isCalendarOpen, setIsCalendarOpen] = useState(false);

    const today = useMemo(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    }, []);

    const threeWeeksLater = useMemo(() => {
        const d = new Date(today);
        d.setDate(today.getDate() + 21);
        return d;
    }, [today]);

    return (
        <Dialog open={isCalendarOpen} onOpenChange={setIsCalendarOpen}>
            <DialogTrigger asChild>
                <button
                    type="button"
                    className="w-full cursor-pointer flex items-center 
                            justify-between bg-white/5 border border-white/10 p-4 
                            rounded-2xl text-white gap-3 text-sm hover:bg-white/10 
                            hover:border-red-600/50 transition-all"
                >
                    <div className="flex flex-col items-start">
                        <span className="text-[10px] text-gray-500 uppercase font-bold tracking-widest">Data do Agendamento</span>
                        <span className=" tracking-tighter uppercase ">
                            {selectedDate ? selectedDate.toLocaleDateString('pt-BR') : 'Escolha a Data'}
                        </span>
                    </div>
                    <CalendarIcon size={18} className="text-red-600" />
                </button>
        </DialogTrigger>

            <DialogContent className="bg-[#0a0a0a] border-white/10 text-white max-w-[350px] rounded-3xl p-6">
                <DialogHeader className="items-center pb-4 border-b border-white/5 mb-4">
                    {/* Título com estilo da marca */}
                    <DialogTitle className="text-xs font-black uppercase tracking-[0.3em] text-red-600">
                        Calendário
                    </DialogTitle>
                    <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">SEDRAN Barber Shop</p>
                </DialogHeader>

                <div className="flex justify-center">
                    <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={(d) => {
                            if (d) {
                                d.setHours(0, 0, 0, 0);
                                setSelectedDate(d);
                                setIsCalendarOpen(false);
                            }
                        }}
                        locale={ptBR}
                        disabled={(date) => 
                            date.getDay() === 0 || 
                            date < today || 
                            date > threeWeeksLater
                        }
                        className="rounded-md border-none p-0"
                        classNames={{
                            day_selected: "bg-red-600 text-white hover:bg-red-700 focus:bg-red-600 rounded-lg",
                            day_today: "bg-white/10 text-red-500 font-bold rounded-lg",
                            day: "hover:bg-red-600/20 rounded-lg transition-all",
                            head_cell: "text-gray-500 uppercase font-black text-[10px]",
                        }}
                    />
                </div>
            </DialogContent>
        </Dialog>
    );
};

export default Data;