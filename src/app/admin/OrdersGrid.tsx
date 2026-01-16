const orders = Array.from({ length: 10 });

export default function OrdersGrid() {
  return (
    <div className="grid grid-cols-4 gap-4">
      {orders.map((_, i) => (
        <div
          key={i}
          className="bg-white p-4 rounded-xl shadow"
        >
          <img
            src="/placeholder.png"
            className="h-32 w-full object-cover rounded"
          />
          <h3 className="mt-2 font-semibold">
            Order #{i + 1}
          </h3>
          <p className="text-sm text-zinc-600">
            Qty: 2 | ₹1200
          </p>
        </div>
      ))}
    </div>
  );
}
