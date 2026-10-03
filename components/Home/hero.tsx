import Image from "next/image";
import Link from "next/link"; // Importe o Link do Next.js para o botão CTA
import { bebasNeue } from "@/lib/fonts";
import { cn } from "@/lib/utils";

const Hero = () => {
  return (
    <section className="relative h-[80vh] md:h-[100vh] w-full flex items-center justify-center text-center overflow-hidden">
      <Image
        src='/home/hero.png'
        alt="Barbearia Fundo"
        layout="fill" 
        objectFit="cover" 
        quality={90} 
        priority 
        className="z-0" 
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/40 to-black/70 z-10"></div>

      <div className="relative z-20 flex flex-col items-center justify-center p-4  mx-auto">
        <Image 
          src='/logo.png' 
          alt="SEDRAN Barber Shop Logo" 
          width={180} 
          height={180} 
          className="mb-8 rounded-full lg:w-[250px]" 
        />

        <p className={cn("text-white text-3xl md:text-5xl font-extrabold mb-10  tracking-wide drop-shadow-2xl", 
            bebasNeue.className
        )}>
          Sua melhor versão  começa aqui.
        </p>

        <Link href='/agendamento' passHref>
          <button 
            className="cursor-pointer inline-flex items-center justify-center px-10 py-4 
                             bg-red-600 text-white text-lg font-bold uppercase tracking-wider 
                             shadow-lg hover:bg-red-700 
                             transform hover:scale-105 transition-all duration-300 ease-out 
                             active:scale-95 focus:outline-none focus:ring-4 focus:ring-red-300">
            Agendar Horário
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Hero;