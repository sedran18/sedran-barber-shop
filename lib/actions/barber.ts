'use server'

import { revalidatePath } from "next/cache";
import prisma from "../prisma";
import { auth } from "@/auth";
import bcrypt from "bcryptjs";


//Pegar lsita de barbeiros
export const getBarbersForGestao = async () => {
    try {
        const barbers = await prisma.barber.findMany({
            select:{
                id: true,
                name: true,
                email: true,
                role: true,
            }
        });

        return {erro: null, data: barbers}
    } catch (err) {
        console.error(err);
        return {erro: 'Erro ao buscar barbeiros', data: null}
    }
}


//excluir barbeiro
export const deleteBarber = async (id: string) => {
    try {
        await prisma.barber.delete({
            where: {
                id,
            }
        })
        revalidatePath('/admin');
        return {erro: null, success: true}
    } catch (err) {
        console.error(err);
        return {erro: 'Erro ao deletar barbeiro'}
    }
}


//atualizar os campos do barbeiro (nome, email, senha) com verificação por senha
export async function updateBarberFields({
  newName,
  newEmail,
  newPassword,
  newConfirmPassword,
  oldPassword
}: {
  newName: string,
  newEmail: string,
  newPassword: string,
  newConfirmPassword: string,
  oldPassword: string
}) {
  try {
    const session = await auth()
    
    console.log("SESSÃO NA ACTION:", session);

    if (!session?.user?.id) {
      return { success: false, error: "Não autorizado." }
    }

    const currentBarber = await prisma.barber.findUnique({
      where: { id: session.user.id }
    })

    if (!currentBarber || !currentBarber.password) {
      return { success: false, error: "Barbeiro não encontrado." }
    }

    const isOldPasswordCorrect = await bcrypt.compare(oldPassword, currentBarber.password);

    if (!isOldPasswordCorrect) {
      return { success: false, error: "A senha atual está incorreta." }
    }

    const updateData: any = {}

    if (newName && newName.trim() !== "") {
      updateData.name = newName
    }

    if (newEmail && newEmail.trim() !== "") {
      updateData.email = newEmail
    }

    if (newPassword && newPassword.trim() !== "") {
      if (newPassword !== newConfirmPassword) {
        return { success: false, error: "As novas senhas não coincidem." }
      }
      if (newPassword.length < 8) {
        return { success: false, error: "A nova senha deve ter no mínimo 8 caracteres." }
      }
      
      updateData.password = await bcrypt.hash(newPassword, 10)
    }

    if (Object.keys(updateData).length === 0) {
      return { success: true, message: "Nenhuma alteração foi necessária." }
    }

    await prisma.barber.update({
      where: { id: session.user.id },
      data: updateData
    })

    revalidatePath("/admin/perfil")

    return { success: true, message: "Dados atualizados com sucesso!" }

  } catch (error) {
    console.error("UPDATE_BARBER_ERROR:", error)
    return { success: false, error: "Erro interno ao atualizar os dados." }
  }
}


// pegar dados para o dashboard
export const getFinancialData = async ({ date, range }: {
  date?: string,
  range?: string,
}) => {

  const endOfRange = date ? new Date(`${date}T00:00:00`) : new Date();
  endOfRange.setHours(23, 59, 59, 999);

  const startOfRange = (() => {
    const start = new Date(endOfRange);
    switch (range) {
      case 'dia':
        start.setHours(0, 0, 0, 0);
        return start;
      case 'semana':
        start.setDate(start.getDate() - 7);
        start.setHours(0, 0, 0, 0);
        return start;
      case 'mes':
        start.setMonth(start.getMonth() - 1);
        start.setHours(0, 0, 0, 0);
        return start;
      default:
        start.setHours(0, 0, 0, 0);
        return start;
    }
  })();

  const barbeiros = await prisma.barber.findMany({
    select: {
      name: true,
      appointments: {
        where: {
          updatedAt: {
            gte: startOfRange,
            lte: endOfRange
          },
          status: {
            in: ['COMPLETED', 'CONFIRMED']
          }
        },
        select: {
          totalAmount: true
        }
      },
    },
  });

  const statsByBarber = barbeiros.map(barber => {
    const rendimentoIndividual = barber.appointments.reduce((acc, app) => {
      return acc + Number(app.totalAmount);
    }, 0);

    return {
      name: barber.name,
      totalCuts: barber.appointments.length,
      rendimento: rendimentoIndividual
    };
  });

  const totalGeral = statsByBarber.reduce((acc, current) => {
    return acc + current.rendimento;
  }, 0);

  return {
    statsByBarber,
    totalGeral,
    periodo: {
      inicio: startOfRange,
      fim: endOfRange
    }
  };
}


interface MonthlyData {
  mes: string;
  [barberName: string]: string | number; 
}

//pegar dados financeiros para o meu grafico
export const getChartData = async (): Promise<MonthlyData[]> => {
  const now = new Date();
  const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  
  const allBarbers = await prisma.barber.findMany({ select: { name: true } });
  const barberNames = allBarbers.map(b => b.name.split(' ')[0].toLowerCase());

  const monthsMap: Record<string, MonthlyData> = {};
  
  for (let i = 5; i >= 0; i--) {
    const d = new Date();
    d.setMonth(now.getMonth() - i);
    const mesNome = mesesNomes[d.getMonth()];
    
    const initialData: MonthlyData = { mes: mesNome };
    barberNames.forEach(name => {
      initialData[name] = 0;
    });
    
    monthsMap[mesNome] = initialData;
  }

  const seisMesesAtras = new Date();
  seisMesesAtras.setMonth(seisMesesAtras.getMonth() - 6);

  const appointments = await prisma.appointment.findMany({
    where: {
      updatedAt: { gte: seisMesesAtras },
      status: {
        in: ['CONFIRMED', 'COMPLETED']
      },
    },
    include: { barber: true }
  });

  appointments.forEach(app => {
    const dataApp = new Date(app.date);
    const mesNome = mesesNomes[dataApp.getMonth()];
    const barberKey = app.barber.name.split(' ')[0].toLowerCase();

    if (monthsMap[mesNome]) {
      const currentVal = monthsMap[mesNome][barberKey] as number;
      monthsMap[mesNome][barberKey] = currentVal + Number(app.totalAmount);
    }
  });

  return Object.values(monthsMap);
};


//pegar barbeiros disponiveis naquele dia 
export const getAvailableBarbers = async ({date}:{date: Date}) => {
  try {
    
    const dayOfWeek = date.getDay();

    const availableBarbers = await prisma.barber.findMany({
      where: {
        availability: {
            some: {
                dayOfWeek: dayOfWeek,
                isActive: true,
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