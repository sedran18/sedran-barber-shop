"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { signOut } from "next-auth/react";
import { MenuItemsType } from "@/lib/types";

const MenuDesktop = ({ isAdmin, menuItems }: { isAdmin: boolean, menuItems: MenuItemsType[] }) => {
  const pathname = usePathname();

  // Filtra os itens antes de renderizar
  const filteredItems = menuItems.filter(item => 
    !item.adminRoleRequired || (item.adminRoleRequired && isAdmin)
  );

  return (
    <aside className="hidden md:flex w-72 h-screen bg-[#121212] border-r border-white/5 flex-col p-6 sticky top-0">
      <div className="mb-10 px-4">
        <h1 className="text-white font-black tracking-tighter text-2xl uppercase italic">
          SEDRAN <span className="text-red-600 underline underline-offset-4">Admin</span>
        </h1>
      </div>

      <nav className="flex-1 space-y-2">
        {filteredItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-4 p-4 rounded-2xl transition-all duration-300",
                isActive ? "bg-red-600 text-white shadow-lg" : "text-gray-400 hover:bg-white/[0.03] hover:text-white"
              )}
            >
              <item.icon size={22} className={cn(isActive ? "text-white" : "text-red-600")} />
              <span className="font-bold text-sm uppercase tracking-wide">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <button 
        className="cursor-pointer flex items-center gap-4 px-4 py-4 mt-auto text-gray-500 hover:text-red-500 font-bold text-xs uppercase border-t border-white/5 transition-colors"
        onClick={() => signOut({ callbackUrl: "/login" })}
      >
        <LogOut size={18} /> Sair do Sistema
      </button>
    </aside>
  );
};

export default MenuDesktop;