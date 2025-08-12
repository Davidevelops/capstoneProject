"use client";

import { CirclePlus, SquareArrowOutUpRight, Trash } from "lucide-react";
import { useProductStore } from "@/lib/productStore";
import { useEffect } from "react";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
export default function page() {
  const { products, isLoading, error, getProducts } = useProductStore();
  useEffect(() => {
    getProducts();
  }, []);
  return (
    <div>
      <div className="flex justify-between items-center p-4 bg-white border-b">
        <h1 className="text-3xl">Product Management</h1>
        <button className="bg-purple-500 flex px-2 py-3 text-white rounded-2xl gap-2">
          <CirclePlus /> Add New Product
        </button>
      </div>
      <div className="mt-3">
        <div className="products bg-white flex justify-between items-center p-3">
          <h1 className="text-2xl">All Products</h1>
          <div className="actions flex gap-2">
            <input type="text" className="border" />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Theme" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <table className="w-full">
          <thead className="border text-left">
            <tr>
              <th className="p-3">Name</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody className="">
            {products!.map((prod, index) => (
              <tr key={index} className="border">
                <td className="p-4">
                  <span>
                    <h1 className="font-semibold">{prod.name}</h1>
                    <p className="text-sm text-gray-500">
                      {prod.variants} variants - {prod.category}
                    </p>
                  </span>
                </td>
                <td>
                  <span
                    className={` rounded-3xl text-center py-1 px-3 text-sm ms-3 ${
                      prod.status === "Active"
                        ? "bg-green-500 text-green-100"
                        : prod.status === "Low Stock"
                        ? "bg-yellow-500 text-yellow-100"
                        : prod.status === "Inactive"
                        ? "bg-red-500 text-red-100"
                        : ""
                    }`}
                  >
                    {prod.status}
                  </span>
                </td>
                <td className="items-center">
                  <div className="flex items-center gap-2 ms-4">
                    {" "}
                    <Link href={`/product-view/${prod.id}`} className="">
                      <SquareArrowOutUpRight />
                    </Link>
                    <Link href={"/"} className="">
                      <Trash />
                    </Link>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
