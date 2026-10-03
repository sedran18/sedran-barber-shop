import Image from "next/image";
import Link from "next/link";
import { NAME, PHONE } from '@/lib/constants';
import { FaTiktok, FaWhatsapp, FaInstagram } from "react-icons/fa"; 

const Footer = () => {
  return (
    <footer id="footer" className="bg-[var(--background-3)] border-t border-white/5 py-10 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
        
        <div className="flex items-center gap-4">
          <Image src='/logo.png' alt="Logo" width={40} height={40} className="rounded-full object-contain" />
          <div className="flex flex-col">
            <h2 className="text-white font-bold tracking-widest uppercase text-sm leading-tight">
              {NAME}
            </h2>
            <p className="text-gray-600 text-[9px] uppercase tracking-tighter">
              © 2026 Todos os direitos reservados.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-15">
          {[
            { Icon: FaInstagram, href: "https://www.instagram.com/__sedran__/" },
            { Icon: FaTiktok, href: ""},
            { Icon: FaWhatsapp, href: ``},
          ].map(({ Icon, href }, index) => (
            <Link 
              key={index}
              href={href} 
              target="_blank" 
              className="text-gray-500 hover:text-red-600 transition-colors"
            >
              <Icon size={30} />
            </Link>
          ))}
        </div>

        {/* Créditos Discretos */}
        <div className="text-right">
          <p className="text-gray-700 text-[9px] uppercase tracking-widest">
            Dev. by <span className="text-gray-500 font-medium">Gabriel Nardes</span>
          </p>
        </div>

      </div>
    </footer>
  );
};

export default Footer;