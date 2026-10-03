'use client';

import { cn } from "@/lib/utils";
import { useSearchParams, useRouter } from "next/navigation";
import { useTransition } from "react";

type FiltroRangeType = "dia" | "semana" | "mes";

const FiltroRange = ({ path }: { path: string }) => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  
  const currentRange = (searchParams.get('range') as FiltroRangeType) || "mes";
  const rangeArr: FiltroRangeType[] = ["dia", "semana", "mes"];

  const handleChange = (dateValue: FiltroRangeType) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('range', dateValue);

    startTransition(() => {
      router.push(`${path}?${params.toString()}`, { scroll: false });
    });
  };

  return (
    <div className="flex bg-[#0A0A0A] p-1 rounded-xl border border-white/5">
      {rangeArr.map((t) => (
        <button
          key={t}
          disabled={isPending}
          onClick={() => handleChange(t)}
          className={cn(
            "px-4 py-2 text-[10px] font-black uppercase tracking-widest rounded-lg transition-all",
            currentRange === t 
              ? "bg-red-600 text-white shadow-lg" 
              : "text-gray-500 hover:text-gray-300 hover:bg-white/5",
            isPending && "opacity-70 cursor-not-allowed"
          )}
        >
          {t}
        </button>
      ))}
    </div>
  );
};

export default FiltroRange;