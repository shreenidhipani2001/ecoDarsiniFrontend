const payments = [
  { id: "pay_1", amount: 1200, status: "SUCCESS" },
  { id: "pay_2", amount: 800, status: "FAILED" },
];

export default function PaymentsList() {
  return (
    <div className="bg-white rounded-xl shadow">
      <table className="w-full">
        <thead className="bg-zinc-100">
          <tr>
            <th className="p-3 text-left">Payment ID</th>
            <th className="p-3">Amount</th>
            <th className="p-3">Status</th>
          </tr>
        </thead>
        <tbody>
          {payments.map((p) => (
            <tr key={p.id} className="border-t">
              <td className="p-3">{p.id}</td>
              <td className="p-3 text-center">₹{p.amount}</td>
              <td className="p-3 text-center">{p.status}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
