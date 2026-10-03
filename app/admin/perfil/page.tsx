import { 
  ShieldCheck,
} from "lucide-react";
import UpdateInfoPrimary from "@/components/Admin/perfil/updateInfoPrimary";
import UpdatePassword from "@/components/Admin/perfil/updatePassword";
import { auth } from "@/auth";

export default async function PerfilPage() {
  const session = await auth();
  const name = session?.user.name;
  const isAdmin = session?.user.role === 'ADMIN';
  const email = session?.user.email;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-white uppercase tracking-tighter italic">
          Meu <span className="text-red-600">Perfil</span>
        </h1>
        <p className="text-gray-500 text-sm">Gerencie suas informações pessoais e segurança da conta.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <div className="space-y-6">
          <div className="bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col items-center text-center">
            <div className="relative group">
            </div>
            
            <div className="mt-4">
              <h3 className="text-white font-bold uppercase tracking-tight text-lg">{name}</h3>
              <div className="flex items-center justify-center gap-1 mt-1">
                <ShieldCheck size={14} className="text-red-600" />

                {isAdmin && 
                  <span className="text-[10px] text-gray-500 font-black uppercase tracking-[0.2em]">Administrador</span>
                }
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          
          <UpdateInfoPrimary email={email ?? ''} name={name ?? ''}/>

          <UpdatePassword />
          
        </div>
      </div>
    </div>
  );
}