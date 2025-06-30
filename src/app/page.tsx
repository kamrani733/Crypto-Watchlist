"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function Home() {
  const [symbols, setSymbols] = useState<{ symbol: string }[]>([]);
  const [watchlist, setWatchlist] = useState<string[]>([]);
  const [prices, setPrices] = useState<{ [symbol: string]: string }>({});
  const [search, setSearch] = useState<string>("");

  useEffect(() => {
    fetch("https://api.binance.com/api/v3/exchangeInfo")
      .then((res) => res.json())
      .then((data) => {
        const usdtPairs = data.symbols.filter((item: { symbol: string }) =>
          item.symbol.endsWith("USDT")
        );
        setSymbols(usdtPairs);
      });
  }, []);

  const handleAdd = (symbol: string) => {
    if (!watchlist.includes(symbol)) {
      setWatchlist((prev) => [...prev, symbol]);

      const socket = new WebSocket(
        `wss://stream.binance.com:9443/ws/${symbol.toLowerCase()}@trade`
      );

      socket.onmessage = (event: MessageEvent) => {
        const data = JSON.parse(event.data);
        setPrices((prevPrices) => ({
          ...prevPrices,
          [symbol]: data.p,
        }));
      };
    }
  };

  const handleRemove = (symbol: string) => {
    setWatchlist((prev) => prev.filter((s) => s !== symbol));
    setPrices((prev) => {
      const updated = { ...prev };
      delete updated[symbol];
      return updated;
    });
  };

  const filteredSymbols = symbols.filter((s) =>
    s.symbol.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="max-w-3xl mx-auto p-4 font-sans">
      <h1 className="text-2xl font-bold mb-4 text-center">Crypto Watchlist</h1>

      <input
        type="text"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        placeholder="Search pair..."
        className="w-full p-2 border rounded mb-4"
      />

      <section className="mb-6">
        <h2 className="text-xl font-semibold mb-2">All Pairs</h2>
        <ul className="grid grid-cols-2 gap-2 max-h-48 overflow-y-scroll">
          {filteredSymbols.map((s) => (
            <li
              key={s.symbol}
              className="flex justify-between items-center p-2 border rounded hover:bg-gray-100"
            >
              <span>{s.symbol}</span>
              <div className="space-x-2">
                <button
                  onClick={() => handleAdd(s.symbol)}
                  className="text-sm px-2 py-1 bg-blue-500 text-white rounded"
                >
                  Add
                </button>
                <Link
                  href={`/trades/${s.symbol}`}
                  className="text-sm px-2 py-1 bg-gray-200 rounded"
                >
                  Trades
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-2">Watchlist</h2>
        {watchlist.length === 0 ? (
          <p className="text-gray-500">No pairs added.</p>
        ) : (
          <ul className="space-y-2">
            {watchlist.map((s) => (
              <li
                key={s}
                className="flex justify-between items-center p-2 border rounded"
              >
                <span>{s}</span>
                <div className="flex items-center space-x-2">
                  <span className="text-green-600 font-bold">
                    {prices[s] ?? "Loading..."}
                  </span>
                  <button
                    onClick={() => handleRemove(s)}
                    className="text-xs px-2 py-1 bg-red-500 text-white rounded"
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
