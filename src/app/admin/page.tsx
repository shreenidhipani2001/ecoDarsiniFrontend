"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import DashboardGrid from "./DashboardGrid";
import ProductsCatalogue from "./ProductsCatalogue";
import OrdersGrid from "./OrdersGrid";
import PaymentsList from "./PaymentsList";
import type { AdminSection } from "./types";
import RoleGuard from "../../components/RoleGuard";

export default function AdminLayout() {
  const [active, setActive] = useState<AdminSection>("dashboard");

  return (
    <RoleGuard allowedRole="ADMIN">
      <div className="flex min-h-screen bg-gray-900">
        <header className="sr-only">Admin Sidebar</header>
        <Sidebar active={active} setActive={setActive} />

        <main className="flex-1 min-h-screen bg-gradient-to-br from-gray-900 via-green-900 to-black">
          <div className="p-6">
            {active === "dashboard" && (
              <div>
                <h1 className="text-3xl font-bold text-green-400 mb-6">Dashboard</h1>
                <DashboardGrid />
              </div>
            )}
            {active === "products" && (
              <div>
                <h1 className="text-3xl font-bold text-green-400 mb-6">Product Catalogue</h1>
                <ProductsCatalogue />
              </div>
            )}
            {active === "orders" && (
              <div>
                <h1 className="text-3xl font-bold text-green-400 mb-6">Orders</h1>
                <OrdersGrid />
              </div>
            )}
            {active === "payments" && (
              <div>
                <h1 className="text-3xl font-bold text-green-400 mb-6">Payments</h1>
                <PaymentsList />
              </div>
            )}
            {active === "reviews" && (
              <div className="text-green-400 text-xl">Reviews coming soon</div>
            )}
            {active === "addresses" && (
              <div className="text-green-400 text-xl">Addresses coming soon</div>
            )}
          </div>
        </main>
      </div>
    </RoleGuard>
  );
}
