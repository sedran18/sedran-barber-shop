'use client';

import { CalendarIcon } from 'lucide-react'
import { Input } from '../ui/input'
import { startTransition, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

const DateInput = ({path}: {path: string}) => {
  const getLocalDate = () => {
      const d = new Date();
      const z = d.getTimezoneOffset() * 60 * 1000;
      const local = new Date(d.getTime() - z);
      return local.toISOString().split('T')[0];
    };

  const [filterDate, setFilterDate] = useState<string>(getLocalDate());
  
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const dateValue = e.target.value;

    setFilterDate(dateValue);
    const params = new URLSearchParams(searchParams.toString());
    params.set('date', dateValue);
    startTransition(() => {
      router.push(`${path}?${params.toString()}`, { scroll: false });
    });
  }

    return (
        <div className="relative flex items-center bg-[#121212]
         border border-white/10 rounded-xl px-2 
         focus-within:border-red-600 transition-all">
            <CalendarIcon size={18} className="text-gray-500" />
            <Input 
              type="date" 
              value={filterDate}
              onChange={handleChange}
              className="bg-transparent border-none text-white focus-visible:ring-0 focus-visible:ring-offset-0 h-11"
            />
        </div>
  )
}

export default DateInput
