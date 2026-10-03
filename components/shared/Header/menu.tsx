import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { Menu as MenuIcon } from 'lucide-react';
import Image from "next/image";
import Link from "next/link";
import {NAME} from '@/lib/constants';

const Menu = () => {
  return (
    <>
        <nav className="hidden md:flex md:items-center gap-8 font-medium text-sm tracking-widest mx-7">
       
            <Link 
                href='/' 
                className="cursor-pointer relative group py-2 text-white hover:scale-105 transition-colors"
            >
                INÍCIO
            </Link>

            <a
                href='#footer' 
                className="cursor-pointer relative group py-2 text-white hover:scale-105 transition-colors"
            >
                CONTATO
            </a>
                 <Link 
                href='/agendamento' 
                className="cursor-pointer bg-red-600 text-white px-6 py-2 hover:scale-105 transition-all duration-300 transform hover:scale-105 active:scale-95 shadow-md"
            >
                AGENDAR
            </Link>
        </nav>

        <Sheet>
        <SheetTrigger asChild>
            <button className="p-2 hover:bg-gray-100 rounded-full transition-colors md:hidden">
            <MenuIcon size={28} className="text-white" />
            </button>
        </SheetTrigger>
        
        <SheetContent side="right" className="w-[300px] bg-white border-l shadow-xl p-0 ">
            <SheetHeader className="p-3 border-b">
            <div className="flex flex-col items-center gap-2">
                <Image src='/logo.png' alt='Logo' width={80} height={80} className="rounded-full priority" />
                <SheetTitle className="text-sm font-light tracking-widest text-gray-500 uppercase">
                Menu Principal
                </SheetTitle>
            </div>
            </SheetHeader>

            <nav className="flex flex-col mt-4">

                <SheetClose asChild > 
                    <Link
                    href='/'
                    className="px-8 py-6 text-right text-md font-medium tracking-tight text-gray-700 
                            hover:bg-gray-50 hover:scale-105 hover:pr-10 
                            transition-all duration-300 border-b border-gray-50 first:border-t"
                >
                    INÍCIO
                </Link>
                </SheetClose>


                <SheetClose asChild > 
                <a
                    href='#footer'
                    className="px-8 py-6 text-right text-md font-medium tracking-tight text-gray-700 
                            hover:bg-gray-50 hover:scale-105 hover:pr-10 
                            transition-all duration-300 border-b border-gray-50 first:border-t"
                    >
                    CONTATO
                </a>
                </SheetClose>

                <SheetClose asChild > 
                    <Link
                    href='/'
                    className="px-8 py-6 text-right text-md font-medium tracking-tight text-gray-700 
                            hover:bg-gray-50 hover:scale-105 hover:pr-10 
                            transition-all duration-300 border-b border-gray-50 first:border-t"
                >
                    AGENDAR
                </Link>
                </SheetClose>

            </nav>

            <div className="absolute bottom-10 w-full px-8 text-center">
            <p className="text-xs text-gray-400 font-light italic">
                © 2026 {NAME}
            </p>
            </div>
        </SheetContent>
        </Sheet>
    </>
  );
};

export default Menu;