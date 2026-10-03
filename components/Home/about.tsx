import Image from "next/image";
import Link from "next/link";
import { bebasNeue } from "@/lib/fonts";
import { cn } from "@/lib/utils";

const About = () => {
  return (
    <section id="sobre" className="bg-[var(--background-3)] py-20 px-5 lg:px-12 overflow-hidden">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 lg:mb-20">
          <h2 className={cn(
            bebasNeue.className, 
            "text-[43px] md:text-7xl lg:text-8xl text-white/10 leading-none uppercase select-none"
          )}>
            SALÃO DE QUALIDADE
          </h2>
          <h3 className="text-red-600 font-bold tracking-[0.3em] text-sm -mt-6 md:-mt-10 md:ml-2 uppercase">
            A Experiência SEDRAN
          </h3>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative group">
            <div className="relative h-[450px] md:h-[600px] w-full overflow-hidden rounded-sm grayscale hover:grayscale-0 transition-all duration-700">
              <Image 
                src='/barber.png' 
                alt="Foto do Barbeiro" 
                fill
                className="object-cover"
              />
            </div>
            <div className="absolute -bottom-4 -right-4 w-full h-full border-2 border-red-600/30 -z-10 group-hover:bottom-0 group-hover:right-0 transition-all duration-500"></div>
          </div>

          <div className="flex flex-col gap-6 text-gray-300">
            <div className="space-y-4">
              <p className="text-xl text-white font-medium leading-relaxed">
                Aqui na <span className="text-red-600 font-bold uppercase">SEDRAN Barber Shop</span>, 
                oferecemos cortes de cabelo, barba e sobrancelha com precisão e qualidade.
              </p>
              
              <p className="leading-relaxed">
                Além do atendimento profissional, o espaço conta com <span className="text-white border-b border-red-600/30">mesa de sinuca</span> e 
                <span className="text-white border-b border-red-600/30"> bebidas selecionadas</span> para tornar a experiência mais agradável enquanto você espera ou relaxa após o corte.
              </p>
              
              <p className="italic text-gray-400">
                Aqui, cada cliente é tratado como parte da casa.
              </p>
            </div>

            <div className="pt-6">
              <Link href='/agendamento' className="inline-block group">
                <button className="cursor-pointer bg-red-600 text-white font-bold px-10 py-4 tracking-widest hover:bg-red-700 transition-all transform group-hover:-translate-y-1 shadow-xl">
                  AGENDAR AGORA
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default About;