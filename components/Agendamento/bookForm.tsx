"use client";

import { useState, useMemo, useEffect, useTransition } from "react";
import Image from "next/image";
import {CalendarClock, CheckCircle2, Crown, Loader2, UserCircle } from 'lucide-react';
import { cn, formatBRL} from "@/lib/utils";
import Services from "./services";
import Data from "./data";
import Horario from "./horario";
import Barbeiros from "./barbeiros";
import Link from 'next/link';
import { getHoursAvailableByDate } from "@/lib/actions/appointment";
import { getAvailableBarbers } from "@/lib/actions/barber";
import { type Barber } from "@prisma/client";
import { toast } from "sonner";
import { handleBooking } from "@/lib/actions/payment";
import { AgendamentoForm, SerializedService } from "@/lib/types";
import { combineDateAndTime } from "@/lib/utils";
import { PixModal } from "./pixModal";

const BookForm = ({ isAdmin, services }: { isAdmin: boolean, services: SerializedService[] }) => {
    const [name, setName] = useState("");
    const [servicos, setServicos] = useState<SerializedService []>([]);
    const [selectedDate, setSelectedDate] = useState<Date>(() => {
        const d = new Date();
        d.setHours(0, 0, 0, 0);
        return d;
    });
    const [selectedTime, setSelectedTime] = useState("");
    const [horarios, setHorarios] = useState<string[]>([]);
    const [barber, setBarber] = useState<Barber | null>(null);
    const [cabeleleiros, setCabeleleiros] = useState<Barber[]>([]);
    
    const [isPending, startTransition] = useTransition();
    const [isLoadingHours, setIsLoadingHours] = useState(false);
    const [isLoadingBarbers, setIsLoadingBarbers] = useState(false);
    const [pixData, setPixData] = useState<{
        qrCode: string, 
        qrCodeBase64: string, 
        appointmentId: string, 
        token: string
    } | null>(null);

    const [showPix, setShowPix] = useState(false);

    const isFormValid = name.length > 2 && servicos.length > 0 && selectedTime && barber;

    const valorTotal = useMemo(() => {
        return  servicos?.reduce((acc: number, s:SerializedService ) => acc + s.price, 0)
    }, [servicos]);

    const toggleServico = (s: SerializedService ) => {
            setServicos((prev = []) => {
                const isSelected = prev.some((ser) => ser.id === s.id);
                const isSobrancelha = s.name.toLowerCase().includes('sobrancelha');

                if (!isSelected) {
                    if (isSobrancelha && prev.length === 0) {
                        toast.error("Escolha outro serviço primeiro", {position: 'top-right'})
                        return prev;
                    }
                    return [...prev, s];
                } 
                
                else {
                    const novaLista = prev.filter((ser) => ser.id !== s.id);

                    const sobrouApenasSobrancelha = novaLista.length === 1 && 
                        novaLista[0].name.toLowerCase().includes('sobrancelha');

                    if (sobrouApenasSobrancelha) {
                        return []; 
                    }

                    return novaLista;
                }
            });
        };

    useEffect(() => {
        const fetchBarbers = async () => {
            if (!selectedDate) return;
            
            setIsLoadingBarbers(true);
            setBarber(null);      // Limpa barbeiro anterior
            setSelectedTime("");   // Limpa hora anterior
            setHorarios([]);       // Limpa lista de horas
            
            const barbeiros = await getAvailableBarbers({ date: selectedDate });
            setCabeleleiros(barbeiros);
            setIsLoadingBarbers(false);
        };
        fetchBarbers();
    }, [selectedDate]);

    useEffect(() => {
        const fetchHours = async () => {
            if (!selectedDate || !barber) {
                setHorarios([]);
                return;
            }
            setIsLoadingHours(true);
            setSelectedTime(""); 
            
            const hours = await getHoursAvailableByDate({ 
                date: selectedDate, 
                barberId: barber.id 
            });
            setHorarios(hours);
            setIsLoadingHours(false);
        };
        fetchHours();
    }, [selectedDate, barber]);


const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!isFormValid || isPending) return;

        const date = combineDateAndTime(selectedDate, selectedTime);
        const formData: Pick<AgendamentoForm, 'customerName' | 'date' | 'barberId' | 'servicesId'> = {
            customerName: name,
            date: date,
            barberId: barber!.id,
            servicesId: servicos.map(s => s.id),
        };

        const loadingToast = toast.loading(isAdmin ? "Agendando..." : "Gerando PIX...", {position :'top-right'});

        startTransition(async () => {
            try {
                const res = await handleBooking(formData);

                if (res?.error) {
                    toast.error(res.error, { id: loadingToast, position: 'top-right' });
                    return;
                }

                toast.dismiss(loadingToast);

                // Se for ADMIN, ele retorna uma URL direta (redireciona)
                if (res?.url) {
                    window.location.href = res.url;
                    return;
                }

                if (res?.qrCode) {
                    setPixData({
                        qrCode: res.qrCode,
                        qrCodeBase64: res.qrCodeBase64!,
                        appointmentId: res.appointmentId!,
                        token: res.token!
                    });
                    setShowPix(true);
                }

            } catch (error) {
                console.error("Erro no checkout:", error);
                toast.error("Ocorreu um erro inesperado.", { id: loadingToast, position: 'top-right'});
            }
        });
    };

   return (
        <form 
            className="max-w-lg md:my-7 mx-auto bg-[#0a0a0a] p-3 md:p-6 md:rounded-3xl border border-white/10 shadow-[0_0_50px_-12px_rgba(220,38,38,0.2)] space-y-8 relative overflow-hidden" 
            onSubmit={handleSubmit}
        >
            {/* SELO VIP */}
            {isAdmin && (
                <div className="absolute -right-12 top-6 rotate-45 bg-gradient-to-r from-yellow-600 to-yellow-400 text-black text-[10px] font-black py-1 px-12 shadow-lg flex items-center gap-1 uppercase tracking-tighter z-50">
                    <Crown size={12} /> VIP
                </div>
            )}

            <header className="text-center ">
                <Link href='/' className="inline-block hover:scale-105 transition-transform rounded-full">
                    <Image src='/logo.png' alt="Logo" width={70} height={70} priority className="rounded-full mx-auto drop-shadow-[0_0_15px_rgba(220,38,38,0.4)]"/>
                </Link>
                    <h2 className="text-white font-black tracking-[0.2em] text-lg uppercase">Agende seu corte</h2>
            </header>

            <div className="space-y-4">
                <div className="group">
                    <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold ml-1">Seu Nome</label>
                    <input 
                        type="text" 
                        placeholder="COMO DEVEMOS TE CHAMAR?" 
                        className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-white focus:border-red-600 transition-all outline-none"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <Services servicos={servicos} toggleServico={toggleServico} services={services}/>
            </div>

            <div className="pt-3 border-t border-white/5">
                <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold ml-1 mb-2 block">1. Quando?</label>
                <Data setSelectedDate={setSelectedDate} selectedDate={selectedDate}/>
            </div>

            <div >
                {!selectedDate ? (
                    <div className="flex items-center gap-3 p-6 bg-white/[0.02] border border-dashed border-white/5 rounded-2xl text-gray-600 text-[11px] uppercase tracking-widest">
                        <CalendarClock size={20} className="opacity-20" /> Selecione uma data acima
                    </div>
                ) : isLoadingBarbers ? (
                    <div className="flex justify-center p-4"><Loader2 className="animate-spin text-red-600" /></div>
                ) : (
                    <Barbeiros barber={barber} setBarber={setBarber} cabeleleiros={cabeleleiros}/>
                )}
            </div>

            <div className="space-y-3 pt-4 border-t border-white/5">
                <label className="text-[10px] text-gray-500 uppercase tracking-[0.2em] font-bold ml-1">3. Horário</label>
                {!barber ? (
                    <div className="flex items-center gap-3 p-6 bg-white/[0.02] border border-dashed border-white/5 rounded-2xl text-gray-600 text-[11px] uppercase tracking-widest">
                        <UserCircle size={20} className="opacity-20" /> Escolha o barbeiro
                    </div>
                ) : isLoadingHours ? (
                    <div className="flex justify-center p-4"><Loader2 className="animate-spin text-red-600" /></div>
                ) : (
                    <Horario horarios={horarios} selectedTime={selectedTime} setSelectedTime={setSelectedTime}/>
                )}
            </div>

            <div className="pt-6 border-t border-white/10 space-y-6">
                <div className="flex justify-between items-center bg-white/5 p-4 rounded-2xl border border-white/5">
                    <div className="flex flex-col">
                        <span className="text-gray-500 text-[9px] uppercase tracking-[0.2em] font-bold">Investimento Total</span>
                        <span className="text-white text-2xl font-black tracking-tight">{formatBRL(valorTotal ?? 0)}</span>
                    </div>
                    {servicos.length > 0 && (
                        <div className="text-right">
                            <span className="text-red-500 text-[10px] font-bold uppercase block">{servicos.length} Serviços</span>
                            <span className="text-gray-500 text-[9px] uppercase tracking-tighter">aprox. {servicos.reduce((a, b) => a + b.duration, 0)} min</span>
                        </div>
                    )}
                </div>
                <PixModal 
                isOpen={showPix} 
                onClose={() => setShowPix(false)}
                qrCode={pixData?.qrCode}
                qrCodeBase64={pixData?.qrCodeBase64}
                appointmentId={pixData?.appointmentId}
                onSuccess={() => {
                    // Redireciona para o comprovante real usando o token recebido
                    window.location.href = `/comprovante/${pixData?.token}`;
                }}
            />
                <button 
                    type="submit" 
                    disabled={!isFormValid || isPending}
                    className={cn(
                        "w-full cursor-pointer flex items-center justify-center gap-3 py-5 rounded-2xl font-black uppercase tracking-widest transition-all shadow-xl active:scale-95",
                        isFormValid 
                            ? "bg-red-600 hover:bg-red-500 text-white shadow-red-600/20" 
                            : "bg-white/5 text-gray-600 border border-white/5 cursor-not-allowed"
                    )}
                >
                    {isPending ? <Loader2 className="animate-spin" size={20} /> : <><CheckCircle2 size={20} /> Finalizar Agendamento</>}
                </button>
            </div>
        </form>
    );
};

export default BookForm;
