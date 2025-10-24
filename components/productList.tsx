"use client";

import { ProductGroup, CreateVariantInput, VariantSetting } from "@/lib/types";
import {
  Archive,
  NotebookPen,
  BarChart3,
  TrendingUp,
  Package,
  Shield,
  Calendar,
  Edit3,
  Trash2,
  Plus,
  Eye,
  Copy,
  Check,
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
import axios from "axios";
import toast from "react-hot-toast";

interface Props {
  productGroups: ProductGroup[];
  refreshProducts: () => Promise<void>;
}

export default function ProductList({ productGroups, refreshProducts }: Props) {
  const [productName, setProductName] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setIsLoading] = useState<boolean>(false);
  const [open, setIsOpen] = useState<boolean>(false);
  const [addVariantOpen, setAddVariantOpen] = useState<boolean>(false);
  const [currentGroupId, setCurrentGroupId] = useState<string>("");
  const [variantData, setVariantData] = useState<CreateVariantInput>({
    name: "",
    setting: undefined,
  });
  const [addMode, setAddMode] = useState<"partial" | "full">("partial");
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const api_url = process.env.NEXT_PUBLIC_PRODUCT_API as string;

  const handleCopyId = async (id: string) => {
    try {
      await navigator.clipboard.writeText(id);
      setCopiedId(id);
      toast.success("ID copied to clipboard!");
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error("Failed to copy ID: ", err);
      toast.error("Failed to copy ID");
    }
  };

  const handleArchiveProduct = async (id: string) => {
    setIsLoading(true);
    setError("");
    try {
      await axios.delete(`${api_url}/${id}`);
      setError("");
      await refreshProducts(); // Auto-refresh after archiving
      toast.success("Product group archived successfully!");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "An unknown error occurred");
        toast.error(
          err.response?.data?.error || "Failed to archive product group"
        );
      } else {
        setError("An unexpected error occurred");
        toast.error("Failed to archive product group");
      }
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
      await axios.patch(`${api_url}/${groupId}`, {
        name: productName,
      });

      setError("");
      setIsOpen(false);
      setProductName("");
      await refreshProducts(); // Auto-refresh after update
      toast.success("Product group updated successfully!");
    } catch (err) {
      console.error("An error while trying to update product: ", err);
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.error || "An unknown error occurred");
        toast.error(
          err.response?.data?.error || "Failed to update product group"
        );
      } else {
        setError("An unexpected error occurred");
        toast.error("Failed to update product group");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddVariant = async (groupId: string) => {
    if (!variantData.name.trim()) {
      setError("Variant name is required");
      return;
    }

    if (addMode === "full") {
      const {
        classification,
        serviceLevel,
        fillRate,
        safetyStockCalculationMethod,
      } = variantData.setting || {};

      if (
        !classification ||
        serviceLevel === undefined ||
        serviceLevel === null ||
        fillRate === undefined ||
        fillRate === null ||
        !safetyStockCalculationMethod
      ) {
        setError("All fields are required in Full mode");
        return;
      }

      if (
        serviceLevel < 0 ||
        serviceLevel > 100 ||
        fillRate < 0 ||
        fillRate > 100
      ) {
        setError("Service Level and Fill Rate must be between 0 and 100");
        return;
      }
    }

    setIsLoading(true);
    setError("");

    try {
      const requestData: any = {
        name: variantData.name.trim(),
      };

      if (addMode === "full" && variantData.setting) {
        requestData.setting = {
          classification: variantData.setting.classification?.trim(),
          serviceLevel: Number(variantData.setting.serviceLevel),
          fillRate: Number(variantData.setting.fillRate),
          safetyStockCalculationMethod:
            variantData.setting.safetyStockCalculationMethod?.trim(),
        };
      }

      const variantApiUrl = `${api_url}/${groupId}/products`;

      console.log("=== SENDING VARIANT DATA ===");
      console.log("API URL:", variantApiUrl);
      console.log("Group ID:", groupId);
      console.log("Base API URL:", api_url);
      console.log("Request Data:", JSON.stringify(requestData, null, 2));

      await axios.post(variantApiUrl, requestData, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      console.log("Variant added successfully");

      setError("");
      setAddVariantOpen(false);
      resetVariantForm();
      await refreshProducts(); // Auto-refresh after adding variant
      toast.success("Variant added successfully!");
    } catch (error: any) {
      console.error("=== FULL ERROR DETAILS ===");
      console.error("Error object:", error);
      console.error("Error response:", error.response?.data);
      console.error("Error status:", error.response?.status);
      console.error("Error message:", error.response?.data?.message);

      let errorMessage = "An error occurred while trying to add variant";

      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage =
          "Invalid data format. Please check all fields and try again.";
      } else if (error.response?.status === 404) {
        errorMessage =
          "API endpoint not found. Please check the URL configuration.";
      }

      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const resetVariantForm = () => {
    setVariantData({
      name: "",
      setting: {
        classification: "",
        serviceLevel: 90,
        fillRate: 90,
        safetyStockCalculationMethod: "dynamic",
      },
    });
    setAddMode("partial");
    setError("");
  };

  const openAddVariantDialog = (groupId: string) => {
    setCurrentGroupId(groupId);
    setAddVariantOpen(true);
    resetVariantForm();
  };

  const handleVariantFieldChange = (field: string, value: any) => {
    setVariantData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSettingFieldChange = (
    field: keyof VariantSetting,
    value: any
  ) => {
    setVariantData((prev) => ({
      ...prev,
      setting: {
        ...prev.setting,
        [field]:
          field === "serviceLevel" || field === "fillRate"
            ? Number(value)
            : value,
      } as VariantSetting,
    }));
  };

  const isFormValid = () => {
    if (!variantData.name.trim()) return false;

    if (addMode === "full") {
      const {
        classification,
        serviceLevel,
        fillRate,
        safetyStockCalculationMethod,
      } = variantData.setting || {};
      return !!(
        classification?.trim() &&
        serviceLevel !== undefined &&
        serviceLevel !== null &&
        fillRate !== undefined &&
        fillRate !== null &&
        safetyStockCalculationMethod?.trim()
      );
    }

    return true;
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
      {productGroups.map((group) => {
        const products = group.products || [];
        const productCount = products.length;

        return (
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
                      <span>{productCount} products</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-4 w-4" />
                      <span>Forecast Ready</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleCopyId(group.id)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-600 transition-colors duration-200 mt-1 group/copy"
                  >
                    <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded border">
                      Group ID: {group.id.slice(0, 8)}...
                    </span>
                    {copiedId === group.id ? (
                      <Check className="h-3 w-3 text-green-500" />
                    ) : (
                      <Copy className="h-3 w-3 opacity-0 group-hover/copy:opacity-100 transition-opacity" />
                    )}
                  </button>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <Dialog open={addVariantOpen} onOpenChange={setAddVariantOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-200 text-green-700 hover:bg-green-50 hover:text-green-800"
                      onClick={() => openAddVariantDialog(group.id)}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Variant
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="bg-white max-w-md">
                    <DialogHeader>
                      <DialogTitle className="flex items-center gap-2 text-purple-900">
                        <Plus className="h-5 w-5" />
                        Add Product Variant
                      </DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      {/* Add Mode Selection */}
                      <div className="flex gap-2 mb-4">
                        <Button
                          type="button"
                          variant={
                            addMode === "partial" ? "default" : "outline"
                          }
                          className={`flex-1 ${
                            addMode === "partial"
                              ? "bg-purple-500 hover:bg-purple-600"
                              : "border-purple-200"
                          }`}
                          onClick={() => setAddMode("partial")}
                        >
                          Partial
                        </Button>
                        <Button
                          type="button"
                          variant={addMode === "full" ? "default" : "outline"}
                          className={`flex-1 ${
                            addMode === "full"
                              ? "bg-purple-500 hover:bg-purple-600"
                              : "border-purple-200"
                          }`}
                          onClick={() => setAddMode("full")}
                        >
                          Full
                        </Button>
                      </div>

                      <div>
                        <Label className="text-gray-700">Variant Name *</Label>
                        <Input
                          value={variantData.name}
                          onChange={(e) =>
                            handleVariantFieldChange("name", e.target.value)
                          }
                          className="mt-1 border-purple-200 focus:border-purple-500"
                          placeholder="Enter variant name..."
                        />
                      </div>

                      {addMode === "full" && (
                        <div className="space-y-3 border-t pt-3">
                          <Label className="text-gray-700 font-semibold">
                            Settings *
                          </Label>

                          <div>
                            <Label className="text-gray-600 text-sm">
                              Classification *
                            </Label>
                            <Input
                              value={variantData.setting?.classification || ""}
                              onChange={(e) =>
                                handleSettingFieldChange(
                                  "classification",
                                  e.target.value
                                )
                              }
                              className="mt-1 border-purple-200 focus:border-purple-500"
                              placeholder="e.g., fast"
                            />
                          </div>

                          <div>
                            <Label className="text-gray-600 text-sm">
                              Service Level (%) *
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={variantData.setting?.serviceLevel ?? ""}
                              onChange={(e) =>
                                handleSettingFieldChange(
                                  "serviceLevel",
                                  e.target.value
                                )
                              }
                              className="mt-1 border-purple-200 focus:border-purple-500"
                              placeholder="90"
                            />
                          </div>

                          <div>
                            <Label className="text-gray-600 text-sm">
                              Fill Rate (%) *
                            </Label>
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              value={variantData.setting?.fillRate ?? ""}
                              onChange={(e) =>
                                handleSettingFieldChange(
                                  "fillRate",
                                  e.target.value
                                )
                              }
                              className="mt-1 border-purple-200 focus:border-purple-500"
                              placeholder="90"
                            />
                          </div>

                          <div>
                            <Label className="text-gray-600 text-sm">
                              Safety Stock Method *
                            </Label>
                            <Input
                              value={
                                variantData.setting
                                  ?.safetyStockCalculationMethod || ""
                              }
                              onChange={(e) =>
                                handleSettingFieldChange(
                                  "safetyStockCalculationMethod",
                                  e.target.value
                                )
                              }
                              className="mt-1 border-purple-200 focus:border-purple-500"
                              placeholder="e.g., dynamic"
                            />
                          </div>
                        </div>
                      )}

                      {error && (
                        <div className="text-red-600 text-sm bg-red-50 p-2 rounded-lg">
                          {error}
                        </div>
                      )}

                      <Button
                        className="w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700"
                        onClick={() => handleAddVariant(currentGroupId)}
                        disabled={loading || !isFormValid()}
                      >
                        {loading ? "Adding..." : "Add Variant"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Edit Dialog */}
                <Dialog open={open} onOpenChange={setIsOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-purple-200 text-purple-700 hover:bg-purple-50 hover:text-purple-800"
                      onClick={() => setProductName(group.name)}
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
                        disabled={loading}
                      >
                        {loading ? "Saving..." : "Save Changes"}
                      </Button>
                    </div>
                  </DialogContent>
                </Dialog>

                {/* Archive Dialog */}
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
                        {productCount} variant/s. Archived data is preserved for
                        analytics and can be restored later.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel className="border-gray-300 hover:bg-gray-50">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700"
                        onClick={() => handleArchiveProduct(group.id)}
                        disabled={loading}
                      >
                        {loading ? "Archiving..." : "Confirm Archive"}
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>

            <div className="grid gap-3">
              {products.length > 0 ? (
                products.map((product, i) => (
                  <div
                    className="bg-white border border-purple-100 rounded-xl p-4 hover:border-purple-300 hover:shadow-sm transition-all duration-200 group"
                    key={i}
                  >
                    <div className="flex justify-between items-start">
                      <Link
                        href={`/dashboard/product-view/${product.groupId}/${product.id}`}
                        className="flex-1"
                      >
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
                        <div className="flex items-center gap-3 text-xs text-gray-500 mb-1">
                          <Calendar className="h-3 w-3" />
                          Last updated:{" "}
                          {new Date(product.updatedAt).toLocaleDateString()}
                        </div>
                        <button
                          onClick={(e) => {
                            e.preventDefault();
                            e.stopPropagation();
                            handleCopyId(product.id);
                          }}
                          className="flex items-center gap-1 text-xs text-gray-500 hover:text-purple-600 transition-colors duration-200 group/copy"
                        >
                          <span className="font-mono bg-gray-100 px-1.5 py-0.5 rounded border">
                            Variant ID: {product.id.slice(0, 8)}...
                          </span>
                          {copiedId === product.id ? (
                            <Check className="h-3 w-3 text-green-500" />
                          ) : (
                            <Copy className="h-3 w-3 opacity-0 group-hover/copy:opacity-100 transition-opacity" />
                          )}
                        </button>
                      </Link>
                      <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        <Link
                          href={`/dashboard/variantSales/${product.groupId}/variants/${product.id}/sales`}
                        >
                          <Button
                            variant="outline"
                            size="sm"
                            className="border-blue-200 text-blue-700 hover:bg-blue-50 hover:text-blue-800"
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View Sales
                          </Button>
                        </Link>
                        <TrendingUp className="h-4 w-4 text-purple-500" />
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-gray-500 bg-white border border-purple-100 rounded-xl">
                  <Package className="mx-auto h-8 w-8 text-purple-300 mb-2" />
                  No products in this group
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
