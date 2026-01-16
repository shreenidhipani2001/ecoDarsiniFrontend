"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import ProductsCatalogue from "./ProductsCatalogue";
import OrdersGrid from "./OrdersGrid";
import PaymentsList from "./PaymentsList";
import type { AdminSection } from "./types";

export default function AdminLayout() {
  const [active, setActive] = useState<AdminSection>("products");

  return (
    <div className="flex min-h-screen bg-zinc-100">
      <header className="sr-only">Admin Sidebar</header>
      <Sidebar active={active} setActive={setActive} />
 
      <main className="flex-1 p-6">
        {active === "products" && <ProductsCatalogue />}
        {active === "orders" && <OrdersGrid />}
        {active === "payments" && <PaymentsList />}
        {active === "reviews" && <div>Reviews coming soon</div>}
        {active === "addresses" && <div>Addresses coming soon</div>}
      </main> 
      
    </div>
  );
}