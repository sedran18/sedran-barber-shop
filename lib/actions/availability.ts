"use server";

import { prisma } from "@/lib/prisma";

export const getAvailableBarbers = async (date: Date, hour: string) => {
  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;

  if (!timeRegex.test(hour)) {
    throw new Error("Formato de hora inválido. Use HH:mm");
  }

  const formattedHour = hour.padStart(5, '0');
  
  const dayOfWeek = date.getDay();

  try {
    const availableBarbers = await prisma.barber.findMany({
      where: {
        availability: {
            some: {
                dayOfWeek: dayOfWeek,
                isActive: true,
                startTime: { lte: formattedHour },
                endTime: { gte: formattedHour },
            },
        },
      },
    });

    return availableBarbers;
  } catch (error) {
    console.error("Erro ao validar disponibilidade:", error);
    return [];
  }
};