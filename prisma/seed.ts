import { AppointmentStatus, Prisma, PrismaClient, type Service } from '@prisma/client';
import 'dotenv/config';
import { RegisterFormType } from '@/lib/types';
import bcrypt from 'bcryptjs';
import { HAIRCUT_PRICE, EYEBROW_PRICE, BEARD_PRICE } from '@/lib/constants';

const prisma = new PrismaClient();

const PAST_DAYS = 63;
const FUTURE_DAYS = 14;
const TIMEZONE = 'America/Sao_Paulo';
const WORK_DAYS = [1, 2, 3, 4, 5, 6] as const;
const WORK_START = '08:30';
const WORK_END = '18:00';

// Mesmos horários usados em getHoursAvailableByDate.
const SLOT_PRIORITY = [
  '09:10', '09:50', '10:30', '16:00', '16:40',
  '14:00', '14:40', '15:20', '11:10', '11:50',
  '08:30', '17:20',
] as const;

const START_BIAS = [
  '09:10', '09:10', '09:50', '09:50', '10:30', '10:30',
  '16:00', '16:00', '16:40', '14:40', '15:20', '11:10',
  '08:30', '17:20', '14:00', '11:50',
] as const;

const SERVICE_CATALOG = [
  { name: 'cabelo', price: new Prisma.Decimal(HAIRCUT_PRICE ?? 30), duration: 30 },
  { name: 'barba', price: new Prisma.Decimal(BEARD_PRICE ?? 25), duration: 10 },
  { name: 'sobrancelha', price: new Prisma.Decimal(EYEBROW_PRICE ?? 15), duration: 10 },
] as const;

const SERVICE_COMBOS = [
  ['cabelo'],
  ['cabelo'],
  ['cabelo', 'barba'],
  ['cabelo'],
  ['barba'],
  ['cabelo'],
  ['cabelo'],
  ['cabelo', 'barba'],
  ['cabelo', 'sobrancelha'],
  ['cabelo'],
  ['barba', 'sobrancelha'],
  ['cabelo', 'barba', 'sobrancelha'],
] as const;

const CLIENTS = [
  { name: 'Lucas Ferreira', phone: '77991001001', vip: true },
  { name: 'Pedro Henrique Costa', phone: '77991001002', vip: true },
  { name: 'Bruno César Martins', phone: '77991001003', vip: true },
  { name: 'André Souza', phone: '77991001004', vip: false },
  { name: 'Marcos Vinícius Lima', phone: '77991001005', vip: false },
  { name: 'João Batista Nunes', phone: '77991001006', vip: false },
  { name: 'Carlos Eduardo Rocha', phone: '77991001007', vip: false },
  { name: 'Felipe Andrade', phone: '77991001008', vip: false },
  { name: 'Diego Alves', phone: '77991001009', vip: false },
  { name: 'Thiago Mendes', phone: '77991001010', vip: false },
  { name: 'Gustavo Henrique Dias', phone: '77991001011', vip: false },
  { name: 'Renato Carvalho', phone: '77991001012', vip: false },
  { name: 'Leandro Pires', phone: '77991001013', vip: false },
  { name: 'Vinícius Barbosa', phone: '77991001014', vip: false },
  { name: 'Eduardo Santos', phone: '77991001015', vip: false },
  { name: 'Caio Ribeiro', phone: '77991001016', vip: false },
] as const;

const CLIENT_PATTERN = [
  0, 1, 3, 0, 4, 2, 5, 1, 6, 0, 7, 3, 8, 4, 9, 1, 10, 5, 11, 2, 12, 6, 13, 0, 14, 7, 15, 3, 8, 1,
];

const RAFAEL = {
  name: 'Rafael Almeida',
  email: 'rafael.almeida@sedran.com.br',
  password: 'DevRafael#2026',
  role: 'EMPLOYEE' as const,
};

const dadosAdmin: RegisterFormType = {
  name: process.env.NAME_ADMIN ?? 'SEDRAN',
  email: process.env.EMAIL_ADMIN ?? 'admin@sedran.com.br',
  role: 'ADMIN',
  password: process.env.PASSWORD_ADMIN ?? '12345678',
  daysOfWeek: [1, 2, 3, 4, 5, 6],
  startTime: WORK_START,
  endTime: WORK_END,
};

type BarberKey = 'admin' | 'rafael';

type Draft = {
  barberKey: BarberKey;
  dayKey: string;
  when: Date;
  slot: string;
  combo: readonly string[];
  duration: number;
  amount: Prisma.Decimal;
  client: (typeof CLIENTS)[number];
  status: AppointmentStatus;
  isVip: boolean;
  createdAt: Date;
  updatedAt: Date;
};

