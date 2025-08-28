"use client";

import { useProductStore } from "@/lib/productStore";
import { useEffect } from "react";
import { Package } from "lucide-react";
export default function page() {
  const { isLoading, error, getStocks, stocks } = useProductStore();
  useEffect(() => {
    getStocks();
  }, [stocks]);
  return (
    <div>
      <div className="header">
        <h1 className="text-3xl shadow p-6">Inventory Management</h1>
        <div className="actions my-6 flex justify-between p-4 items-center">
          <h1 className="label text-2xl">Stock Management</h1>
          <button className="border rounded-xl bg-purple-500 text-white px-4 py-3">
            Select for delivery
          </button>
        </div>
      </div>
      <div className="stocks-list p-3">
        <div className="criticalStock">
          <h1 className="text-red-600 font-semibold">{`Critical Stocks (5 units below)`}</h1>
          {stocks &&
            stocks.map((stock, index) => (
              <div key={index} className="my-2">
                {stock.remainingUnits < 5 ? (
                  <div className="border flex justify-between items-center p-6">
                    <div className="stock-details">
                      <h1>{stock.name}</h1>
                      <p className="text-[12px] text-gray-500">
                        Product id: {stock.id}
                      </p>
                    </div>
                    <div className="actions flex gap-3">
                      <span className="text-red-900 bg-red-300 rounded py-1 px-3">
                        {stock.remainingUnits} units
                      </span>
                      <button className="text-gray-500">Dismiss</button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))}
        </div>
        <div className="lowStock">
          <h1 className="text-yellow-600 font-semibold">{`Low stocks (6 - 20 units)`}</h1>
          {stocks &&
            stocks.map((stock, index) => (
              <div key={index} className="my-2">
                {stock.remainingUnits > 6 && stock.remainingUnits < 20 ? (
                  <div className="border flex justify-between items-center p-6">
                    <div className="stock-details">
                      <h1>{stock.name}</h1>
                      <p className="text-[12px] text-gray-500">
                        Product id: {stock.id}
                      </p>
                    </div>
                    <div className="actions flex gap-3">
                      <span className="text-yellow-900 bg-yellow-300 rounded py-1 px-3">
                        {stock.remainingUnits} units
                      </span>
                      <button className="text-gray-500">Dismiss</button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))}
        </div>
        <div className="healthyStock">
          <h1 className="text-green-600 font-semibold">{`Healthy stocks (20 units above)`}</h1>
          {stocks &&
            stocks.map((stock, index) => (
              <div key={index} className="my-2">
                {stock.remainingUnits > 20 ? (
                  <div className="border flex justify-between items-center p-6">
                    <div className="stock-details">
                      <h1>{stock.name}</h1>
                      <p className="text-[12px] text-gray-500">
                        Product id: {stock.id}
                      </p>
                    </div>
                    <div className="actions flex gap-3">
                      <span className="text-green-900 bg-green-300 rounded py-1 px-3">
                        {stock.remainingUnits} units
                      </span>
                      <button className="text-gray-500">Dismiss</button>
                    </div>
                  </div>
                ) : (
                  ""
                )}
              </div>
            ))}
        </div>
      </div>
    </div>
  );
}
