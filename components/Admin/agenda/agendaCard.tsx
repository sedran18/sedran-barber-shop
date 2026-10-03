import { User, Scissors, Crown, Clock } from "lucide-react";
import { getHourFromDate, formatBRL } from "@/lib/utils";
import { AgendaType } from "@/lib/types";
import DeleteAppointmentBtn from "./deleteAppointmentBtn";

const AgendaCard = ({ agendadosHoje}: { agendadosHoje: AgendaType[] }) => {
  return (
    <div className="flex flex-col gap-3 p-2 md:p-4">
      {agendadosHoje.map((item) => {
        const hour = getHourFromDate(item.date);
        const serviçosStr = item.services.map((s) => s.name).join(", ");

        return (
          <div
            key={item.id}
            className={`
              relative bg-zinc-900/90 border border-white/5 shadow-xl transition-all
              flex flex-col gap-3 p-3 
              md:flex-row md:items-center md:p-3 md:gap-5 md:rounded-xl 
              rounded-2xl border-l-4 ${item.isVip ? "border-l-amber-500" : "border-l-red-600"}
              hover:bg-zinc-800/80
            `}
          >
            <div className="flex items-center gap-2 md:flex-col md:min-w-[70px] md:border-r md:border-white/10 md:pr-4">
              <Clock size={14} className="text-red-500 md:hidden" />
              <span className="text-zinc-500 font-mono text-[10px] uppercase font-bold md:block hidden tracking-tighter">Horário</span>
              <span className="text-white font-mono text-xl md:text-base font-black leading-none">
                {hour}
              </span>
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1 md:mb-0">
                <h3 className="text-zinc-100 text-lg md:text-sm font-bold truncate uppercase tracking-tight">
                  {item.customerName}
                </h3>
                {item.isVip && (
                  <div className="flex items-center gap-1 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                    <Crown size={12} className="text-amber-500 fill-amber-500" />
                    <span className="text-[9px] font-black text-amber-500 uppercase md:hidden">VIP</span>
                  </div>
                )}
              </div>
              
              <div className="flex flex-col gap-1 md:flex-row md:items-center md:gap-3">
                <div className="flex items-center gap-1.5 text-zinc-400">
                  <Scissors size={12} className="text-red-500/70" />
                  <span className="text-xs md:text-[11px] font-medium truncate">{serviçosStr}</span>
                </div>
                <span className="hidden md:inline text-zinc-700">|</span>
                <div className="flex items-center gap-1.5 text-zinc-500">
                  <User size={12} />
                  <span className="text-xs md:text-[11px] italic truncate">
                    {item.barber.name}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-2 pt-3 border-t border-white/5 
                            md:mt-0 md:pt-0 md:border-none md:flex-row md:gap-4">
              
              <div className="flex flex-col md:items-end">
                <span className="text-[9px] text-zinc-500 font-bold uppercase md:block hidden">Total</span>
                <span className="text-red-500 font-mono text-lg md:text-sm font-black tracking-tighter">
                  {formatBRL(Number(item.totalAmount))}
                </span>
              </div>

              <div className="md:static">

                {
                  item.status === 'CANCELLED' ? 
                    <span className="px-2 py-0.5 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-[9px] font-black uppercase tracking-widest shadow-sm shadow-red-500/5">
                      Cancelado
                    </span>
                  : 
                    <DeleteAppointmentBtn id={item.id} />
                }
                  
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default AgendaCard;