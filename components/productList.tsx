"use client";

import { ProductGroup } from "@/lib/types";
import {
  Archive,
  NotebookPen,
  BarChart3,
  TrendingUp,
  Package,
  Shield,
  Calendar,
  MoreVertical,
  Edit3,
  Trash2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface Props {
  productGroups: ProductGroup[];
}

export default function ProductList({ productGroups }: Props) {
  const [productName, setProductName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setIsLoading] = useState<boolean>(false);
  const [open, setIsOpen] = useState<boolean>(false);
  const router = useRouter();
  const api_url = process.env.NEXT_PUBLIC_PRODUCT_API as string;

  const handleArchiveProduct = async (id: string) => {
    setIsLoading(true);
    setError("");
    try {
      const response = await axios.delete(`${api_url}/${id}`);
      setError("");
      router.refresh();
    } catch (error) {
      console.error(
        "An error occured while trying to archive the product: ",
        error
      );
      setError("An error occured while trying to archive the product");
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDetails = async (groupId: string) => {
    if (!productName.trim()) {
      setError("Please provide a name.");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.patch(`${api_url}/${groupId}`, {
        name: productName,
      });

      setError("");
      setIsOpen(false);
      setProductName("");
      router.refresh();
    } catch (error) {
      console.error("An error while trying to update product: ", error);
      setError("An error while trying to update product");
    } finally {
      setIsLoading(false);
    }
  };

  if (!productGroups || productGroups.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="mx-auto h-16 w-16 text-purple-300 mb-4" />
        <h3 className="text-lg font-semibold text-gray-600">
          No products found
        </h3>
        <p className="text-gray-500">
          Start by adding your first product group
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {productGroups.map((group) => (
        <div
          key={group.id}
          className="bg-gradient-to-br from-white to-purple-50 border border-purple-100 rounded-2xl p-6 shadow-sm hover:shadow-md transition-all duration-300"
        >
          <div className="flex justify-between items-start mb-6">
            <div className="flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-xl">
                <BarChart3 className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {group.name}
                </h2>
                <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                  <div className="flex items-center gap-1">
                    <Package className="h-4 w-4" />
                    <span>{group.products.length} products</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TrendingUp className="h-4 w-4" />
                    <span>Forecast Ready</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <Dialog open={open} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
                  >
                    <Edit3 className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                </DialogTrigger>
                <DialogContent className="bg-white">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2 text-purple-900">
                      <NotebookPen className="h-5 w-5" />
                      Update Product Group
                    </DialogTitle>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-gray-700">Group Name</Label>
                      <Input
                        value={productName}
                        onChange={(e) => setProductName(e.target.value)}
                        className="mt-1 border-purple-200 focus:border-purple-500"
                        placeholder="Enter new group name..."
                      />
                    </div>
                    {error && (
                      <div className="text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                        {error}
                      </div>
                    )}
                    <Button
                      className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                      onClick={() => handleUpdateDetails(group.id)}
                    >
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-red-200 text-red-600 hover:bg-red-50 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Archive
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent className="bg-white">
                  <AlertDialogHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="bg-red-100 p-2 rounded-full">
                        <Archive className="h-6 w-6 text-red-600" />
                      </div>
                      <AlertDialogTitle className="text-gray-900">
                        Archive Product Group?
                      </AlertDialogTitle>
                    </div>
                    <AlertDialogDescription className="text-gray-600">
                      This will archive the entire "
                      <strong>{group.name}</strong>" group including all{" "}
                      {group.products.length} products. Archived data is
                      preserved for analytics and can be restored later.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel className="border-gray-300 hover:bg-gray-50">
                      Cancel
                    </AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                      onClick={() => handleArchiveProduct(group.id)}
                    >
                      Confirm Archive
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="grid gap-3">
            {group.products.map((product, i) => (
              <Link
                href={`/dashboard/product-view/${product.groupId}/${product.id}`}
                className="bg-white border border-purple-100 rounded-xl p-4 hover:border-purple-300 hover:shadow-sm transition-all duration-200 group"
                key={i}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">
                        {product.name}
                      </h3>
                      <div className="flex items-center gap-3 text-sm">
                        <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-full">
                          <Package className="h-3 w-3" />
                          <span>Stock: {product.stock}</span>
                        </div>
                        <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-full">
                          <Shield className="h-3 w-3" />
                          <span>Safety: {product.safetyStock}</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-1 text-xs text-gray-500">
                      <Calendar className="h-3 w-3" />
                      Last updated:{" "}
                      {new Date(product.updatedAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity">
                    <TrendingUp className="h-4 w-4 text-purple-500" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
