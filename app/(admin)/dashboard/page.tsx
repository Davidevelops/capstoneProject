"use client";
import { useProductStore } from "@/lib/productStore";
import DashboardOverview from "../components/DashboardOverview";

import { Boxes, Box } from "lucide-react";
import { useEffect } from "react";
import React from "react";
import Supplier from "@/components/supplierSection";
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
        {/* <table className="w-full border-collapse">
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
                        className="border rounded p-1 bg-gray-300"
                      />
                      {product.name}
                    </td>
                    <td colSpan={5} className="p-3 text-gray-500">
                      All Variants ({product.variants})
                    </td>
                  </tr>
                  {Array.from({ length: product.variants }).map((_, idx) => (
                    <tr key={idx} className="border-b">
                      <td className="p-3 pl-8 flex items-center gap-1">
                        <Box size={25} /> Variant {idx + 1}
                      </td>
                      <td className="p-3">{product.currentStock} units</td>
                      <td className="p-3">{product.forecast || "-"}</td>
                      <td className="p-3">{product.restockDate || "-"}</td>
                      <td className="p-3">{product.restockQuantity || "-"}</td>
                      <td>
                        <div
                          className={`py-1 px-3 rounded-xl text-sm font-semibold w-[200px] text-center ${
                            product.stockLevel === "Sufficient Stock"
                              ? "bg-green-300 text-green-900"
                              : product.stockLevel === "Restock Immediately"
                              ? "bg-yellow-300 text-yellow-900"
                              : product.stockLevel === "Out of Stock"
                              ? "bg-red-300 text-red-900"
                              : ""
                          }`}
                        >
                          {" "}
                          {product.stockLevel}
                        </div>
                      </td>
                    </tr>
                  ))}
                </React.Fragment>
              ))}
          </tbody>
        </table> */}
      </div>
      <Supplier />
    </div>
  );
}
