"use server";

import { prisma } from "@/lib/prisma";
import {  decrypt } from "../crypto";
import { AgendamentoForm, SerializedService } from "../types";
import { Payment, Preference } from "mercadopago";
import { client } from "../mercadopago";
import { auth } from "@/auth";
import { createAppointment } from "./appointment";
import { getServices } from "./service";
import { Prisma, Service } from "@prisma/client";

//pegar os dados para montar a página de comprovante
export const getCheckData = async (urlToken: string) => {
    const decodedText = decodeURIComponent(urlToken);
    if (!decodedText.includes(':')) {
      throw new Error("Token malformado: separador não encontrado.");
    }
    
    try {
        const appointmentId = decrypt(decodedText);
        const appointment = await prisma.appointment.findUnique({
            where: {
                id: appointmentId,
            }, 
            include: {
              barber: true,
              services: true
            }
        });

        if (!appointment) return {error: true, data: null}

        return {error: false, data: appointment}
    } catch (err) {
        console.error(err);
        return {error: true, data: null}
    }
}


export async function handleBooking(data: Pick<AgendamentoForm, 'customerName' | 'date' | 'barberId' | 'servicesId'>) {
  const session = await auth();
  const payment = new Payment(client);

  const isAdmin = session?.user?.role === 'ADMIN';
  const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

  try {
    const services = await getServices(data.servicesId);
    if (!services.data) throw new Error("Falha ao procurar serviços");

    const valorTotal = services.data.reduce((acc: number, s: SerializedService) => acc + s.price, 0);
    const time = services.data.reduce((acc: number, s: SerializedService) => acc + s.duration, 0);

    const dados = {
      customerName: data.customerName,
      date: data.date,
      totalAmount: new Prisma.Decimal(valorTotal),
      totalDuration: time,
      barberId: data.barberId,
      servicesId: data.servicesId
    }

    const appointmentRes = await createAppointment(dados, isAdmin);
    if (!appointmentRes.success) throw new Error("Falha ao criar agendamento.");

    const safeToken = encodeURIComponent(appointmentRes?.token ?? '');

    // 1. ADMIN: Retorna URL direto
    if (isAdmin) {
      return { url: `${BASE_URL}/comprovante/${safeToken}` };
    }

    // 2. CLIENTE: Cria Pagamento PIX Transparente
    const paymentResponse = await payment.create({
      body: {
        transaction_amount: valorTotal,
        description: `Agendamento - Sedran Barber Shop`,
        payment_method_id: "pix",
        external_reference: appointmentRes.appointmentId,
        payer: {
          email: `cliente_${appointmentRes.appointmentId}@sedranbarber.com.br`,
          first_name: data.customerName.split(' ')[0],
          last_name: data.customerName.split(' ').slice(1).join(' ') || 'Cliente',
        },
        // Expira em 10 minutos
        date_of_expiration: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
      }
    });

    return {
      success: true,
      qrCode: paymentResponse.point_of_interaction?.transaction_data?.qr_code,
      qrCodeBase64: paymentResponse.point_of_interaction?.transaction_data?.qr_code_base64,
      appointmentId: appointmentRes.appointmentId,
      token: safeToken
    };

  } catch (error) {
    console.error("Erro no handleBooking:", error);
    return { error: "Erro ao processar o agendamento" };
  }
}
