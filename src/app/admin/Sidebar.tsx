"use client";

import { useState } from "react";
import {
  Package,
  ShoppingCart,
  CreditCard,
  Star,
  MapPin,
  ChevronLeft,
   
} from "lucide-react";
import type { AdminSection } from "./types";
import Logo from "../../../public/svg/Logo";

const menu: {
  id: AdminSection;
  label: string;
  icon: React.ElementType;
}[] = [
  { id: "products", label: "Products", icon: Package },
  { id: "orders", label: "Orders", icon: ShoppingCart },
  { id: "payments", label: "Payments", icon: CreditCard },
  { id: "reviews", label: "Reviews", icon: Star },
  { id: "addresses", label: "Addresses", icon: MapPin },
];

interface SidebarProps {
  active: AdminSection;
  setActive: React.Dispatch<React.SetStateAction<AdminSection>>;
}

export default function Sidebar({ active, setActive }: SidebarProps) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    // <aside
    //   className={`bg-black text-white h-screen transition-all duration-300
    //   ${collapsed ? "w-20" : "w-64"}`}
    // >
    //   {/* Toggle */}
    //   <div className="flex justify-end p-4">
    //     <button onClick={() => setCollapsed(!collapsed)}>
    //       <ChevronLeft
    //         className={`transition-transform ${
    //           collapsed ? "rotate-180" : ""
    //         }`}
    //       />
    //     </button>
    //   </div>

    //   {/* Menu */}
    //   <ul className="flex flex-col gap-2 mt-4">
    //     {menu.map(({ id, label, icon: Icon }) => (
    //       <li
    //         key={id}
    //         onClick={() => setActive(id)}
    //         className={`flex items-center gap-4 px-4 py-3 cursor-pointer
    //         hover:bg-zinc-800 ${
    //           active === id ? "bg-zinc-800" : ""
    //         }`}
    //       >
    //         <Icon size={20} />
    //         {!collapsed && <span>{label}</span>}
    //       </li>
    //     ))}
    //   </ul>
    //   <Logo className="mx-auto my-4" width={20} height={20} />
    // </aside>
    <aside className={`bg-black text-white h-screen flex flex-col transition-all duration-300
  ${collapsed ? "w-20" : "w-64"}`}>

  {/* Toggle */}
  <div className="flex justify-end p-4">
    <button onClick={() => setCollapsed(!collapsed)}>
      <ChevronLeft
        className={`transition-transform ${collapsed ? "rotate-180" : ""}`}
      />
    </button>
  </div>

  {/* Menu */}
  <ul className="flex flex-col gap-2 mt-4">
    {menu.map(({ id, label, icon: Icon }) => (
      <li
        key={id}
        onClick={() => setActive(id)}
        className={`flex items-center gap-4 px-4 py-3 cursor-pointer
        hover:bg-zinc-800 ${active === id ? "bg-zinc-800" : ""}`}
      >
        <Icon size={20} />
        {!collapsed && <span>{label}</span>}
      </li>
    ))}
  </ul>

  {/* Logo fixed at bottom */}
  {/* <div className="mt-auto mb-4 flex justify-center">
    <Logo width={20} height={20} />
    
  </div> */}

  <div
  className={`mt-auto mb-4 flex transition-all
    ${collapsed ? "justify-center" : "justify-start pl-4"}`}
>
  <Logo className="w-8 h-auto" />
</div>
</aside>

  );
}
