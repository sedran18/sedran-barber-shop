import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBRL(value: number): string {
  const valor = Number(value)
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(valor);
}


export const combineDateAndTime = (date: Date, hourString: string) => {
  const datePart = date.toISOString().split('T')[0];
  const isoString = `${datePart}T${hourString}:00-03:00`;
  return new Date(isoString);
};

export const getHourFromDate = (date: Date) => {
  return date.toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'America/Sao_Paulo' 
  });
}