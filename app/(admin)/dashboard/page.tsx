"use client";

import { useProductStore } from "@/lib/productStore";
import DashboardOverview from "../components/DashboardOverview";
import Supplier from "../components/Supplier";
import { Boxes, Box } from "lucide-react";
import { useEffect } from "react";
import React from "react";
export default function Home() {
  const { isLoading, error, products, getProducts } = useProductStore();
  useEffect(() => {
    getProducts();
  }, [products]);
  return (
    <div className="p-3">
      <DashboardOverview />
      <div className="product-overview">
        <h1 className="text-3xl shadow p-3 my-6">Product Overview</h1>
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="p-5">Product Name</th>
              <th className="p-5">Current Stock</th>
              <th className="p-5">Forecast (Next 30 Days)</th>
              <th className="p-5">Restock Date</th>
              <th className="p-5">Restock Quantity</th>
              <th className="p-5">Status</th>
            </tr>
          </thead>
          <tbody>
            {products &&
              products.map((product) => (
                <React.Fragment key={product.id}>
                  <tr className="font-semibold">
                    <td className="p-3 flex items-center gap-1">
                      <Boxes
                        size={40}
                        className="border rounded p-1 bg-gray-300 text-purple-900"
                      />
                      {product.name}
                    </td>
                    <td colSpan={5} className="p-3 text-gray-500">
                      All Variants ({product.variants})
                    </td>
                  </tr>
                  {Array.from({ length: product.variants }).map((_, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-3 pl-8 text-gray-700 flex items-center gap-1">
                        <Box
                          size={30}
                          className="border rounded bg-gray-300 text-green-900 p-1"
                        />{" "}
                        Variant {idx + 1}
                      </td>
                      <td className="p-3">{product.currentStock} units</td>
                      <td className="p-3">{product.forecast || "-"}</td>
                      <td className="p-3">{product.restockDate || "-"}</td>
                      <td className="p-3">{product.restockQuantity || "-"}</td>
                      <td>
                        <span
                          className={`p-3 rounded-4xl text-sm text-white ${
                            product.stockLevel === "Sufficient Stock"
                              ? "bg-green-500"
                              : product.stockLevel === "Restock Immediately"
                              ? "bg-yellow-500"
                              : product.stockLevel === "Out of Stock"
                              ? "bg-red-500"
                              : ""
                          }`}
                        >
                          {" "}
                          {product.stockLevel}
                        </span>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
          </tbody>
        </table>
      </div>
      <Supplier />
    </div>
  );
}
