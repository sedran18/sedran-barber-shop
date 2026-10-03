import GestaoHeader from "@/components/Admin/gestao/gestaoHeader";
import { getBarbersForGestao } from "@/lib/actions/barber";
import GestaoBarberCard from "@/components/Admin/gestao/gestaoBarberCard";
import { auth } from "@/auth";

export default async function GestaoFuncionarios() {
  const barbers =  await getBarbersForGestao();
  const data = barbers.data ?? [];
  const session = await auth();
  const role = session?.user.role;
  
  if (barbers.erro) {
    return (<div className="flex flex-col items-center justify-center p-10 border border-dashed border-red-500/20 rounded-[2rem] bg-red-500/[0.02] gap-3">
      <p className="text-red-500 text-xs font-black uppercase tracking-[0.2em] animate-pulse">
        ⚠️ Erro ao procurar barbeiros
      </p>
      <span className="text-gray-600 text-[10px] uppercase font-medium">
        Tente novamente mais tarde
      </span>
</div>)
  }
  return (
    <div className="space-y-8">
      <GestaoHeader />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {
          data.map(barber => <GestaoBarberCard 
                                key={barber.id} 
                                adminLogged={role === 'ADMIN'} 
                                name={barber.name} 
                                role={barber.role} 
                                email={barber.email}
                                id={barber.id}/>)
        }
      </div>

    </div>
  );
}