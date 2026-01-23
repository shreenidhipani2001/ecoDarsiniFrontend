"use client";

import { useState } from "react";
import {
  LayoutDashboard,
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
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
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
    <aside
      className={`bg-black text-white min-h-screen flex flex-col transition-all duration-300 border-r border-green-900/30
      ${collapsed ? "w-20" : "w-64"}`}
    >
      {/* Header with Toggle */}
      <div className="flex justify-between items-center p-4 border-b border-green-900/30">
        {!collapsed && (
          <h2 className="text-green-400 font-bold text-lg">Admin Panel</h2>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="p-2 rounded-lg hover:bg-green-900/20 transition-colors"
        >
          <ChevronLeft
            className={`transition-transform text-green-400 ${
              collapsed ? "rotate-180" : ""
            }`}
            size={20}
          />
        </button>
      </div>

      {/* Menu */}
      <nav className="flex-1 py-4">
        <ul className="flex flex-col gap-1 px-2">
          {menu.map(({ id, label, icon: Icon }) => (
            <li key={id}>
              <button
                onClick={() => setActive(id)}
                className={`flex items-center gap-4 w-full px-4 py-3 rounded-lg cursor-pointer
                  transition-all duration-200
                  ${
                    active === id
                      ? "bg-green-900/40 text-green-400 shadow-lg shadow-green-900/20"
                      : "text-gray-300 hover:bg-green-900/20 hover:text-green-400"
                  }`}
              >
                <Icon
                  size={20}
                  className={active === id ? "text-green-400" : ""}
                />
                {!collapsed && (
                  <span className="font-medium">{label}</span>
                )}
              </button>
            </li>
          ))}
        </ul>
      </nav>

      {/* Logo at bottom */}
      <div
        className={`mb-4 flex transition-all border-t border-green-900/30 pt-4
          ${collapsed ? "justify-center" : "justify-start pl-4"}`}
      >
        <Logo className="w-8 h-auto text-green-400" />
      </div>
    </aside>
  );
}
