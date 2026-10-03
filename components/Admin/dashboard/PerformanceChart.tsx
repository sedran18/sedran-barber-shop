"use client";

import { TrendingUp } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  Legend 
} from 'recharts'; 

interface PerformanceData {
  mes: string;
  [key: string]: string | number; 
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

const PerformanceChart = ({ data }: PerformanceChartProps) => {
  const keys = data.length > 0 
    ? Object.keys(data[0]).filter(key => key !== 'mes') 
    : [];

  const colors = ["#dc2626", "#e2ddddf3", "#4b5563"];

  return (
    <div className="bg-white/5 border border-white/10 rounded-3xl p-6 md:p-10">
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-white font-bold uppercase tracking-widest flex items-center gap-2 text-sm md:text-base">
          <TrendingUp size={18} className="text-red-600" />
          Performance (6 Meses)
        </h2>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#ffffff05" />
            <XAxis 
              dataKey="mes" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#4b5563', fontSize: 10, fontWeight: 'bold' }}
              dy={10}
            />
            <YAxis 
              axisLine={false} 
              tickLine={false} 
              tick={{ fill: '#7989a0', fontSize: 10}}
              tickFormatter={(value) => `R$${value}`} 
            />
            <Tooltip 
              cursor={{ fill: '#ffffff05' }}
              contentStyle={{ 
                backgroundColor: '#121212', 
                border: '1px solid #e2caca10', 
                borderRadius: '12px',
                fontSize: '12px',
                textTransform: 'uppercase'
              }}
              itemStyle={{ fontWeight: 'bold' }}
            />
            <Legend 
              verticalAlign="top" 
              align="right" 
              iconType="circle"
              wrapperStyle={{ paddingBottom: '20px', fontSize: '10px', textTransform: 'uppercase', fontWeight: 'bold' }}
            />

            {keys.map((barber, index) => (
              <Bar 
                key={barber}
                name={barber.toUpperCase()} 
                dataKey={barber} 
                fill={colors[index % colors.length]} 
                radius={[4, 4, 0, 0]} 
                barSize={15}
              />
            ))}
          </BarChart>
        </ResponsiveContainer>
      </div>

      <div className="mt-6 pt-6 border-t border-white/5">
        <p className="text-[10px] text-gray-600 uppercase font-black tracking-widest flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
          Dados reais do banco de dados
        </p>
      </div>
    </div>
  );
};

export default PerformanceChart;