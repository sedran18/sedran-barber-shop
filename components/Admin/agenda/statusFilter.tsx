// components/Admin/agenda/statusFilter.tsx
'use client'

import { Button } from "@/components/ui/button";
import { XCircle } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

export default function StatusFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const currentStatus = searchParams.get('status');
  const isCancelled = currentStatus === 'CANCELLED';

  const toggleFilter = (status: string | null) => {
    const params = new URLSearchParams(searchParams.toString());
    if (status) {
      params.set('status', status);
    } else {
      params.delete('status');
    }
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex bg-zinc-900/50 p-1 rounded-2xl border border-white/5">
      <Button
        onClick={() => toggleFilter(null)}
        variant="ghost"
        className={`rounded-xl px-4 h-9 text-[10px] uppercase font-black tracking-widest transition-all ${!isCancelled ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500'}`}
      >
        Ativos
      </Button>
      <Button
        onClick={() => toggleFilter('CANCELLED')}
        variant="ghost"
        className={`rounded-xl px-3 h-9 text-[10px] uppercase font-black tracking-widest transition-all ${isCancelled ? 'bg-red-600 text-white shadow-lg' : 'text-zinc-500 hover:text-red-400'}`}
      >
        <XCircle />
        Cancelados
      </Button>
    </div>
  );
}