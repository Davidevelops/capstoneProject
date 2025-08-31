"use client";

import { useEffect } from "react";
import { useProductStore } from "@/lib/productStore";
import { useRouter } from "next/navigation";
import {
  SquarePen,
  ChartLine,
  PackageCheck,
  Target,
  TriangleAlert,
  Settings,
} from "lucide-react";
import React from "react";
import LineChart from "@/app/(admin)/components/LineChart";

export default function page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const router = useRouter();
  const { product, getSingleProduct, isLoading, error } = useProductStore();
  useEffect(() => {
    getSingleProduct(id);
  }, [id]);
  return (
    <div>
      {product && (
        <div className="p-3">
          <div className="header border-b p-2">
            <div className="product-details">
              <h1 className="text-3xl">{product.name}</h1>
              <p className="text-sm text-gray-500 ms-1">Product ID: {id}</p>
            </div>
            <div className="actions flex gap-1 mt-2">
              <button className="flex p-2 rounded bg-purple-500 text-white gap-1 items-center text-sm">
                <ChartLine /> Generate Forecast
              </button>
              <button className="flex bg-gray-500 text-white p-1 rounded gap-1 items-center text-sm">
                <SquarePen />
                Edit Product
              </button>
              <button
                className="flex bg-gray-500 text-white p-1 rounded gap-1 items-center text-sm"
                onClick={() => router.push(`/dashboard/productSettings/${id}`)}
              >
                <Settings />
                Settings
              </button>
            </div>
          </div>
          <div className="grid grid-cols-[repeat(auto-fit,minmax(300px,1fr))] gap-3 justify-center mt-3">
            <div className="currentStock border flex justify-between p-12">
              <div>
                <p className="text-gray-500">Current Stock</p>
                <h1 className="text-xl font-semibold">
                  {product.currentStock}
                </h1>
                <p className="text-gray-500 flex gap-2">
                  <span className="text-green-500">+12</span>
                  since last week
                </p>
              </div>
              <PackageCheck
                size={40}
                className="bg-purple-500 rounded-full text-purple-100 p-1"
              />
            </div>
            <div className="forecastAccuracy border flex justify-between p-12">
              {" "}
              <div>
                <p className="text-gray-500">Forecast Accuracy</p>
                <h1 className="text-xl font-semibold">
                  {product.forecastAccuracy} %
                </h1>
                <p className="text-gray-500 flex gap-2">
                  <span className="text-green-500">+2.1%</span>
                  improvement
                </p>
              </div>
              <Target
                size={40}
                className="bg-purple-500 rounded-full text-purple-100 p-1"
              />
            </div>
            <div className="totalSales border flex justify-between p-12">
              {" "}
              <div>
                <p className="text-gray-500">Total Sales</p>
                <h1 className="text-xl font-semibold">{product.totalSales}</h1>
                <p className="text-gray-500 flex gap-2">
                  <span className="text-green-500">+18</span>
                  vs last month
                </p>
              </div>
              <ChartLine
                size={40}
                className="bg-purple-500 rounded-full text-purple-100 p-1"
              />
            </div>
            <div className="stockStatus border flex justify-between p-12">
              {" "}
              <div>
                <p className="text-gray-500">Stock Status</p>
                <h1
                  className={`text-xl font-semibold ${
                    product.stockLevel === "Sufficient Stock"
                      ? "text-green-500"
                      : product.stockLevel === "Restock Immediately"
                      ? "text-yellow-500"
                      : product.stockLevel === "Out of Stock"
                      ? "text-red-500"
                      : ""
                  }`}
                >
                  {product.stockLevel}
                </h1>
                <p className="text-gray-500 flex gap-2">
                  <span className="text-green-500">+12</span>
                  since last week
                </p>
              </div>
              <TriangleAlert
                size={40}
                className={`${
                  product.stockLevel === "Sufficient Stock"
                    ? "text-green-100 bg-green-700"
                    : product.stockLevel === "Restock Immediately"
                    ? "text-yellow-100 bg-yellow-700"
                    : product.stockLevel === "Out of Stock"
                    ? "text-red-100 bg-red-700"
                    : ""
                } rounded-full p-1`}
              />
            </div>
          </div>
          <div className="chart mt-3 mx-auto border rounded p-3 h-screen">
            <LineChart />
          </div>
        </div>
      )}
    </div>
  );
}
