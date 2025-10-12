"use client";

import { ProductGroup } from "@/lib/types";
import { Archive, NotebookPen } from "lucide-react";
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
    return <div>No products found.</div>;
  }
  return (
    <div className="space-y-3">
      {productGroups.map((group) => (
        <div key={group.id} className="border rounded-lg p-4 bg-gray-200">
          <div className="flex justify-between items-center py-2">
            <h2 className="text-xl font-bold mb-3">{group.name}</h2>
            <div className="actions space-x-1 me-1 flex items-center">
              <Dialog open={open} onOpenChange={setIsOpen}>
                <DialogTrigger className="bg-white rounded text-black p-1">
                  <NotebookPen size={26} />
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Update product details</DialogTitle>
                    <Label className="mt-4">Name:</Label>
                    <Input
                      value={productName}
                      onChange={(e) => setProductName(e.target.value)}
                    ></Input>
                    {error && <div className="text-red-700">*{error}*</div>}
                  </DialogHeader>
                  <Button
                    className="bg-purple-500 hover:bg-purple-600"
                    onClick={() => handleUpdateDetails(group.id)}
                  >
                    Save Changes
                  </Button>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger className="bg-white rounded text-black p-1">
                  <Archive size={26} />
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      Are you sure you want to archive this product?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Archiving will remove this product group from active views
                      but preserve all data. You can unarchive it anytime to
                      restore full functionality.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      className="bg-purple-500 hover:bg-purple-600"
                      onClick={() => handleArchiveProduct(group.id)}
                    >
                      Confirm Archival
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>

          <div className="grid gap-2">
            {group.products.map((product, i) => (
              <Link
                href={`/dashboard/product-view/${product.groupId}/${product.id}`}
                className="bg-gray-50 rounded px-3 py-1"
                key={i}
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
