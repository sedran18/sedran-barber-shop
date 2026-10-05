import { 
  Calendar as CalendarIcon, 
  UserPlus, 
  Plus
} from "lucide-react";
import AgendaCard from "@/components/Admin/agenda/agendaCard";
import DateInput from "@/components/shared/dateInput";
import { auth } from "@/auth";
import { getAppointments } from "@/lib/actions/appointment";
import Link from "next/link";
import StatusFilter from "@/components/Admin/agenda/statusFilter";
import FiltroVisao from "@/components/Admin/agenda/filtroVisao";

export default async function AgendaPage({ 
  searchParams 
}: { 
  searchParams: Promise<{date: string, status: string, view: string}>
}) {
  const session = await auth();
  const isAdmin = session?.user.role === 'ADMIN';
  const {date, status, view} = await searchParams;

  const barberId = session?.user.id ?? '';
  console.log(barberId)
  let appointments = await getAppointments({date, barberId, status, view});



  return (
    <div className="min-h-screen space-y-4 pb-20 md:pb-10">
      <header className="relative overflow-hidden bg-zinc-900/50 border border-white/5 p-5 md:p-8 rounded-[2.5rem] shadow-2xl">
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-red-600/10 blur-[100px] pointer-events-none" />

        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between relative z-10">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <div className="h-2 w-2 bg-red-600 rounded-full animate-pulse" />
              <h1 className="text-3xl font-black text-white uppercase tracking-tighter italic">
                Agenda
              </h1>
            </div>
            <p className="text-zinc-500 text-sm font-medium">
              Gerencie os atendimentos e horários da barbearia.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex-1 md:flex-none">
              <DateInput path="/admin/agenda"/>
            </div>

            {isAdmin && (
              <Link
                href='/agendamento'
                className="cursor-pointer hidden md:flex 
                bg-red-600 hover:bg-red-700 
                text-white rounded-2xl h-12
                flex items-center
                px-6 gap-2 uppercase font-black 
                text-xs tracking-widest transition-all 
                hover:scale-105 active:scale-95 
                shadow-lg 
                shadow-red-600/20"
                >
                  <UserPlus size={18} />
                  Agendar VIP
              </Link>
            )}
          </div>
        </div>
      </header>

      <main className="space-y-4">
        <div className="flex items-center justify-between px-6 pt-2">
          <div className="flex items-center gap-3">
            <h2 className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.4em]">
              Atendimentos
            </h2>
            <span className="bg-zinc-800 text-zinc-400 text-[10px] px-2 py-0.5 rounded-full font-bold">
              {appointments.length}
            </span>
          </div>


        </div>
        <div className="w-full flex flex-col sm:flex-row items-center justify-center sm:justify-end gap-3 p-1 rounded-2xl transition-all">
          {isAdmin && (
            <div className="w-full sm:w-auto flex justify-center">
              <FiltroVisao />
            </div>
          )}
          
          <div className="w-full sm:w-auto flex justify-center">
            <StatusFilter />
          </div>
        </div>
  
        <div className="w-full sm:w-auto flex justify-end">

        </div>
        
        {appointments.length > 0 ? (
          <div className="px-1 md:px-0">
            <AgendaCard agendadosHoje={appointments}/>
          </div>
        ) : (
          <div className="bg-zinc-900/30 border-2 border-dashed border-white/5 rounded-[3rem] p-16 md:p-32 text-center">
            <div className="bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 border border-white/5">
              <CalendarIcon size={24} className="text-zinc-600" />
            </div>
            <p className="text-zinc-400 uppercase font-black text-[11px] tracking-widest max-w-[200px] mx-auto leading-relaxed">
              Nenhum corte agendado para este dia.
            </p>
          </div>
        )}
      </main>

      {isAdmin && (
        <div className="fixed bottom-6 right-6 md:hidden z-50">
          <Link 
            href='/agendamento'
            className="w-14 h-14 rounded-full bg-red-600 shadow-2xl shadow-red-600/40 flex items-center justify-center active:scale-90 transition-transform border-4 border-zinc-950">
            <Plus size={28} className="text-white" />
          </Link>
        </div>
      )}
    </div>
  );
}