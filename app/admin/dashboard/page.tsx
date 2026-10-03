import { Suspense } from "react";
import { auth } from "@/auth";
import FiltroRange from "@/components/Admin/dashboard/filtroRange";
import DateInput from "@/components/shared/dateInput";
import DashboardContent from "@/components/Admin/dashboard/dashboardContent";
import Loading from "@/app/loading"; // Importe seu loading generalizado

const DashboardPage = async ({ searchParams }: {
  searchParams: Promise<{ date: string; range: string }>
}) => {
  const { range = "mes", date } = await searchParams;
  const session = await auth();
  const barberName = session?.user.name ?? '';

  return (
    <div className="container mx-auto space-y-8 pb-10">
      {/* O HEADER APARECE INSTANTANEAMENTE PORQUE NÃO TEM MAIS AWAIT PESADO AQUI */}
      <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h1 className="text-3xl font-black italic uppercase tracking-tight text-white">
            Olá, <span className="text-red-600">{barberName.split(' ')[0]}</span>
          </h1>
          <p className="mt-1 text-sm text-gray-500 font-medium">
            Acompanhe o desempenho em tempo real.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
          <FiltroRange path='/admin/dashboard'/>
          <div className="hidden h-8 w-[1px] bg-white/10 md:block" />
          <DateInput path="/admin/dashboard" />
        </div>
      </header>

      {/* O SUSPENSE ENVOLVE APENAS A PARTE QUE DEMORA.
          Isso vai disparar o seu loading.tsx generalizado apenas dentro dessa área,
          ou se você navegar para cá de outra página, o loading generalizado aparecerá
          enquanto o Next.js monta essa estrutura.
      */}
      <Suspense key={date + range} fallback={<Loading />}>
        <DashboardContent date={date} range={range} barberName={barberName} />
      </Suspense>
    </div>
  );
}

export default DashboardPage;

// import { DollarSign } from "lucide-react";
// import { formatBRL } from "@/lib/utils";
// import PerformanceChart from "@/components/Admin/dashboard/PerformanceChart";
// import { auth } from "@/auth";
// import FiltroRange from "@/components/Admin/dashboard/filtroRange";
// import DateInput from "@/components/shared/dateInput";
// import { getChartData, getFinancialData } from "@/lib/actions/barber";
// import StatsCard from "@/components/Admin/dashboard/statsCard";

// const DashboardPage = async ({ searchParams }: {
//   searchParams: Promise<{ date: string; range: string }>
// }) => {
//   const { range = "mes", date } = await searchParams; // Default range para "mes"
//   const session = await auth();
//   const barberName = session?.user.name;

//   const financialData = await getFinancialData({ date, range });
//   const chartData = await getChartData();
//   return (
//     <div className="container mx-auto space-y-8 pb-10">
//       {/* HEADER SECTION */}
//       <header className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
//         <div>
//           <h1 className="text-3xl font-black italic uppercase tracking-tight text-white">
//             Olá, <span className="text-red-600">{session?.user.name?.split(' ')[0]}</span>
//           </h1>
//           <p className="mt-1 text-sm text-gray-500 font-medium">
//             Acompanhe o desempenho da <span className="text-gray-300 italic">SEDRAN Barber Shop</span> em tempo real.
//           </p>
//         </div>

//         <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-white/10 bg-white/5 p-2 backdrop-blur-sm">
//           <FiltroRange path='/admin/dashboard'/>
//           <div className="hidden h-8 w-[1px] bg-white/10 md:block" />
//           <DateInput path="/admin/dashboard" />
//         </div>
//       </header>

//       {/* STATS GRID */}
//       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
//         {/* CARD DE ENTRADAS TOTAIS (Destaque) */}
//         <div className="group relative overflow-hidden rounded-[2.5rem] border border-red-600/20 bg-gradient-to-br from-red-600/10 to-transparent p-6 transition-all duration-300 hover:border-red-600/40">
//            <div className="relative z-10 flex h-full flex-col justify-between space-y-6">
//               <div className="flex items-center justify-between">
//                 <div className="rounded-2xl bg-red-600 p-3 text-white shadow-[0_0_20px_rgba(220,38,38,0.3)]">
//                   <DollarSign size={22} />
//                 </div>
//                 <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
//                   Total {range}
//                 </span>
//               </div>
//               <div>
//                 <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Faturamento Geral</p>
//                 <h3 className="text-4xl font-black tracking-tighter text-white">
//                   {formatBRL(financialData.totalGeral)}
//                 </h3>
//               </div>
//            </div>
//            <DollarSign size={150} className="absolute -bottom-10 -right-10 text-red-600/[0.05]" />
//         </div>

//         {/* LISTA DE BARBEIROS */}
//         {financialData.statsByBarber.map((item) => (
//           <StatsCard 
//             key={item.name}
//             label={item.name} 
//             barberLogged={barberName ?? ''}
//             value={formatBRL(item.rendimento)}
//             cuts={item.totalCuts}
//           />
//         ))}
//       </div>

//       {/* GRÁFICO SECTION */}
//       <section className="rounded-[2.5rem] border border-white/5 bg-zinc-900/30 p-1">
//          <PerformanceChart data={chartData}/>
//       </section>
//     </div>
//   );
// }

// export default DashboardPage;