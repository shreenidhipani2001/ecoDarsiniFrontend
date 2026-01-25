const payments = [
  { name: "Krrish", amount: 1200, status: "SUCCESS" },
  { name: "Abhaya", amount: 800, status: "FAILED" },
];

export default function PaymentsList() {
  return (
    <div className="bg-white rounded-xl shadow">
      <table className="w-full">
        <thead className="bg-zinc-100">
          <tr>
            <th className="p-3 text-left text-black">Payer Name</th>
            <th className="p-3 text-black">Amount</th>
            <th className="p-3 text-black">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.name} className="border-t">
              <td className="p-3 text-black">{p.name}</td>
              <td className="p-3 text-center text-black">₹{p.amount}</td>
              <td className="p-3 text-center text-black">{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
