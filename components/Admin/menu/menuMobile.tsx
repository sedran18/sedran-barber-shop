"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, LogOut } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { signOut } from "next-auth/react";
import { MenuItemsType } from "@/lib/types";

const MenuMobile = ({ isAdmin, menuItems }: { isAdmin: boolean, menuItems: MenuItemsType[] }) => {
  const pathname = usePathname();

  const filteredItems = menuItems.filter(item => 
    !item.adminRoleRequired || (item.adminRoleRequired && isAdmin)
  );

  return (
    <div className="md:hidden flex items-center justify-between p-4 bg-[#121212] border-b border-white/5 sticky top-0 z-50">
      <h1 className="text-white font-black tracking-tighter text-xl uppercase italic">
        SEDRAN <span className="text-red-600">Admin</span>
      </h1>

      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="text-white hover:bg-white/5">
            <Menu size={28} />
          </Button>
        </SheetTrigger>
        <SheetContent side="right" className="w-[300px] bg-[#121212] border-l border-white/5 p-6 flex flex-col text-white">
          <SheetHeader className="text-left mb-8">
            <SheetTitle className="text-white font-black tracking-tighter text-2xl uppercase italic">Menu</SheetTitle>
          </SheetHeader>

          <nav className="flex-1 space-y-3">
            {filteredItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <SheetClose asChild key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-2xl transition-all duration-300",
                      isActive ? "bg-red-600 text-white" : "text-gray-400"
                    )}
                  >
                    <item.icon size={20} className={cn(isActive ? "text-white" : "text-red-600")} />
                    <span className="font-bold text-sm uppercase tracking-wide">{item.label}</span>
                  </Link>
                </SheetClose>
              );
            })}
          </nav>

          <button 
            className="flex items-center gap-4 px-4 py-4 mt-auto text-red-500 font-bold text-xs uppercase border-t border-white/5"
            onClick={() => signOut({ callbackUrl: "/login" })}
          >
            <LogOut size={18} /> Sair
          </button>
        </SheetContent>
      </Sheet>
    </div>
  );
};

export default MenuMobile;