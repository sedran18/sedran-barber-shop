'use server';

import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client"; 
import { Decimal } from "@prisma/client/runtime/library";
import { revalidatePath } from "next/cache";
import { encrypt } from "../crypto";
import { AgendamentoForm } from "../types";

export const getAppointments = async ( {
  date, 
  limit, 
  skip, 
  barberId, 
  status,
  view
  } : {
    date?: string, 
    limit?: number, 
    skip?: number
    barberId: string
    status?: string,
    view?: string
  }) => {

  const whereClause: Prisma.AppointmentWhereInput = {
    status: status === 'CANCELLED' ? 'CANCELLED' : { in: ['COMPLETED', 'CONFIRMED'] },
    barberId:  view === 'todos' ? undefined : barberId
  };
  
  if (date) {
    const [year, month, day] = date.split('-').map(Number);

    const startOfDay = new Date(year, month - 1, day, 0, 0, 0, 0);
    const endOfDay = new Date(year, month - 1, day, 23, 59, 59, 999);

    whereClause.date = {
      gte: startOfDay,
      lte: endOfDay,
    };
  } else {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    whereClause.date = {
      gte: startOfToday,
      lte: endOfToday
    };
  }

  try {
    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      take: limit ?? 10,
      skip: skip ?? 0,
      include: {
        services: true,
        barber: {
          select: {
            name: true,
          }
        }
      },
      orderBy: {
        date: 'asc',
      },
    });
    console.log(barberId)
    console.log(appointments[0].id)
    console.log(appointments[0].barber.name)
    return appointments;
  } catch (error) {
    console.error("ERRO_GET_APPOINTMENTS:", error);
    return [];
  }
}

export const CancelAppointment = async  (appointmentId: string) => {
    try  {
        await prisma.appointment.update({
            where: {
                id: appointmentId
            }, 
            data: {
              status: 'CANCELLED',
            }
        });

        revalidatePath('/admin/agenda');
        return {success: true};
    } catch (err) {
        console.error(err);
        return {success: false};
    }
}
export const getHoursAvailableByDate = async ({ date, barberId }: { date: Date, barberId: string }) => {
  const startOfDay = new Date(date.toLocaleString("en-US", {timeZone: "America/Sao_Paulo"}));
  startOfDay.setHours(0, 0, 0, 0);

  const endOfDay = new Date(date);
  endOfDay.setHours(23, 59, 59, 999);

  try {
    const appointments = await prisma.appointment.findMany({
      where: {
        date: {
          gte: startOfDay,
          lte: endOfDay,
        },
        barberId,
        status: { in: ['CONFIRMED', 'COMPLETED', 'PENDING'] }
      },
      select: { date: true }
    });

    const availability = await prisma.availability.findUnique({
      where: {
        barberId_dayOfWeek: { 
          barberId,
          dayOfWeek: date.getDay()
        }
      },
    });

    if (!availability || !availability.isActive) {
      return [];
    }

    const { startTime, endTime } = availability;

    const hoursNotAvailable = appointments.map(app => {
      return app.date.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false, 
        timeZone: 'America/Sao_Paulo'
      });
    });

    const allPossibleHours = [
      '08:30', '09:10', '09:50', '10:30', '11:10', '11:50',
      '14:00', '14:40', '15:20', '16:00', '16:40', '17:20'
    ];

    const hoursAvailable = allPossibleHours.filter(h => {
      const isOccupied = hoursNotAvailable.includes(h);
      const isWithinRange = h >= startTime && h <= endTime;
      
      return !isOccupied && isWithinRange;
    });

    return hoursAvailable;
  } catch (err) {
    console.error("Erro ao buscar horários:", err);
    return [];
  }
}

export async function getAppointmentStatus(id: string) {
  try {
    const appointment = await prisma.appointment.findUnique({
      where: { id },
      select: { status: true },
    });

    return { status: appointment?.status };
  } catch (error) {
    return { error: "Erro ao buscar status" };
  }
}

export async function createAppointment(data: Omit<AgendamentoForm, 'status' | 'isVip'>, isAdmin: boolean) {
  try {
    const appointment = await prisma.appointment.create({
      data: {
        customerName: data.customerName,
        date: data.date, 
        barberId: data.barberId,
        totalAmount: data.totalAmount,
        totalDuration: data.totalDuration,
        status: isAdmin ? "CONFIRMED" : "PENDING",
        isVip: isAdmin,
        services: {
          connect: data.servicesId.map((id: string) => ({ id }))
        }
      }
    });

    // 2. Gerar o token do comprovante
    const token = encrypt(appointment.id);

    return { 
      success: true, 
      appointmentId: appointment.id, 
      token 
    };

  } catch (error) {
    console.error("Erro ao criar agendamento:", error);
    return { success: false, error: "Falha ao processar agendamento" };
  }
}