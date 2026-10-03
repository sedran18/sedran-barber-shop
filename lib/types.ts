import AgendaCard from "@/components/Admin/agenda/agendaCard";
import { type Barber, type Service } from "@prisma/client";
import { Decimal } from "@prisma/client/runtime/library"
import { LucideProps } from "lucide-react"
import { ForwardRefExoticComponent, RefAttributes } from "react";

export interface Funcionario {
    id: string,
    name: string,
    email: string,
    role: 'admin' | 'employee'
}

export interface RegisterFormType {
    name: string
    email: string,
    role?: 'EMPLOYEE' | 'ADMIN',
    password: string, 
    confirmPassword?: string,
    daysOfWeek: Array<0 | 1| 2 | 3| 4| 5| 6>,
    startTime: string   
    endTime: string   
}

export interface MenuItemsType {
  label: string,
  icon: ForwardRefExoticComponent<Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>>,
  href: string,
  adminRoleRequired: boolean
}

export interface ServiceType {
    name: string,
    price: Decimal
    duration: 40
    description: string,
}

export interface AgendaType {
    id:string,
    customerName: string,
    customerPhone:string | null,
    date:Date,
    status: string,
    isVip:boolean,
    totalAmount: Decimal,

    barber: Pick<Barber, 'name'>
  
    services: Service[]
}


export interface AgendamentoForm {
  customerName: string
  date: Date,
  status:   'PENDING' | 'CONFIRMED' |  'COMPLETED' | 'CANCELLED',
  isVip: boolean
  totalAmount: Decimal
  totalDuration: number
  barberId: string
  servicesId: string[]
}

export type SerializedService = Omit<Service, 'price'> & {
  price: number;
};
