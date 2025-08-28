"use client";

import { CirclePlus, SquareArrowOutUpRight, Trash } from "lucide-react";
import { useProductStore } from "@/lib/productStore";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import AddProduct from "@/app/(admin)/components/AddProductDialog";
export default function page() {
  const { products, isLoading, error, getProducts } = useProductStore();
  useEffect(() => {
    getProducts();
  }, []);
  const router = useRouter();
  return (
    <div>
      <div className="flex justify-between items-center p-4 bg-white shadow">
        <h1 className="text-3xl">Product Management</h1>
        <AddProduct />
      </div>
      <div className="mt-3">
        <div className="products bg-white flex justify-between items-center p-3">
          <h1 className="text-2xl">All Products</h1>
          <div className="actions flex gap-2">
            <input type="text" className="border" />
            <Select>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="light">Electronics</SelectItem>
                <SelectItem value="dark">Clothing</SelectItem>
                <SelectItem value="system">Foods</SelectItem>
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
                  <div
                    className={` rounded-3xl text-center py-1 px-3 text-sm ms-3 font-semibold w-[100px] ${
                      prod.status === "Active"
                        ? "bg-green-300 text-green-900"
                        : prod.status === "Low Stock"
                        ? "bg-yellow-300 text-yellow-900"
                        : prod.status === "Inactive"
                        ? "bg-red-300 text-red-900"
                        : ""
                    }`}
                  >
                    {prod.status}
                  </div>
                </td>
                <td className="items-center">
                  <div className="flex items-center gap-2 ms-4">
                    {" "}
                    <Link
                      href={`/dashboard/product-view/${prod.id}`}
                      className=""
                    >
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
