import { DollarSign } from "lucide-react";
import { formatBRL } from "@/lib/utils";
import PerformanceChart from "@/components/Admin/dashboard/PerformanceChart";
import StatsCard from "@/components/Admin/dashboard/statsCard";
import { getChartData, getFinancialData } from "@/lib/actions/barber";

export default async function DashboardContent({ 
  date, 
  range, 
  barberName 
}: { 
  date?: string; 
  range: string; 
  barberName: string 
}) {
  const financialData = await getFinancialData({ date, range });
  const chartData = await getChartData();

  return (
    <div className="space-y-8">
      {/* STATS GRID */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="group relative overflow-hidden rounded-[2.5rem] border border-red-600/20 bg-gradient-to-br from-red-600/10 to-transparent p-6 transition-all duration-300 hover:border-red-600/40">
           <div className="relative z-10 flex h-full flex-col justify-between space-y-6">
              <div className="flex items-center justify-between">
                <div className="rounded-2xl bg-red-600 p-3 text-white">
                  <DollarSign size={22} />
                </div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-red-500">
                  Total {range}
                </span>
              </div>
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Faturamento Geral</p>
                <h3 className="text-4xl font-black tracking-tighter text-white">
                  {formatBRL(financialData.totalGeral)}
                </h3>
              </div>
           </div>
           <DollarSign size={150} className="absolute -bottom-10 -right-10 text-red-600/[0.05]" />
        </div>

        {financialData.statsByBarber.map((item) => (
          <StatsCard 
            key={item.name}
            label={item.name} 
            barberLogged={barberName}
            value={formatBRL(item.rendimento)}
            cuts={item.totalCuts}
          />
        ))}
      </div>

      <section className="rounded-[2.5rem] border border-white/5 bg-zinc-900/30 p-1">
         <PerformanceChart data={chartData}/>
      </section>
    </div>
  );
}