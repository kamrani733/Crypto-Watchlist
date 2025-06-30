'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Trade {
  price: string;
  qty: string;
  time: number;
}

export default function TradesPage() {
  const { symbol } = useParams();
  const router = useRouter();
  const [trades, setTrades] = useState<Trade[]>([]);

  useEffect(() => {
    if (!symbol) return;

    fetch(`https://api.binance.com/api/v3/trades?symbol=${symbol}`)
      .then((res) => res.json())
      .then((data) => {
        setTrades(data);
      })
      .catch((err) => console.error(err));
  }, [symbol]);

  return (
    <main className="max-w-2xl mx-auto p-4 font-sans">
      <button
        onClick={() => router.back()}
        className="mb-4 px-4 py-2 bg-gray-300 rounded"
      >
        ← Back
      </button>

      <h1 className="text-2xl font-bold mb-4">Recent Trades: {symbol}</h1>

      {trades.length === 0 ? (
        <p className="text-gray-500">Loading trades...</p>
      ) : (
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 border">Price</th>
              <th className="p-2 border">Quantity</th>
              <th className="p-2 border">Time</th>
            </tr>
          </thead>
          <tbody>
            {trades.map((trade, i) => (
              <tr key={i} className="text-center">
                <td className="p-2 border text-green-600">{trade.price}</td>
                <td className="p-2 border">{trade.qty}</td>
                <td className="p-2 border text-sm">
                  {new Date(trade.time).toLocaleTimeString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </main>
  );
}
