"use client";

import { ProductGroup, SingleProduct } from "@/lib/types";
import Link from "next/link";
interface Props {
  productGroups: ProductGroup[];
}

export default function ProductList({ productGroups }: Props) {
  if (!productGroups || productGroups.length === 0) {
    return <div>No products found.</div>;
  }
  return (
    <div className="space-y-6">
      {productGroups.map((group) => (
        <div key={group.id} className="border rounded-lg p-4">
          <h2 className="text-xl font-bold mb-3">{group.name}</h2>
          <div className="grid gap-2">
            {group.products.map((product) => (
              <Link
                href={`/dashboard/product-view/${product.groupId}/${product.id}`}
                className="bg-gray-50"
              >
                <div>
                  <span className="font-medium">{product.name}</span>
                  <span className="text-sm text-gray-500 ml-2">
                    (Stock: {product.stock}, Safety: {product.safetyStock})
                  </span>
                </div>
                <div className="text-sm text-gray-500">
                  {new Date(product.updatedAt).toLocaleDateString()}
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
