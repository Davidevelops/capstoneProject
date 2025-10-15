"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { Supplier } from "@/lib/types";
import {
  getSupplier,
  updateSupplier,
  addProductToSupplier,
  deleteSupplier,
  updateSupplierProduct,
  deleteSupplierProduct,
} from "@/lib/data/routes/supplier/supplier";
import toast from "react-hot-toast";
import {
  Package,
  Clock,
  Calendar,
  Truck,
  Users,
  ArrowLeft,
  Edit,
  TrendingUp,
  BarChart3,
  Plus,
  Save,
  X,
  Trash2,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
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

export default function SupplierDetailPage() {
  const router = useRouter();
  const params = useParams();
  const supplierId = params.supplierId as string;

  const [supplier, setSupplier] = useState<Supplier | null>(null);
  const [loading, setLoading] = useState(true);

  const [isEditSupplierOpen, setIsEditSupplierOpen] = useState(false);
  const [isAddProductOpen, setIsAddProductOpen] = useState(false);
  const [isDeleteSupplierOpen, setIsDeleteSupplierOpen] = useState(false);
  const [isEditProductOpen, setIsEditProductOpen] = useState(false);
  const [isDeleteProductOpen, setIsDeleteProductOpen] = useState(false);

  const [editForm, setEditForm] = useState({
    name: "",
    leadTime: 0,
  });
  const [newProduct, setNewProduct] = useState({
    productId: "",
    max: 1000,
    min: 100,
  });
  const [editingProduct, setEditingProduct] = useState<{
    id: string;
    name: string;
    minOrderable: number;
    maxOrderable: number;
  } | null>(null);
  const [deletingProduct, setDeletingProduct] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [addingProduct, setAddingProduct] = useState(false);
  const [updatingProduct, setUpdatingProduct] = useState(false);
  const [deletingProductLoading, setDeletingProductLoading] = useState(false);

  useEffect(() => {
    if (!supplierId) {
      setLoading(false);
      return;
    }

    setSupplier(null);
    setLoading(true);
    setEditForm({
      name: "",
      leadTime: 0,
    });
    setNewProduct({
      productId: "",
      max: 1000,
      min: 100,
    });
    setEditingProduct(null);
    setDeletingProduct(null);
  }, [supplierId]);

  useEffect(() => {
    const fetchSupplier = async () => {
      if (!supplierId) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("🔄 Fetching supplier with ID:", supplierId);
        const data = await getSupplier(supplierId);
        console.log("📦 Received supplier data:", data);
        setSupplier(data);
        if (data) {
          setEditForm({
            name: data.name,
            leadTime: data.leadTime,
          });
        }
      } catch (error) {
        console.error("Failed to fetch supplier:", error);
        toast.error("Failed to load supplier details");
      } finally {
        setLoading(false);
      }
    };

    fetchSupplier();
  }, [supplierId]);

  const handleEditSupplier = async () => {
    if (!supplier) return;

    try {
      const updatePromise = updateSupplier(supplier.id, editForm);

      toast.promise(updatePromise, {
        loading: "Updating supplier...",
        success: (updatedSupplier) => {
          setSupplier(updatedSupplier);
          setIsEditSupplierOpen(false);
          return "Supplier updated successfully!";
        },
        error: (error: any) => {
          const backendMessage = error.response?.data?.message;
          return backendMessage
            ? `Failed to update supplier: ${backendMessage}`
            : `Failed to update supplier: ${error.message}`;
        },
      });
    } catch (error: any) {
      console.error("Failed to update supplier:", error);
      toast.error("Failed to update supplier");
    }
  };

  const handleAddProduct = async () => {
    if (!supplier) return;
    if (!newProduct.productId.trim()) {
      toast.error("Please enter a product ID");
      return;
    }

    if (newProduct.min <= 0 || newProduct.max <= 0) {
      toast.error(
        "Minimum and maximum order quantities must be greater than 0"
      );
      return;
    }

    if (newProduct.min > newProduct.max) {
      toast.error("Minimum order cannot be greater than maximum order");
      return;
    }

    setAddingProduct(true);

    try {
      const addPromise = addProductToSupplier(supplier.id, {
        productId: newProduct.productId.trim(),
        min: Number(newProduct.min),
        max: Number(newProduct.max),
      });

      toast.promise(addPromise, {
        loading: "Adding product to supplier...",
        success: (updatedSupplier) => {
          setSupplier(updatedSupplier);
          setIsAddProductOpen(false);
          setNewProduct({ productId: "", max: 1000, min: 100 });
          return "Product added to supplier successfully!";
        },
        error: (error: any) => {
          const backendMessage = error.response?.data?.message;
          const validationErrors = error.response?.data?.errors;

          if (validationErrors) {
            return `Validation error: ${JSON.stringify(validationErrors)}`;
          } else if (backendMessage) {
            return `Failed to add product: ${backendMessage}`;
          } else {
            return `Failed to add product: ${error.message}`;
          }
        },
      });
    } catch (error: any) {
      console.error("Failed to add product:", error);
      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to add product";
      toast.error(`Failed to add product: ${errorMessage}`);
    } finally {
      setAddingProduct(false);
    }
  };

  const handleEditProduct = async () => {
    if (!supplier || !editingProduct) return;

    // Validation
    if (editingProduct.minOrderable <= 0 || editingProduct.maxOrderable <= 0) {
      toast.error(
        "Minimum and maximum order quantities must be greater than 0"
      );
      return;
    }

    if (editingProduct.minOrderable > editingProduct.maxOrderable) {
      toast.error("Minimum order cannot be greater than maximum order");
      return;
    }

    setUpdatingProduct(true);

    try {
      const updatePromise = updateSupplierProduct(
        supplier.id,
        editingProduct.id,
        {
          min: editingProduct.minOrderable,
          max: editingProduct.maxOrderable,
        }
      );

      toast.promise(updatePromise, {
        loading: "Updating product...",
        success: (updatedSupplier) => {
          setSupplier(updatedSupplier);
          setIsEditProductOpen(false);
          setEditingProduct(null);
          return "Product updated successfully!";
        },
        error: (error: any) => {
          const backendMessage = error.response?.data?.message;
          return backendMessage
            ? `Failed to update product: ${backendMessage}`
            : `Failed to update product: ${error.message}`;
        },
      });
    } catch (error: any) {
      console.error("Failed to update product:", error);
      toast.error("Failed to update product");
    } finally {
      setUpdatingProduct(false);
    }
  };

  const handleDeleteProduct = async () => {
    if (!supplier || !deletingProduct) return;

    setDeletingProductLoading(true);

    try {
      const deletePromise = deleteSupplierProduct(
        supplier.id,
        deletingProduct.id
      );

      toast.promise(deletePromise, {
        loading: "Deleting product...",
        success: (success) => {
          if (success) {
            getSupplier(supplier.id).then((updatedSupplier) => {
              setSupplier(updatedSupplier);
            });
            setIsDeleteProductOpen(false);
            setDeletingProduct(null);
            return "Product deleted successfully!";
          }
          throw new Error("Failed to delete product");
        },
        error: (error: any) => {
          const backendMessage = error.response?.data?.message;
          return backendMessage
            ? `Failed to delete product: ${backendMessage}`
            : `Failed to delete product: ${error.message}`;
        },
      });
    } catch (error: any) {
      console.error("Failed to delete product:", error);
      toast.error("Failed to delete product");
    } finally {
      setDeletingProductLoading(false);
    }
  };

  const handleDeleteSupplier = async () => {
    if (!supplier) return;

    try {
      const deletePromise = deleteSupplier(supplier.id);

      toast.promise(deletePromise, {
        loading: "Deleting supplier...",
        success: () => {
          setIsDeleteSupplierOpen(false);
          router.push("/dashboard/supplier");
          return "Supplier deleted successfully!";
        },
        error: (error: any) => {
          const backendMessage = error.response?.data?.message;
          return backendMessage
            ? `Failed to delete supplier: ${backendMessage}`
            : `Failed to delete supplier: ${error.message}`;
        },
      });
    } catch (error: any) {
      console.error("Failed to delete supplier:", error);
      toast.error("Failed to delete supplier");
    }
  };

  const getLeadTimeStatus = (leadTime: number) => {
    if (leadTime <= 3)
      return { color: "text-green-600 bg-green-50", label: "Fast Delivery" };
    if (leadTime <= 7)
      return {
        color: "text-yellow-600 bg-yellow-50",
        label: "Standard Delivery",
      };
    return { color: "text-red-600 bg-red-50", label: "Slow Delivery" };
  };

  if (!supplierId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6">
        <div className="max-w-[95rem] mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-purple-100 text-center">
            <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Invalid Supplier
            </h1>
            <p className="text-gray-600 mb-6">
              Supplier ID is missing or invalid.
            </p>
            <button
              onClick={() => router.push("/dashboard/supplier")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Suppliers
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6">
        <div className="max-w-[95rem] mx-auto">
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-purple-100 text-center">
            <div className="animate-pulse flex flex-col items-center">
              <div className="bg-purple-200 rounded-full h-16 w-16 mb-4"></div>
              <div className="bg-gray-200 h-6 w-48 rounded mb-2"></div>
              <div className="bg-gray-200 h-4 w-32 rounded"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6">
        <div className="max-w-[95rem] mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-purple-100 text-center">
            <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-gray-800 mb-2">
              Supplier Not Found
            </h1>
            <p className="text-gray-600 mb-6">
              The supplier you're looking for doesn't exist.
            </p>
            <button
              onClick={() => router.push("/dashboard/supplier")}
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Suppliers
            </button>
          </div>
        </div>
      </div>
    );
  }

  const leadTimeStatus = getLeadTimeStatus(supplier.leadTime);

  return (
    <div
      key={supplierId}
      className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6"
    >
      <div className="max-w-[95rem] mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors duration-200 p-2 hover:bg-purple-50 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </button>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          <div className="xl:col-span-3 space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
                    <Truck className="h-8 w-8 text-white" />
                  </div>
                  <div>
                    <h1 className="text-3xl font-bold text-gray-800">
                      {supplier.name}
                    </h1>
                    <p className="text-gray-600 mt-1 flex items-center gap-2">
                      <Users className="h-4 w-4" />
                      Supplier ID: {supplier.id.slice(0, 8)}...
                    </p>
                  </div>
                </div>

                <Dialog
                  open={isEditSupplierOpen}
                  onOpenChange={setIsEditSupplierOpen}
                >
                  <DialogTrigger asChild>
                    <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-sm">
                      <Edit className="h-4 w-4" />
                      Edit Supplier
                    </button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-[425px] bg-white border border-purple-100 rounded-2xl">
                    <DialogHeader className="space-y-4">
                      <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
                        <Edit className="h-6 w-6 text-purple-600" />
                        Edit Supplier
                      </DialogTitle>
                      <DialogDescription className="text-gray-600">
                        Update the supplier information for {supplier.name}.
                      </DialogDescription>
                    </DialogHeader>

                    <div className="space-y-6 py-4">
                      <div className="space-y-4">
                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Supplier Name *
                          </label>
                          <input
                            type="text"
                            value={editForm.name}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                name: e.target.value,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>

                        <div className="space-y-2">
                          <label className="text-sm font-medium text-gray-700">
                            Lead Time (days) *
                          </label>
                          <input
                            type="number"
                            min="1"
                            max="365"
                            value={editForm.leadTime}
                            onChange={(e) =>
                              setEditForm((prev) => ({
                                ...prev,
                                leadTime: parseInt(e.target.value) || 1,
                              }))
                            }
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex gap-3 pt-4">
                      <button
                        onClick={() => setIsEditSupplierOpen(false)}
                        className="flex items-center gap-2 flex-1 justify-center border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium transition-all duration-200"
                      >
                        <X className="h-4 w-4" />
                        Cancel
                      </button>
                      <button
                        onClick={handleEditSupplier}
                        disabled={!editForm.name.trim()}
                        className="flex items-center gap-2 flex-1 justify-center bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200"
                      >
                        <Save className="h-4 w-4" />
                        Save Changes
                      </button>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5 text-purple-600" />
                  Basic Information
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Supplier ID</span>
                    <span className="font-medium text-gray-800 text-sm">
                      {supplier.id}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Account ID</span>
                    <span className="font-medium text-gray-800 text-sm">
                      {supplier.accountId}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Status</span>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        supplier.deletedAt
                          ? "bg-red-50 text-red-600"
                          : "bg-green-50 text-green-600"
                      }`}
                    >
                      {supplier.deletedAt ? "Inactive" : "Active"}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-purple-600" />
                  Performance
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Lead Time</span>
                    </div>
                    <div className="text-right">
                      <span className="font-semibold text-gray-800">
                        {supplier.leadTime} days
                      </span>
                      <div
                        className={`text-xs px-2 py-1 rounded-full ${leadTimeStatus.color}`}
                      >
                        {leadTimeStatus.label}
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Package className="h-4 w-4 text-gray-400" />
                      <span className="text-gray-600">Total Products</span>
                    </div>
                    <span className="font-semibold text-gray-800">
                      {supplier.products?.length || 0}
                    </span>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
                <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-purple-600" />
                  Timeline
                </h2>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Created</span>
                    <span className="font-medium text-gray-800 text-sm">
                      {new Date(supplier.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-600">Last Updated</span>
                    <span className="font-medium text-gray-800 text-sm">
                      {new Date(supplier.updatedAt).toLocaleDateString()}
                    </span>
                  </div>
                  {supplier.deletedAt && (
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Deleted</span>
                      <span className="font-medium text-gray-800 text-sm">
                        {new Date(supplier.deletedAt).toLocaleDateString()}
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                  <Package className="h-6 w-6 text-purple-600" />
                  Associated Products
                </h2>
                <div className="flex items-center gap-3">
                  <span className="bg-purple-50 text-purple-600 px-4 py-2 rounded-full text-sm font-medium">
                    {supplier.products?.length || 0} product
                    {supplier.products?.length !== 1 ? "s" : ""}
                  </span>

                  <Dialog
                    open={isAddProductOpen}
                    onOpenChange={setIsAddProductOpen}
                  >
                    <DialogTrigger asChild>
                      <button className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-sm">
                        <Plus className="h-4 w-4" />
                        Add Product
                      </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px] bg-white border border-purple-100 rounded-2xl">
                      <DialogHeader className="space-y-4">
                        <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
                          <Plus className="h-6 w-6 text-purple-600" />
                          Add Product to Supplier
                        </DialogTitle>
                        <DialogDescription className="text-gray-600">
                          Add a new product to {supplier.name}.
                        </DialogDescription>
                      </DialogHeader>

                      <div className="space-y-6 py-4">
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-700">
                              Product ID *
                            </label>
                            <input
                              type="text"
                              value={newProduct.productId}
                              onChange={(e) =>
                                setNewProduct((prev) => ({
                                  ...prev,
                                  productId: e.target.value,
                                }))
                              }
                              placeholder="Enter product ID"
                              className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Minimum Order
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={newProduct.min}
                                onChange={(e) =>
                                  setNewProduct((prev) => ({
                                    ...prev,
                                    min: parseInt(e.target.value) || 1,
                                  }))
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                              />
                            </div>
                            <div className="space-y-2">
                              <label className="text-sm font-medium text-gray-700">
                                Maximum Order
                              </label>
                              <input
                                type="number"
                                min="1"
                                value={newProduct.max}
                                onChange={(e) =>
                                  setNewProduct((prev) => ({
                                    ...prev,
                                    max: parseInt(e.target.value) || 1,
                                  }))
                                }
                                className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                              />
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="flex gap-3 pt-4">
                        <button
                          onClick={() => {
                            setIsAddProductOpen(false);
                            setNewProduct({
                              productId: "",
                              max: 1000,
                              min: 100,
                            });
                          }}
                          className="flex items-center gap-2 flex-1 justify-center border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium transition-all duration-200"
                        >
                          <X className="h-4 w-4" />
                          Cancel
                        </button>
                        <button
                          onClick={handleAddProduct}
                          disabled={
                            !newProduct.productId.trim() || addingProduct
                          }
                          className="flex items-center gap-2 flex-1 justify-center bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200"
                        >
                          <Save className="h-4 w-4" />
                          {addingProduct ? "Adding..." : "Add Product"}
                        </button>
                      </div>
                    </DialogContent>
                  </Dialog>

                  <AlertDialog
                    open={isDeleteSupplierOpen}
                    onOpenChange={setIsDeleteSupplierOpen}
                  >
                    <AlertDialogTrigger asChild>
                      <button className="flex items-center gap-2 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-sm">
                        <Trash2 className="h-4 w-4" />
                        Delete Supplier
                      </button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-white border border-red-100 rounded-2xl">
                      <AlertDialogHeader className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="bg-red-100 p-2 rounded-full">
                            <Trash2 className="h-6 w-6 text-red-600" />
                          </div>
                          <AlertDialogTitle className="text-xl font-bold text-gray-800">
                            Delete Supplier
                          </AlertDialogTitle>
                        </div>

                        <AlertDialogDescription className="text-gray-600 text-base">
                          Are you sure you want to delete{" "}
                          <strong>"{supplier.name}"</strong>? This action cannot
                          be undone.
                        </AlertDialogDescription>
                      </AlertDialogHeader>

                      <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                        <div className="flex items-start gap-3">
                          <Trash2 className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                          <div className="text-sm text-red-800">
                            <strong>Warning:</strong> This will permanently
                            delete the supplier and all associated product
                            relationships.
                          </div>
                        </div>
                      </div>

                      <AlertDialogFooter className="flex gap-3 pt-4">
                        <AlertDialogCancel className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-2.5">
                          Cancel
                        </AlertDialogCancel>
                        <AlertDialogAction
                          onClick={handleDeleteSupplier}
                          className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl py-2.5 font-medium"
                        >
                          Delete Supplier
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              </div>

              {supplier.products && supplier.products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {supplier.products.map((product) => (
                    <div
                      key={product.id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200 group relative"
                    >
                      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex gap-1">
                        <Dialog
                          open={
                            isEditProductOpen &&
                            editingProduct?.id === product.id
                          }
                          onOpenChange={(open) => {
                            setIsEditProductOpen(open);
                            if (!open) setEditingProduct(null);
                          }}
                        >
                          <DialogTrigger asChild>
                            <button
                              onClick={() =>
                                setEditingProduct({
                                  id: product.id,
                                  name: product.name,
                                  minOrderable: product.minOrderable,
                                  maxOrderable: product.maxOrderable,
                                })
                              }
                              className="p-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors duration-200"
                              title="Edit Product"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                          </DialogTrigger>
                          <DialogContent className="sm:max-w-[425px] bg-white border border-purple-100 rounded-2xl">
                            <DialogHeader className="space-y-4">
                              <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
                                <Edit className="h-6 w-6 text-purple-600" />
                                Edit Product
                              </DialogTitle>
                              <DialogDescription className="text-gray-600">
                                Update the order quantities for{" "}
                                {editingProduct?.name}.
                              </DialogDescription>
                            </DialogHeader>

                            <div className="space-y-6 py-4">
                              <div className="space-y-4">
                                <div className="space-y-2">
                                  <label className="text-sm font-medium text-gray-700">
                                    Product Name
                                  </label>
                                  <input
                                    type="text"
                                    value={editingProduct?.name || ""}
                                    disabled
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg bg-gray-50 text-gray-500"
                                  />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                      Minimum Order *
                                    </label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={editingProduct?.minOrderable || 0}
                                      onChange={(e) =>
                                        setEditingProduct((prev) =>
                                          prev
                                            ? {
                                                ...prev,
                                                minOrderable:
                                                  parseInt(e.target.value) || 1,
                                              }
                                            : null
                                        )
                                      }
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-700">
                                      Maximum Order *
                                    </label>
                                    <input
                                      type="number"
                                      min="1"
                                      value={editingProduct?.maxOrderable || 0}
                                      onChange={(e) =>
                                        setEditingProduct((prev) =>
                                          prev
                                            ? {
                                                ...prev,
                                                maxOrderable:
                                                  parseInt(e.target.value) || 1,
                                              }
                                            : null
                                        )
                                      }
                                      className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                                    />
                                  </div>
                                </div>
                              </div>
                            </div>

                            <div className="flex gap-3 pt-4">
                              <button
                                onClick={() => {
                                  setIsEditProductOpen(false);
                                  setEditingProduct(null);
                                }}
                                className="flex items-center gap-2 flex-1 justify-center border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium transition-all duration-200"
                              >
                                <X className="h-4 w-4" />
                                Cancel
                              </button>
                              <button
                                onClick={handleEditProduct}
                                disabled={updatingProduct}
                                className="flex items-center gap-2 flex-1 justify-center bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200"
                              >
                                <Save className="h-4 w-4" />
                                {updatingProduct
                                  ? "Updating..."
                                  : "Update Product"}
                              </button>
                            </div>
                          </DialogContent>
                        </Dialog>
                        <AlertDialog
                          open={
                            isDeleteProductOpen &&
                            deletingProduct?.id === product.id
                          }
                          onOpenChange={(open) => {
                            setIsDeleteProductOpen(open);
                            if (!open) setDeletingProduct(null);
                          }}
                        >
                          <AlertDialogTrigger asChild>
                            <button
                              onClick={() =>
                                setDeletingProduct({
                                  id: product.id,
                                  name: product.name,
                                })
                              }
                              className="p-1.5 bg-red-50 text-red-600 hover:bg-red-100 rounded-lg transition-colors duration-200"
                              title="Delete Product"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </AlertDialogTrigger>
                          <AlertDialogContent className="bg-white border border-red-100 rounded-2xl">
                            <AlertDialogHeader className="space-y-4">
                              <div className="flex items-center gap-3">
                                <div className="bg-red-100 p-2 rounded-full">
                                  <Trash2 className="h-6 w-6 text-red-600" />
                                </div>
                                <AlertDialogTitle className="text-xl font-bold text-gray-800">
                                  Remove Product
                                </AlertDialogTitle>
                              </div>

                              <AlertDialogDescription className="text-gray-600 text-base">
                                Are you sure you want to remove{" "}
                                <strong>"{deletingProduct?.name}"</strong> from{" "}
                                {supplier.name}? This will remove the product
                                association but won't delete the product itself.
                              </AlertDialogDescription>
                            </AlertDialogHeader>

                            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
                              <div className="flex items-start gap-3">
                                <Trash2 className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                <div className="text-sm text-red-800">
                                  <strong>Note:</strong> This action will remove
                                  the product from this supplier's associated
                                  products list.
                                </div>
                              </div>
                            </div>

                            <AlertDialogFooter className="flex gap-3 pt-4">
                              <AlertDialogCancel className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 rounded-xl py-2.5">
                                Cancel
                              </AlertDialogCancel>
                              <AlertDialogAction
                                onClick={handleDeleteProduct}
                                disabled={deletingProductLoading}
                                className="flex-1 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white rounded-xl py-2.5 font-medium"
                              >
                                {deletingProductLoading
                                  ? "Removing..."
                                  : "Remove Product"}
                              </AlertDialogAction>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      </div>

                      <div className="flex items-start justify-between mb-3">
                        <h3 className="font-semibold text-gray-800 text-lg">
                          {product.name}
                        </h3>
                        <div className="bg-purple-100 text-purple-600 p-1 rounded-lg">
                          <Package className="h-4 w-4" />
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        ID: {product.id.slice(0, 8)}...
                      </p>
                      <div className="flex justify-between text-sm">
                        <div className="text-center">
                          <span className="text-gray-500 block">Min Order</span>
                          <span className="font-semibold text-gray-800">
                            {product.minOrderable}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="text-gray-500 block">Max Order</span>
                          <span className="font-semibold text-gray-800">
                            {product.maxOrderable}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <p className="text-gray-500 text-lg mb-2">
                    No products associated with this supplier
                  </p>
                  <p className="text-sm text-gray-400">
                    Add products using the button above
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-white bg-opacity-20 p-2 rounded-lg">
                  <Truck className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-lg">Supplier Status</h3>
              </div>
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium mb-4 ${
                  supplier.deletedAt ? "bg-red-400" : "bg-green-400"
                }`}
              >
                <div
                  className={`h-2 w-2 rounded-full ${
                    supplier.deletedAt ? "bg-red-200" : "bg-green-200"
                  }`}
                />
                {supplier.deletedAt ? "Inactive" : "Active"}
              </div>
              <p className="text-purple-100 text-sm">
                {supplier.deletedAt
                  ? "This supplier is currently inactive and cannot be used for new orders."
                  : "This supplier is active and available for ordering. All systems are operational."}
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">
                Quick Stats
              </h2>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Lead Time</span>
                  <span className="font-semibold text-gray-800">
                    {supplier.leadTime} days
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Active Products</span>
                  <span className="font-semibold text-gray-800">
                    {supplier.products?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Days Active</span>
                  <span className="font-semibold text-gray-800">
                    {Math.ceil(
                      (new Date().getTime() -
                        new Date(supplier.createdAt).getTime()) /
                        (1000 * 60 * 60 * 24)
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
