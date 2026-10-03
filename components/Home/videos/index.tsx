import Image from "next/image";
import { bebasNeue } from "@/lib/fonts";
import { cn } from "@/lib/utils";
import VideoCard from "./videoCard";

const videosURL = ["video1.mp4", "video2.mp4", "video3.mp4"];

const Videos = () => {
  return (
    <section className="relative pt-32  px-6 overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <Image
          src='/home/second_back.png'
          alt="Textura de barbearia"
          fill
          className="object-cover opacity-15 scale-110"
        />
        <div className="absolute inset-0 bg-[radial-gradient(circle,_transparent_20%,_var(--background-2)_80%)]"></div>
      </div>

      <div className="absolute top-0 left-0 w-full h-40 bg-gradient-to-b from-[var(--background-2)] to-transparent z-10"></div>
      <div className="absolute bottom-0 left-0 w-full h-40 bg-gradient-to-t from-[var(--background-2)] to-transparent z-10"></div>

      <div className="relative z-20 max-w-6xl mx-auto">
        <div className="text-center mb-20 relative">
          <span className={cn(
            bebasNeue.className,
            "absolute left-1/2 -translate-x-1/2 -top-10 text-8xl md:text-[12rem] text-white/[0.03] select-none whitespace-nowrap"
          )}>
            STYLE & CUT
          </span>
          <h2 className={cn(
            bebasNeue.className,
            "text-5xl md:text-8xl text-white tracking-tighter uppercase leading-none"
          )}>
            CONFIRA NOSSAS <br />
            <span className="text-red-600 drop-shadow-[0_0_15px_rgba(220,38,38,0.5)]">
              TRANSFORMAÇÕES
            </span>
          </h2>
          <div className="h-1 w-40 bg-red-600 mx-auto mt-6 relative">
            <div className="absolute inset-0 bg-red-600 blur-sm"></div>
          </div>
        </div>

        <div className="flex flex-wrap justify-center gap-8 md:gap-10">
          {videosURL.map((v) => (
            <div
              key={v}
              className="w-full max-w-[280px] transition-all duration-500 hover:scale-[1.02]"
            >
              <VideoCard src={`/home/${v}`} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Videos;