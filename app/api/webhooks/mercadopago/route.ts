import { prisma } from "@/lib/prisma";
import { MercadoPagoConfig, Payment } from "mercadopago";

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MERCADO_PAGO_ACCESS_TOKEN! 
});

export async function POST(request: Request) {
  const body = await request.json();
  const { searchParams } = new URL(request.url);
  
  // O MP envia o ID do pagamento via query ou body
  const paymentId = body.data?.id || searchParams.get("data.id");

  if (body.type === "payment" && paymentId) {
    const payment = new Payment(client);
    const pResponse = await payment.get({ id: paymentId });

    // Aqui está a mágica: pegamos o SEU id que enviamos no external_reference
    const appointmentId = pResponse.external_reference;

    if (pResponse.status === "approved" && appointmentId) {
      // 3. Atualiza o status no banco de dados
      await prisma.appointment.update({
        where: { id: appointmentId },
        data: { status: "CONFIRMED" },
      });
      console.log(`✅ Agendamento ${appointmentId} confirmado via PIX!`);
    }
  }

  return new Response(null, { status: 200 });
}