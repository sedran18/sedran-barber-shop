import Image from "next/image";
import Link from "next/link";
import { 
  CheckCircle2, Calendar, Clock, User, 
  Scissors, ArrowLeft, 
   Loader2 
} from "lucide-react";
import { formatBRL, getHourFromDate } from "@/lib/utils";
import { getCheckData } from "@/lib/actions/payment"
import { redirect } from "next/navigation";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface PageProps {
  params: Promise<{ token: string }>;
}

export default async function ComprovantePage({ params }: PageProps) {
  // 1. Busca os dados reais usando o token da URL
  const {token} = await params; 
  const { error, data: appointment } = await getCheckData(token);

  if (error || !appointment) {
    redirect("/agendamento");
  }

  // 3. Se ainda estiver PENDENTE, mostra a tela de espera
  if (appointment.status === 'PENDING') {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-black text-white p-6 text-center">
        <Loader2 className="animate-spin text-red-600 mb-6" size={60} />
        <h1 className="text-2xl font-black uppercase tracking-tighter italic mb-2">Aguardando Pagamento...</h1>
        <p className="text-gray-400 text-sm max-w-xs">
          O sistema está processando o seu Pix. Assim que o Mercado Pago confirmar, este ticket será liberado automaticamente.
        </p>
        <p className="mt-8 text-[10px] text-gray-600 uppercase tracking-widest animate-pulse">
          Verificando status em tempo real
        </p>
        {/* Script para dar refresh automático se estiver pendente */}
        <meta httpEquiv="refresh" content="5" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 font-sans">
      
      <Link href='/agendamento' className="mb-8 flex items-center gap-2 text-gray-500 hover:text-red-500 transition-all text-[10px] uppercase tracking-[0.3em] font-bold">
        <ArrowLeft size={14} /> Voltar para o início
      </Link>

      <div className="w-full max-w-md bg-[#0a0a0a] border border-white/5 rounded-[3rem] overflow-hidden shadow-[0_0_100px_-20px_rgba(220,38,38,0.15)] relative">
        
        <div className="bg-red-600 p-8 flex flex-col items-center justify-center gap-3 text-center">
            <div className="bg-white/20 p-3 rounded-full backdrop-blur-md">
                <CheckCircle2 size={32} className="text-white" />
            </div>
            <div>
                <h1 className="font-black text-xl uppercase tracking-tighter italic">Agendamento Confirmado</h1>
                <p className="text-white/70 text-[10px] uppercase tracking-widest font-bold">SEDRAN Barber Shop</p>
            </div>
        </div>

        <div className="p-8 space-y-8 relative">
            <div className="flex justify-between items-start">
                <div className="space-y-1">
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black">Cliente</p>
                    <h2 className="text-2xl font-black uppercase italic tracking-tight text-white">{appointment.customerName}</h2>
                </div>
                <div className="bg-white/5 p-2 rounded-2xl border border-white/5 rounded-full">
                    <Image src="/logo.png" alt="Logo" width={40} height={40} className="grayscale brightness-200" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-y-8 gap-x-4 py-8 border-y border-white/5">
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-red-600">
                        <Calendar size={14} />
                        <span className="text-[9px] uppercase font-black tracking-widest">Data</span>
                    </div>
                    <p className="text-sm font-bold text-gray-200 tracking-tight">
                      {format(new Date(appointment.date), "EEEE, dd 'de' MMM", { locale: ptBR })}
                    </p>
                </div>

                <div className="space-y-1 text-right">
                    <div className="flex items-center gap-2 text-red-600 justify-end">
                        <Clock size={14} />
                        <span className="text-[9px] uppercase font-black tracking-widest">Horário</span>
                    </div>
                    <p className="text-sm font-bold text-gray-200 tracking-tight">
                      {getHourFromDate(appointment.date)}
                    </p>
                </div>
{/* ihv-hqdr-sbt */}
                <div className="space-y-1">
                    <div className="flex items-center gap-2 text-red-600">
                        <User size={14} />
                        <span className="text-[9px] uppercase font-black tracking-widest">Barbeiro</span>
                    </div>
                    <p className="text-sm font-bold text-gray-200 tracking-tight">{appointment.barber?.name || "SEDRAN"}</p>
                </div>

                <div className="space-y-1 text-right">
                    <div className="flex items-center gap-2 text-red-600 justify-end">
                        <Scissors size={14} />
                        <span className="text-[9px] uppercase font-black tracking-widest">Status</span>
                    </div>
                    <p className="text-sm font-bold text-green-500 uppercase italic tracking-tighter">Pago</p>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex justify-between items-center">
                    <p className="text-[10px] text-gray-600 uppercase tracking-widest font-black">Financeiro</p>
                    <span className="h-[1px] flex-1 bg-white/5 mx-4"></span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="text-[11px] text-gray-400 font-medium uppercase italic">Total dos Serviços</span>
                    <span className="text-xl text-white font-black italic">{formatBRL(Number(appointment.totalAmount))}</span>
                </div>
            </div>

            <div className="pt-6 border-t border-white/5 flex justify-center">
                <p className="text-[9px] text-white uppercase font-black tracking-[0.2em]">Tire um print caso queira comprovar seu agendamento </p>
            </div>

            
        </div>

        <div className="absolute top-[235px] -left-4 w-8 h-8 bg-[#050505] rounded-full border-r border-white/5"></div>
        <div className="absolute top-[235px] -right-4 w-8 h-8 bg-[#050505] rounded-full border-l border-white/5"></div>
      </div>

      <div className="mt-8 text-center space-y-2">
          <p className="text-white/70 text-[8px] uppercase tracking-[0.4em] font-bold">
            Dev. by Gabriel Nardes
          </p>
      </div>
    </div>
  );
}