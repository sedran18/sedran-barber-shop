'use client';

import Image from "next/image";
import Menu from "./menu";
import Link from "next/link";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";

const Header = () => {
  const [isHero, setIsHero] = useState(true);

  useEffect(() => {
        const onScroll = () => {
        setIsHero(window.scrollY < 80);
        };

        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
    }, []);

  return (
    <header className={cn("sticky md:fixed  top-0",
      "z-50 w-full h-26  transition-all",
    "duration-300", isHero ? "bg-[var(--background-primary)] md:bg-[var(--background-primary)]/6 md:h-30" : "bg-[var(--background-primary)]"
    )}>
      <div className="max-w-7xl mx-auto h-full px-4 flex items-center justify-between">
        
        <Link href="/" className="flex items-center gap-4 hover:opacity-90 transition-opacity">
          <div className="relative group">
            <div className="absolute -inset-1 bg-red-500 rounded-full opacity-20 blur group-hover:opacity-40 transition duration-300"></div>
            <Image 
              src='/logo.png' 
              alt='SEDRAN' 
              width={50} 
              height={50} 
              className="relative object-contain rounded-full"
              priority
            />
          </div>
          
          <h1 className="flex flex-col border-l border-white/10 
          pl-4 text-xl font-black tracking-tighter text-white leading-tight">
              SEDRAN
            <span className="text-[10px] font-bold tracking-[0.3em] text-red-600 uppercase leading-none">
              BARBER SHOP
            </span>
          </h1>
        </Link>

        <div className="flex items-center gap-6">
          <Menu />
        </div>

      </div>
    </header>
  );
};

export default Header;