import React from "react";
import LineChart from "./LineChart";
import { useRouter } from "next/navigation";
import { Blocks, SquareArrowOutUpRight } from "lucide-react";
export default function DashboardOverview() {
  const router = useRouter();
  return (
    <div className="general-container">
      <h1 className="text-3xl shadow p-3 my-6">Dashboard Overview</h1>
      <div className="grid grid-cols-[repeat(auto-fit,minmax(250px,1fr))] gap-4">
        <div className="bg-white shadow rounded-lg p-4 flex flex-col">
          <div className="text-sm text-gray-500">Low Stock Items</div>
          <div className="text-3xl font-bold mt-1">28</div>
          <div className="text-red-500 text-sm mt-1">+5 since yesterday</div>
        </div>
        <div
          className="bg-white shadow rounded-lg p-4 cursor-pointer hover:bg-gray-50"
          onClick={() => router.push("/sales")}
        >
          <div className="text-purple-500 font-semibold text-lg flex items-center gap-2">
            <SquareArrowOutUpRight />
            Go to Sales
          </div>
          <div className="text-sm text-gray-500">Input sales for products</div>
        </div>
        <div className="bg-white shadow rounded-lg p-4 cursor-pointer hover:bg-gray-50">
          <div className="text-purple-500 font-semibold text-lg flex items-center gap-2">
            <Blocks />
            Go To Products
          </div>
          <div
            className="text-sm text-gray-500"
            onClick={() => router.push("/products")}
          >
            All products in table
          </div>
        </div>
        <div className="bg-purple-500 text-white shadow rounded-lg p-4 flex items-center justify-center font-semibold cursor-pointer hover:bg-purple-600">
          Generate Forecast
        </div>
      </div>
      <div className="chart mt-12 border rounded p-6">
        <LineChart />
      </div>
    </div>
  );
}
