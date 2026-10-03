import { cn } from "@/lib/utils";
import { bebasNeue } from "@/lib/fonts";
import { MapPin, Clock} from "lucide-react";

const Address = () => {
  return (
    <section className="bg-[var(--background-2)] py-24 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-16">
          <h2 className={cn(
            bebasNeue.className, 
            "text-5xl md:text-7xl text-white tracking-widest uppercase"
          )}>
            ONDE <span className="text-red-600">ENCONTRAR?</span>
          </h2>
          <div className="h-1 w-24 bg-red-600 mt-4"></div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-stretch">
          
          <div className="flex flex-col justify-center space-y-10 bg-white/5 p-8 md:p-12 rounded-2xl border border-white/5 backdrop-blur-sm">
            
            <div className="flex items-start gap-6">
              <div className="p-4 bg-red-600/10 rounded-lg">
                <MapPin className="text-red-600" size={28} />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl mb-2">Localização</h3>
                <address className="text-gray-400 not-italic leading-relaxed">
                  Rua Gabriel Nardes<br />
                  Centro — Sedran, BA<br />
                  CEP: 11111-000
                </address>
              </div>
            </div>

            <div className="flex items-start gap-6">
              <div className="p-4 bg-red-600/10 rounded-lg">
                <Clock className="text-red-600" size={28} />
              </div>
              <div>
                <h3 className="text-white font-bold text-xl mb-2">Horário de Atendimento</h3>
                <p className="text-gray-400">
                  Segunda a Sábado: <span className="text-white font-medium">08:30h às 18:30h</span>
                </p>
                <p className="text-red-600 text-sm mt-1 font-medium italic">
                  * Fechado aos Domingos
                </p>
              </div>
            </div>

          </div>

          <div className="relative w-full h-[400px] lg:h-auto rounded-2xl overflow-hidden grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition-all duration-700 shadow-2xl border border-white/10">
            <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d245796.23965527827!2d-48.10217077600516!3d-15.72115650730317!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x935a3d18df9ae275%3A0x738470e469754a24!2sBras%C3%ADlia%20-%20Plano%20Piloto%2C%20Bras%C3%ADlia%20-%20DF!5e0!3m2!1spt-BR!2sbr!4v1791068337366!5m2!1spt-BR!2sbr" width="600" height="450" style={{border:0}} allowFullScreen loading="lazy" referrerPolicy="strict-origin-when-cross-origin">
            </iframe>
          </div>

        </div>
      </div>
    </section>
  );
}

export default Address;