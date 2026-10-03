import { Prisma, PrismaClient } from '@prisma/client';
import 'dotenv/config';
import { RegisterFormType } from '@/lib/types';
import bcrypt from 'bcryptjs';
import { HAIRCUT_PRICE, EYEBROW_PRICE, BEARD_PRICE } from '@/lib/constants';

const prisma = new PrismaClient();

const dadosAdmin: RegisterFormType = {
  name: process.env.NAME_ADMIN ?? 'SEDRAN',
  email: process.env.EMAIL_ADMIN ?? 'admin@sedran.com.br',
  role: 'ADMIN',
  password: process.env.PASSWORD_ADMIN ?? '12345678',
  daysOfWeek: [1, 2, 3, 4, 5, 6],
  startTime: '08:30',
  endTime: '18:00',
};

const services = [
  {
    name: 'cabelo',
    price: new Prisma.Decimal(HAIRCUT_PRICE ?? 30),
    duration: 30,
  },
  {
    name: 'barba',
    price: new Prisma.Decimal(BEARD_PRICE ?? 25),
    duration: 10,
  },
  {
    name: 'sobrancelha',
    price: new Prisma.Decimal(EYEBROW_PRICE ?? 15),
    duration: 10,
  }
];

async function main() {
  console.log("⏳ Iniciando o seed do banco de dados...");

  const hashedPassword = await bcrypt.hash(dadosAdmin.password, 10);

  await prisma.barber.upsert({
    where: { email: dadosAdmin.email },
    update: {
      password: hashedPassword, 
    },
    create: {
      name: dadosAdmin.name,
      email: dadosAdmin.email,
      password: hashedPassword,
      role: dadosAdmin.role,
      availability: {
        create: dadosAdmin.daysOfWeek.map((day) => ({
          dayOfWeek: day,
          startTime: dadosAdmin.startTime,
          endTime: dadosAdmin.endTime,
        })),
      },
    },
  });

  for (const service of services) {
    await prisma.service.create({
      data: {
        name: service.name,
        price: service.price, 
        duration: service.duration
      },
    });
  }
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log("\n🚀 Seed finalizado com sucesso!");
  })
  .catch(async (e) => {
    console.error("\n❌ Erro ao rodar o seed:");
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });