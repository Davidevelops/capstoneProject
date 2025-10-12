"use client";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AddProduct() {
  const [productName, setProductName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>("");
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const api_url = process.env.NEXT_PUBLIC_PRODUCT_API as string;

  const handleSubmitProduct = async () => {
    if (!productName.trim()) {
      setError("Product name is required");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const response = await axios.post(api_url, {
        name: productName.trim(),
      });

      console.log("Product added successfully:", response.data);

      setProductName("");
      setError("");
      setIsOpen(false);

      router.refresh();
    } catch (err) {
      console.error("Error adding product:", err);
      setError("Failed to add product. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-2 items-center bg-white text-purple-800 border border-purple-800 hover:bg-purple-50">
          <PlusCircle /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add a new product</DialogTitle>

          <Label className="mt-4">Name:</Label>
          <Input
            value={productName}
            onChange={(e) => {
              setProductName(e.target.value);
              setError("");
            }}
            placeholder="Enter product name"
          />

          {error && <p className="text-red-500 text-sm mt-2">{error}</p>}

          <Button
            className="bg-purple-500 hover:bg-purple-600 mt-4"
            onClick={handleSubmitProduct}
            disabled={isLoading}
          >
            {isLoading ? "Adding..." : "Add Product"}
          </Button>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
}
