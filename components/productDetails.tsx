"use client";

import { useRouter } from "next/navigation";
import { SingleProduct } from "@/lib/types";
import axios from "axios";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  SquarePen,
  ChartLine,
  PackageCheck,
  Target,
  TriangleAlert,
  Settings,
  TrendingUp,
  TrendingDown,
  BarChart3,
  Calendar,
  Save,
  X,
  Zap,
  Shield,
  Gauge,
  BarChart3 as ChartBar,
  Trash2,
  Eye,
  Download,
  Share2,
  Copy,
} from "lucide-react";
import React, { useState } from "react";
import LineChart from "@/app/(admin)/components/LineChart";

interface Props {
  product: SingleProduct;
}

export default function ProductDetails({ product }: Props) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [copyFeedback, setCopyFeedback] = useState(false);

  const defaultSettings = product.setting || {
    classification: "fast",
    serviceLevel: 90,
    fillRate: 90,
    safetyStockCalculationMethod: "dynamic",
  };

  const [formData, setFormData] = useState({
    name: product.name,
    safetyStock: product.safetyStock,
    stock: product.stock,
    setting: defaultSettings,
  });

  const metrics = {
    currentStock: 1250,
    forecastAccuracy: 94.2,
    totalSales: 2840,
    stockStatus: "healthy",
    stockChange: 12,
    accuracyChange: 2.1,
    salesChange: 18,
  };

  const handleDeleteProduct = async (id: string, groupId: string) => {
    try {
      await axios.delete(`${api_url}/${groupId}/products/${id}`);

      router.push("/dashboard/products");
      setIsDeleteDialogOpen(false);
    } catch (error) {
      console.error("Failed to delete product:", error);
      alert("Error deleting product. Check console for details.");
    }
  };

  const handlePlaceholderAction = (action: string) => {
    console.log(`Placeholder action: ${action}`);
    alert(`This would trigger: ${action}`);
  };

  const handleInputChange = (
    field: string,
    value: any,
    nestedField?: string
  ) => {
    if (nestedField) {
      setFormData((prev) => ({
        ...prev,
        setting: {
          ...prev.setting,
          [nestedField]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [field]: value,
      }));
    }
  };

  const handleCopyId = () => {
    navigator.clipboard.writeText(product.id);
    setCopyFeedback(true);
    setTimeout(() => setCopyFeedback(false), 2000);
  };

  const api_url = process.env.NEXT_PUBLIC_PRODUCT_API as string;
  const handleSave = async (id: string, groupId: string) => {
    try {
      const updateData = {
        name: formData.name,
        safetyStock: formData.safetyStock,
        stock: formData.stock,
        setting: formData.setting,
      };

      console.log("Sending update data:", updateData);
      const response = await axios.patch(
        `${api_url}/${groupId}/products/${id}`,
        updateData
      );

      console.log("Update successful:", response.data);

      router.refresh();
      setIsEditing(false);
    } catch (error) {
      console.error("Failed to update product:", error);
    }
  };

  const getStockStatusColor = (status: string) => {
    switch (status) {
      case "healthy":
        return "text-green-600 bg-green-50";
      case "warning":
        return "text-yellow-600 bg-yellow-50";
      case "critical":
        return "text-red-600 bg-red-50";
      default:
        return "text-gray-600 bg-gray-50";
    }
  };

  const getStockStatusIcon = (status: string) => {
    switch (status) {
      case "healthy":
        return <PackageCheck className="h-5 w-5" />;
      case "warning":
        return <TriangleAlert className="h-5 w-5" />;
      case "critical":
        return <TriangleAlert className="h-5 w-5" />;
      default:
        return <PackageCheck className="h-5 w-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6">
      {product && (
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 mb-6">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-4">
                <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
                  <PackageCheck className="h-8 w-8 text-white" />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-800">
                    {product.name}
                  </h1>
                  <p className="text-gray-600 mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    Last updated:{" "}
                    {new Date(product.updatedAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3">
                {/* Generate Forecast Button with Placeholder */}
                <button
                  onClick={() => handlePlaceholderAction("Generate Forecast")}
                  className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-sm"
                >
                  <ChartLine className="h-5 w-5" />
                  Generate Forecast
                </button>

                {/* Edit Product Button */}
                <AlertDialog open={isEditing} onOpenChange={setIsEditing}>
                  <AlertDialogTrigger className="flex items-center gap-2 border border-purple-200 text-purple-700 hover:bg-purple-50 px-4 py-2 rounded-xl font-semibold transition-all duration-200">
                    <SquarePen className="h-5 w-5" />
                    Edit Product
                  </AlertDialogTrigger>
                  <AlertDialogContent className="max-w-md bg-white border border-purple-100 rounded-2xl">
                    <AlertDialogHeader className="space-y-4">
                      <div className="flex items-center justify-between">
                        <AlertDialogTitle className="flex items-center gap-2 text-lg font-semibold text-gray-800">
                          <Settings className="h-5 w-5 text-purple-600" />
                          Edit Product
                        </AlertDialogTitle>
                        <AlertDialogCancel className="p-1.5 hover:bg-gray-100 rounded-lg">
                          <X className="h-4 w-4" />
                        </AlertDialogCancel>
                      </div>

                      <div className="space-y-4">
                        {/* Product ID Field */}
                        <div className="space-y-2">
                          <label className="text-xs font-medium text-gray-600 flex items-center justify-between">
                            <span>Product ID</span>
                            <button
                              type="button"
                              onClick={handleCopyId}
                              className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-700 transition-colors"
                            >
                              <Copy className="h-3 w-3" />
                              {copyFeedback ? "Copied!" : "Copy"}
                            </button>
                          </label>
                          <input
                            type="text"
                            value={product.id}
                            readOnly
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500 text-sm cursor-not-allowed"
                            onClick={(e) => e.currentTarget.select()}
                          />
                          <p className="text-xs text-gray-400">
                            This ID is unique to this product and cannot be
                            changed
                          </p>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <PackageCheck className="h-4 w-4 text-purple-600" />
                            Basic Information
                          </h3>

                          <div className="space-y-2">
                            <label className="text-xs font-medium text-gray-600">
                              Product Name
                            </label>
                            <input
                              type="text"
                              value={formData.name}
                              onChange={(e) =>
                                handleInputChange("name", e.target.value)
                              }
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium text-gray-600">
                                Current Stock
                              </label>
                              <input
                                type="number"
                                value={formData.stock}
                                onChange={(e) =>
                                  handleInputChange(
                                    "stock",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">
                                Safety Stock
                              </label>
                              <input
                                type="number"
                                value={formData.safetyStock}
                                onChange={(e) =>
                                  handleInputChange(
                                    "safetyStock",
                                    parseInt(e.target.value)
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-3">
                          <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                            <Gauge className="h-4 w-4 text-purple-600" />
                            Settings
                          </h3>

                          <div>
                            <label className="text-xs font-medium text-gray-600">
                              Classification
                            </label>
                            <select
                              value={formData.setting.classification}
                              onChange={(e) =>
                                handleInputChange(
                                  "setting",
                                  e.target.value,
                                  "classification"
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                            >
                              <option value="fast">Fast Moving</option>
                              <option value="medium">Medium Moving</option>
                              <option value="slow">Slow Moving</option>
                            </select>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div>
                              <label className="text-xs font-medium text-gray-600">
                                Service Level (%)
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.setting.serviceLevel}
                                onChange={(e) =>
                                  handleInputChange(
                                    "setting",
                                    parseInt(e.target.value),
                                    "serviceLevel"
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                              />
                            </div>
                            <div>
                              <label className="text-xs font-medium text-gray-600">
                                Fill Rate (%)
                              </label>
                              <input
                                type="number"
                                min="0"
                                max="100"
                                value={formData.setting.fillRate}
                                onChange={(e) =>
                                  handleInputChange(
                                    "setting",
                                    parseInt(e.target.value),
                                    "fillRate"
                                  )
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                              />
                            </div>
                          </div>

                          <div>
                            <label className="text-xs font-medium text-gray-600">
                              Safety Stock Method
                            </label>
                            <select
                              value={
                                formData.setting.safetyStockCalculationMethod
                              }
                              onChange={(e) =>
                                handleInputChange(
                                  "setting",
                                  e.target.value,
                                  "safetyStockCalculationMethod"
                                )
                              }
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent text-sm"
                            >
                              <option value="dynamic">Dynamic</option>
                              <option value="static">Static</option>
                              <option value="manual">Manual</option>
                            </select>
                          </div>
                        </div>
                      </div>
                    </AlertDialogHeader>

                    <AlertDialogFooter className="flex gap-2 pt-4">
                      <AlertDialogCancel className="flex-1 border border-gray-200 text-gray-700 hover:bg-gray-50 rounded-xl py-2.5">
                        Cancel
                      </AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleSave(product.id, product.groupId)}
                        className="flex-1 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl py-2.5 font-semibold flex items-center justify-center gap-2"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>

                {/* Delete Product Button with Confirmation Dialog */}
                <Dialog
                  open={isDeleteDialogOpen}
                  onOpenChange={setIsDeleteDialogOpen}
                >
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-2 text-red-700 border border-red-700 hover:bg-red-50 px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-sm">
                      <Trash2 className="h-5 w-5" />
                      Delete Product
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-white border border-red-100 rounded-2xl">
                    <DialogHeader className="space-y-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-red-100 p-2 rounded-full">
                          <Trash2 className="h-6 w-6 text-red-600" />
                        </div>
                        <DialogTitle className="text-xl font-bold text-gray-800">
                          Delete Product
                        </DialogTitle>
                      </div>

                      <DialogDescription className="text-gray-600 text-base">
                        Are you sure you want to delete{" "}
                        <strong>"{product.name}"</strong>? This action cannot be
                        undone and all product data will be permanently removed.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                      <div className="flex items-start gap-3">
                        <TriangleAlert className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="text-sm text-red-800">
                          <strong>Warning:</strong> This will permanently delete
                          all product data, including sales history, forecasts,
                          and settings.
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setIsDeleteDialogOpen(false)}
                        className="flex items-center gap-2 flex-1 justify-center border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium transition-all duration-200"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                      <button
                        onClick={() =>
                          handleDeleteProduct(product.id, product.groupId)
                        }
                        className="flex items-center gap-2 flex-1 justify-center bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200"
                      >
                        <Trash2 className="h-4 w-4" />
                        Delete Product
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </div>

          {/* Metrics Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Current Stock Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Current Stock
                  </p>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {metrics.currentStock.toLocaleString()}
                  </h2>
                </div>
                <div className="bg-green-50 p-2 rounded-lg">
                  <PackageCheck className="h-6 w-6 text-green-600" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                {metrics.stockChange >= 0 ? (
                  <TrendingUp className="h-4 w-4 text-green-500" />
                ) : (
                  <TrendingDown className="h-4 w-4 text-red-500" />
                )}
                <span
                  className={
                    metrics.stockChange >= 0
                      ? "text-green-600 font-medium"
                      : "text-red-600 font-medium"
                  }
                >
                  {metrics.stockChange >= 0 ? "+" : ""}
                  {metrics.stockChange}
                </span>
                <span className="text-gray-500">since last week</span>
              </div>
            </div>

            {/* Forecast Accuracy Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Forecast Accuracy
                  </p>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {metrics.forecastAccuracy}%
                  </h2>
                </div>
                <div className="bg-blue-50 p-2 rounded-lg">
                  <Target className="h-6 w-6 text-blue-600" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-green-600 font-medium">
                  +{metrics.accuracyChange}%
                </span>
                <span className="text-gray-500">improvement</span>
              </div>
            </div>

            {/* Total Sales Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Total Sales
                  </p>
                  <h2 className="text-2xl font-bold text-gray-800">
                    {metrics.totalSales.toLocaleString()}
                  </h2>
                </div>
                <div className="bg-purple-50 p-2 rounded-lg">
                  <ChartLine className="h-6 w-6 text-purple-600" />
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm">
                <TrendingUp className="h-4 w-4 text-green-500" />
                <span className="text-green-600 font-medium">
                  +{metrics.salesChange}
                </span>
                <span className="text-gray-500">vs last month</span>
              </div>
            </div>

            {/* Stock Status Card */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 hover:shadow-md transition-all duration-300">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <p className="text-gray-500 text-sm font-medium mb-1">
                    Stock Status
                  </p>
                  <h2
                    className={`text-2xl font-bold capitalize ${
                      metrics.stockStatus === "healthy"
                        ? "text-green-600"
                        : metrics.stockStatus === "warning"
                        ? "text-yellow-600"
                        : "text-red-600"
                    }`}
                  >
                    {metrics.stockStatus}
                  </h2>
                </div>
                <div
                  className={`p-2 rounded-lg ${getStockStatusColor(
                    metrics.stockStatus
                  )}`}
                >
                  {getStockStatusIcon(metrics.stockStatus)}
                </div>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>Optimal inventory level</span>
              </div>
            </div>
          </div>

          {/* Chart Section */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-2 rounded-lg">
                <BarChart3 className="h-5 w-5 text-white" />
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Sales Forecast & Analytics
              </h3>
            </div>
            <div className="h-96">
              <LineChart />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
