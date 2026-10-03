import { Mail, ShieldCheck, Users } from "lucide-react"
import DeleteBarberBtn from "./deleteBarberBtn"

interface GestaoBarberCardProps {
  name: string;
  role: 'EMPLOYEE' | 'ADMIN';
  email: string;
  adminLogged: boolean; 
  id: string
}

const GestaoBarberCard = ({ name, role, email, adminLogged, id }: GestaoBarberCardProps) => {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6 relative overflow-hidden group transition-all hover:border-red-600/20">
      <div className="flex justify-between items-start relative z-10">
        <div className="flex gap-4">
          <div className="h-14 w-14 rounded-2xl bg-red-600/10 flex items-center justify-center border border-red-600/20 group-hover:bg-red-600 transition-colors duration-500">
            <Users className="text-red-600 group-hover:text-white transition-colors" size={24} />
          </div>

          <div>
            <h3 className="text-white font-bold uppercase tracking-tight flex items-center gap-2">
              {name}
              {role === "ADMIN" && (
                <span className="flex items-center gap-1 text-[10px] text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20">
                  <ShieldCheck size={12} /> ADMIN
                </span>
              )}
            </h3>
            <p className="text-gray-500 text-xs flex items-center gap-1 mt-1">
              <Mail size={12} /> {email}
            </p>
          </div>
        </div>

        {adminLogged && role !== 'ADMIN' && (
          <DeleteBarberBtn id={id}/>
        )}
      </div>

      <div className="absolute -right-4 -bottom-4 text-white/[0.02] transform rotate-12 group-hover:text-red-600/[0.04] transition-all duration-500 pointer-events-none">
        <Users size={120} />
      </div>
    </div>
  )
}

export default GestaoBarberCard