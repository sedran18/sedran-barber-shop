'use server'

import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"
import { RegisterFormType } from "../types";
import { revalidatePath } from "next/cache";

export async function registerAction({ name, email, password, confirmPassword, daysOfWeek, startTime, endTime }: RegisterFormType) {
  if (!name || !email || !password || !daysOfWeek || !startTime || !endTime) {
    return { success: false, error: "Todos os campos são obrigatórios." }
  }

  if (confirmPassword !== password) {
    return { success: false, error: "Senhas não coincidem" }
  }

  if (password.length < 8) {
    return { success: false, error: "A senha precisa ter no mínimo 8 caracteres" }
  }

  try {
    const existingBarber = await prisma.barber.findUnique({ where: { email } })
    if (existingBarber) {
      return { success: false, error: "Este e-mail já está cadastrado." }
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.barber.create({
      data: {
        name,
        email,
        password: hashedPassword,
        availability: {
          create: daysOfWeek.map((day) => ({
            dayOfWeek: day,
            startTime,
            endTime,
          })),
        },
      },
    })
    revalidatePath('/');
    return { success: true, error: null }

  } catch (error) {
    console.error("ERRO_AO_REGISTRAR:", error);
    return { success: false, error: "Erro ao criar conta. Tente novamente." }
  }
}