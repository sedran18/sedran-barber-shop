'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Users, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const FiltroVisao = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const currentView = searchParams.get('view') || 'meus';

  const handleFilter = (view: 'todos' | 'meus') => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', view);
    router.push(`?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="flex bg-[#121212] p-1 rounded-xl border border-white/5 ">
      <button
        onClick={() => handleFilter('todos')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
          currentView === 'todos' 
            ? "bg-red-600 text-white shadow-lg shadow-red-600/20" 
            : "text-gray-500 hover:text-gray-300"
        )}
      >
        <Users size={14} /> Todos
      </button>

      <button
        onClick={() => handleFilter('meus')}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all",
          currentView === 'meus' 
            ? "bg-red-600 text-white shadow-lg shadow-red-600/20" 
            : "text-gray-500 hover:text-gray-300"
        )}
      >
        <User size={14} /> Meus
      </button>
    </div>
  );
};

export default FiltroVisao;