type Block = {
  barberKey: BarberKey;
  dayKey: string;
  start: number;
  end: number;
};

function minutesOf(slot: string) {
  const [hour, minute] = slot.split(':').map(Number);
  return hour * 60 + minute;
}

function saoPauloToday(now: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).formatToParts(now);

  const value = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value);

  return addCalendarDays(value('year'), value('month'), value('day'), 0);
}

function addCalendarDays(year: number, month: number, day: number, days: number) {
  const date = new Date(Date.UTC(year, month - 1, day + days));
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
    dow: date.getUTCDay(),
    serial: Math.floor(date.getTime() / 86_400_000),
  };
}

function calendarKey(year: number, month: number, day: number) {
  return `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
}

function atSaoPaulo(year: number, month: number, day: number, slot: string) {
  const [hour, minute] = slot.split(':');
  return new Date(`${calendarKey(year, month, day)}T${hour}:${minute}:00-03:00`);
}

function saoPauloClock(date: Date) {
  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    hourCycle: 'h23',
  }).formatToParts(date);

  const pick = (type: Intl.DateTimeFormatPartTypes) =>
    parts.find((part) => part.type === type)?.value ?? '0';

  return {
    dayKey: `${pick('year')}-${pick('month')}-${pick('day')}`,
    minutes: Number(pick('hour')) * 60 + Number(pick('minute')),
  };
}

function countsForDay(dow: number, week: number): Record<BarberKey, number> {
  const even = week % 2 === 0;

  switch (dow) {
    case 1:
      return { admin: 1, rafael: 0 };
    case 2:
      return { admin: 0, rafael: 1 };
    case 3:
      return even ? { admin: 1, rafael: 0 } : { admin: 0, rafael: 1 };
    case 4:
      return even ? { admin: 0, rafael: 0 } : { admin: 0, rafael: 1 };
    case 5:
      return { admin: 1, rafael: 1 };
    case 6:
      return even ? { admin: 2, rafael: 1 } : { admin: 1, rafael: 2 };
    default:
      return { admin: 0, rafael: 0 };
  }
}

function slotOrder(serial: number, barberOffset: number) {
  const start = START_BIAS[(serial + barberOffset) % START_BIAS.length];
  const index = SLOT_PRIORITY.indexOf(start);
  if (index < 0) return [...SLOT_PRIORITY];
  return [...SLOT_PRIORITY.slice(index), ...SLOT_PRIORITY.slice(0, index)];
}

function statusForPast(index: number) {
  if (index % 8 === 0) return AppointmentStatus.CANCELLED;
  return AppointmentStatus.COMPLETED;
}

function statusForFuture(index: number) {
  if (index % 6 === 0) return AppointmentStatus.CANCELLED;
  if (index % 3 === 0) return AppointmentStatus.PENDING;
  return AppointmentStatus.CONFIRMED;
}

function timestamps(when: Date, now: Date, seq: number, status: AppointmentStatus) {
  const createdAt = new Date(when);
  createdAt.setUTCDate(createdAt.getUTCDate() - (1 + (seq % 4)));

  if (createdAt.getTime() > now.getTime()) {
    createdAt.setTime(now.getTime() - (seq % 5 + 1) * 3_600_000);
  }

  let updatedAt = createdAt;
  if (status === AppointmentStatus.COMPLETED || status === AppointmentStatus.CANCELLED) {
    const eventTime = new Date(when);
    if (status === AppointmentStatus.CANCELLED) eventTime.setUTCHours(eventTime.getUTCHours() - 3);
    const candidate = Math.min(Math.max(eventTime.getTime(), createdAt.getTime()), now.getTime());
    updatedAt = new Date(Math.max(candidate, createdAt.getTime()));
  }

  return { createdAt, updatedAt };
}

function buildDrafts(services: Map<string, Service>, now: Date, blocks: Block[]) {
  const today = saoPauloToday(now);
  const drafts: Draft[] = [];
  const closing = minutesOf(WORK_END);
  let seq = 0;
  let pastSeq = 0;
  let futureSeq = 0;

  for (let offset = -PAST_DAYS; offset <= FUTURE_DAYS; offset += 1) {
    const day = addCalendarDays(today.year, today.month, today.day, offset);
    if (day.dow === 0) continue;

    const week = Math.floor((offset + PAST_DAYS) / 7);
    const counts = countsForDay(day.dow, week);
    const dayKey = calendarKey(day.year, day.month, day.day);

    (['admin', 'rafael'] as const).forEach((barberKey) => {
      const wanted = counts[barberKey];
      if (wanted === 0) return;

      const occupied = blocks
        .filter((block) => block.barberKey === barberKey && block.dayKey === dayKey)
        .map((block) => ({ start: block.start, end: block.end }));
      const order = slotOrder(day.serial, barberKey === 'rafael' ? 5 : 0);
      let placed = 0;

      for (const slot of order) {
        if (placed >= wanted) break;

        const combo = SERVICE_COMBOS[seq % SERVICE_COMBOS.length];
        const selected = combo.map((name) => {
          const service = services.get(name);
          if (!service) throw new Error(`Serviço "${name}" não encontrado para o seed.`);
          return service;
        });
        const duration = selected.reduce((sum, service) => sum + service.duration, 0);
        const amount = selected.reduce(
          (sum, service) => sum.add(service.price),
          new Prisma.Decimal(0),
        );
        const start = minutesOf(slot);
        const end = start + duration;
        if (end > closing) continue;
        const overlaps = occupied.some((range) => start < range.end && end > range.start);
        if (overlaps) continue;

        const when = atSaoPaulo(day.year, day.month, day.day, slot);
        const client = CLIENTS[CLIENT_PATTERN[seq % CLIENT_PATTERN.length]];
        const isPast = when.getTime() < now.getTime();
        const status = isPast ? statusForPast(pastSeq) : statusForFuture(futureSeq);
        if (isPast) pastSeq += 1;
        else futureSeq += 1;

        occupied.push({ start, end });
        placed += 1;
        drafts.push({
          barberKey,
          dayKey,
          when,
          slot,
          combo,
          duration,
          amount,
          client,
          status,
          isVip: client.vip,
          ...timestamps(when, now, seq, status),
        });
        seq += 1;
      }

      if (placed < wanted) {
        throw new Error(`Não foi possível encaixar ${wanted} horários de ${barberKey} em ${day.year}-${day.month}-${day.day}.`);
      }
    });
  }

  return drafts;
}

function assertDrafts(drafts: Draft[], now: Date, blocks: Block[]) {
  if (drafts.length < 50 || drafts.length > 100) {
    throw new Error(`O seed gerou ${drafts.length} agendamentos; o esperado é entre 50 e 100.`);
  }

  const byBarberDay = new Map<string, { start: number; end: number }[]>();
  for (const block of blocks) {
    const key = `${block.barberKey}|${block.dayKey}`;
    const ranges = byBarberDay.get(key) ?? [];
    ranges.push({ start: block.start, end: block.end });
    byBarberDay.set(key, ranges);
  }

  const statuses = new Set<AppointmentStatus>();

  for (const draft of drafts) {
    statuses.add(draft.status);

    const weekday = new Intl.DateTimeFormat('en-US', {
      timeZone: TIMEZONE,
      weekday: 'short',
    }).format(draft.when);
    if (weekday.startsWith('Sun')) {
      throw new Error('Agendamento caiu em um domingo.');
    }

    if (draft.combo.length === 1 && draft.combo[0] === 'sobrancelha') {
      throw new Error('Sobrancelha não pode ser o único serviço.');
    }

    if (!SLOT_PRIORITY.includes(draft.slot as (typeof SLOT_PRIORITY)[number])) {
      throw new Error(`Horário fora da grade: ${draft.slot}`);
    }

    if (draft.slot < WORK_START || draft.slot > WORK_END) {
      throw new Error(`Horário fora do expediente: ${draft.slot}`);
    }

    if (draft.when.getTime() >= now.getTime() && draft.status === AppointmentStatus.COMPLETED) {
      throw new Error('Agendamento futuro não pode estar COMPLETED.');
    }

    const key = `${draft.barberKey}|${draft.dayKey}`;
    const start = minutesOf(draft.slot);
    const end = start + draft.duration;
    if (end > minutesOf(WORK_END)) {
      throw new Error(`Atendimento passa do expediente: ${draft.slot} + ${draft.duration}min.`);
    }

    const ranges = byBarberDay.get(key) ?? [];
    if (ranges.some((range) => start < range.end && end > range.start)) {
      throw new Error(`Sobreposição para ${draft.barberKey} em ${key}.`);
    }
    ranges.push({ start, end });
    byBarberDay.set(key, ranges);
  }

  for (const status of Object.values(AppointmentStatus)) {
    if (!statuses.has(status)) {
      throw new Error(`Faltou o status ${status} no histórico.`);
    }
  }

  const barbers = new Set(drafts.map((draft) => draft.barberKey));
  if (!barbers.has('admin') || !barbers.has('rafael')) {
    throw new Error('Os dois barbeiros precisam ter agendamentos.');
  }

  const hasPast = drafts.some((draft) => draft.when.getTime() < now.getTime());
  const hasFuture = drafts.some((draft) => draft.when.getTime() > now.getTime());
  if (!hasPast || !hasFuture) {
    throw new Error('O histórico precisa ter agendamentos passados e futuros.');
  }

  const visits = new Map<string, number>();
  for (const draft of drafts) {
    visits.set(draft.client.phone, (visits.get(draft.client.phone) ?? 0) + 1);
  }
  if (![...visits.values()].some((count) => count >= 3)) {
    throw new Error('Nenhum cliente recorrente ficou com 3 ou mais visitas.');
  }
}

function outsideSeedWhere(phones: string[]): Prisma.AppointmentWhereInput {
  return {
    OR: [
      { customerPhone: null },
      { customerPhone: { notIn: phones } },
    ],
  };
}

async function ensureAvailability(barberId: string) {
  for (const dayOfWeek of WORK_DAYS) {
    await prisma.availability.upsert({
      where: { barberId_dayOfWeek: { barberId, dayOfWeek } },
      update: {},
      create: {
        barberId,
        dayOfWeek,
        startTime: WORK_START,
        endTime: WORK_END,
      },
    });
  }
}

async function ensureServices() {
  const created: string[] = [];

  for (const service of SERVICE_CATALOG) {
    const existing = await prisma.service.findFirst({
      where: { name: service.name },
      orderBy: { id: 'asc' },
    });

    if (!existing) {
      await prisma.service.create({ data: service });
      created.push(service.name);
    }
  }

  const rows = await prisma.service.findMany({ orderBy: { id: 'asc' } });
  const byName = new Map<string, Service>();
  for (const row of rows) {
    if (!byName.has(row.name)) byName.set(row.name, row);
  }

  return { byName, created };
}

async function main() {
  console.log('⏳ Iniciando o seed do banco de dados...');

  const adminPassword = await bcrypt.hash(dadosAdmin.password, 10);
  const rafaelPassword = await bcrypt.hash(RAFAEL.password, 10);

  const admin = await prisma.barber.upsert({
    where: { email: dadosAdmin.email },
    update: { password: adminPassword },
    create: {
      name: dadosAdmin.name,
      email: dadosAdmin.email,
      password: adminPassword,
      role: dadosAdmin.role,
    },
  });

  const rafaelBefore = await prisma.barber.findUnique({
    where: { email: RAFAEL.email },
    select: { id: true },
  });

  const rafael = await prisma.barber.upsert({
    where: { email: RAFAEL.email },
    update: {
      name: RAFAEL.name,
      role: RAFAEL.role,
      password: rafaelPassword,
    },
    create: {
      name: RAFAEL.name,
      email: RAFAEL.email,
      password: rafaelPassword,
      role: RAFAEL.role,
    },
  });

  await ensureAvailability(admin.id);
  await ensureAvailability(rafael.id);

  const { byName, created: createdServices } = await ensureServices();
  const phones: string[] = CLIENTS.map((client) => client.phone);
  const preservedBefore = await prisma.appointment.count({
    where: outsideSeedWhere(phones),
  });

  const preservedRows = await prisma.appointment.findMany({
    where: {
      ...outsideSeedWhere(phones),
      barberId: { in: [admin.id, rafael.id] },
      status: { in: [AppointmentStatus.PENDING, AppointmentStatus.CONFIRMED, AppointmentStatus.COMPLETED] },
    },
    select: { barberId: true, date: true, totalDuration: true },
  });

  const barberKeyById = new Map<string, BarberKey>([
    [admin.id, 'admin'],
    [rafael.id, 'rafael'],
  ]);

  const blocks: Block[] = preservedRows.flatMap((appointment) => {
    const barberKey = barberKeyById.get(appointment.barberId);
    if (!barberKey) return [];
    const clock = saoPauloClock(appointment.date);
    return [{
      barberKey,
      dayKey: clock.dayKey,
      start: clock.minutes,
      end: clock.minutes + appointment.totalDuration,
    }];
  });

  const now = new Date();
  const drafts = buildDrafts(byName, now, blocks);
  assertDrafts(drafts, now, blocks);

  const removed = await prisma.appointment.deleteMany({
    where: { customerPhone: { in: [...phones] } },
  });

  const barberId: Record<BarberKey, string> = {
    admin: admin.id,
    rafael: rafael.id,
  };

  for (const draft of drafts) {
    await prisma.appointment.create({
      data: {
        customerName: draft.client.name,
        customerPhone: draft.client.phone,
        date: draft.when,
        status: draft.status,
        isVip: draft.isVip,
        totalAmount: draft.amount,
        totalDuration: draft.duration,
        createdAt: draft.createdAt,
        updatedAt: draft.updatedAt,
        barberId: barberId[draft.barberKey],
        services: {
          connect: draft.combo.map((name) => ({ id: byName.get(name)!.id })),
        },
      },
    });
  }

  const [barberCount, serviceCount, appointmentCount, availabilityCount] = await Promise.all([
    prisma.barber.count(),
    prisma.service.count(),
    prisma.appointment.count(),
    prisma.availability.count(),
  ]);

  const preservedAfter = await prisma.appointment.count({
    where: outsideSeedWhere(phones),
  });
  if (preservedAfter !== preservedBefore) {
    throw new Error('O seed alterou agendamentos que não fazem parte da massa de desenvolvimento.');
  }

  const stored = await prisma.appointment.findMany({
    where: { barberId: { in: [admin.id, rafael.id] } },
    select: {
      date: true,
      status: true,
      barberId: true,
      customerPhone: true,
      totalDuration: true,
      services: { select: { id: true, name: true, duration: true } },
    },
  });

  const occupied = new Map<string, { start: number; end: number }[]>();
  for (const appointment of stored) {
    if (appointment.status === AppointmentStatus.CANCELLED) continue;
    const clock = saoPauloClock(appointment.date);
    const key = `${appointment.barberId}|${clock.dayKey}`;
    const start = clock.minutes;
    const end = start + appointment.totalDuration;
    const ranges = occupied.get(key) ?? [];
    if (ranges.some((range) => start < range.end && end > range.start)) {
      throw new Error(`Sobreposição gravada em ${key}.`);
    }
    ranges.push({ start, end });
    occupied.set(key, ranges);
  }

  const seedAppointments = stored.filter((appointment) =>
    phones.includes(appointment.customerPhone ?? ''),
  );
  const brokenServices = seedAppointments.filter((appointment) => {
    if (appointment.services.length === 0) return true;
    const names = appointment.services.map((service) => service.name);
    if (names.length === 1 && names[0] === 'sobrancelha') return true;
    const duration = appointment.services.reduce((sum, service) => sum + service.duration, 0);
    return duration !== appointment.totalDuration;
  }).length;

  const statusCount = {
    PENDING: 0,
    CONFIRMED: 0,
    COMPLETED: 0,
    CANCELLED: 0,
  };
  let past = 0;
  let future = 0;
  let rafaelAppointments = 0;

  for (const appointment of seedAppointments) {
    statusCount[appointment.status] += 1;
    if (appointment.date.getTime() < now.getTime()) past += 1;
    else future += 1;
    if (appointment.barberId === rafael.id) rafaelAppointments += 1;
  }

  if (brokenServices > 0) {
    throw new Error(`${brokenServices} agendamentos ficaram sem serviço válido.`);
  }

  if (past === 0 || future === 0 || rafaelAppointments === 0) {
    throw new Error('A validação final não encontrou passado, futuro ou agendamentos do novo barbeiro.');
  }

  const distinctClients = new Set(seedAppointments.map((appointment) => appointment.customerPhone)).size;

  console.log('\nResumo do seed:');
  console.log(JSON.stringify({
    barbeiros: barberCount,
    barbeiroNovo: rafaelBefore ? 'já existia, atualizado' : 'criado',
    servicos: serviceCount,
    servicosCriadosAgora: createdServices,
    disponibilidades: availabilityCount,
    agendamentosTotais: appointmentCount,
    agendamentosDoSeed: seedAppointments.length,
    agendamentosSeedSubstituidos: removed.count,
    agendamentosPreservados: preservedAfter,
    passados: past,
    futurosOuAgora: future,
    porStatus: statusCount,
    agendamentosDoRafael: rafaelAppointments,
    clientesRecorrentes: distinctClients,
  }, null, 2));
}

main()
  .then(async () => {
    await prisma.$disconnect();
    console.log('\n🚀 Seed finalizado com sucesso!');
  })
  .catch(async (error) => {
    console.error('\n❌ Erro ao rodar o seed:');
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
