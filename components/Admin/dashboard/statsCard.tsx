import { Scissors, Users } from 'lucide-react';
import Link from 'next/link';

interface StatsCardType {
    label: string;
    barberLogged: string;
    value: string;
    cuts: number;
}

const StatsCard = ({ label, barberLogged, value, cuts }: StatsCardType) => {
  const isMe = barberLogged === label;
  const Icon = isMe ? Scissors : Users;

  return (
    <Link
      href='/admin/agenda'
      className="group cursor-pointer relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-white/5 p-6 transition-all duration-300 hover:border-red-600/30">
      <div className="absolute -right-8 -top-8 h-32 w-32 rounded-full bg-red-600/5 blur-[50px] transition-all group-hover:bg-red-600/10" />

      <div className="relative z-10 space-y-4">
        <div className="flex items-start justify-between">
          <div className="rounded-2xl border border-red-600/5 bg-red-600/10 p-3 text-red-600 transition-all group-hover:bg-red-600 group-hover:text-white">
            <Icon size={22} />
          </div>
          {isMe && (
            <span className="rounded-full border border-red-600/20 bg-red-600/10 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-red-600">
              Você
            </span>
          )}
        </div>

        <div>
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 transition-colors group-hover:text-gray-400">
            {label}
          </p>
          <h3 className="mt-1 text-3xl font-black tracking-tighter text-white">
            {value}
          </h3>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-[12px] font-bold italic text-white/70 transition-colors group-hover:text-red-500">
              {cuts} {cuts === 1 ? 'CORTE' : 'CORTES'} REALIZADOS
            </span>
          </div>
        </div>
      </div>

      <div className="absolute -bottom-6 -right-6 text-white/[0.02] transition-colors group-hover:text-red-600/[0.05]">
        <Icon size={140} />
      </div>
    </Link>
  );
};

export default StatsCard;