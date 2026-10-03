"use client";

import { CalendarDays, LayoutDashboard, UserCircle, Users2 } from "lucide-react";
import MenuDesktop from "./menuDesktop";
import MenuMobile from "./menuMobile";
import { MenuItemsType } from "@/lib/types";

  const menuItems:MenuItemsType[] = [
    { label: "Dashboard", icon: LayoutDashboard, href: "/admin/dashboard", adminRoleRequired: true },
    { label: "Agenda", icon: CalendarDays, href: "/admin/agenda", adminRoleRequired: false },
    { label: "Gestão", icon: Users2, href: "/admin/gestao", adminRoleRequired: true },
    { label: "Perfil", icon: UserCircle, href: "/admin/perfil", adminRoleRequired: false },
  ];

const MenuAdmin = ({userRole}: {userRole:  'ADMIN' | 'EMPLOYEE'}) => {

  const isAdmin = userRole === 'ADMIN';
  return ( 
    <>
      <MenuMobile isAdmin={isAdmin} menuItems={menuItems}/>
      <MenuDesktop isAdmin={isAdmin} menuItems={menuItems}/>
    </>
  );
};

export default MenuAdmin;