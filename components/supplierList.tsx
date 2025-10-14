// components/supplierList.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Supplier } from "@/lib/types";
import Link from "next/link";
import {
  createSupplier,
  updateSupplier,
  deleteSupplier,
} from "@/lib/data/routes/supplier/supplier";
import toast from "react-hot-toast";
import {
  Package,
  Clock,
  Calendar,
  Plus,
  Search,
  Filter,
  Truck,
  Edit,
  Trash2,
  Eye,
  Users,
  Save,
  X,
} from "lucide-react";
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

interface supplierProp {
  supplier: Supplier[] | null;
}

export default function SupplierList({ supplier }: supplierProp) {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(
    null
  );
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);

  const [newSupplier, setNewSupplier] = useState({
    name: "",
    leadTime: 7,
  });

  const filteredSuppliers =
    supplier?.filter((sup) =>
      sup.name.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const handleViewDetails = (supplier: Supplier) => {
    setSelectedSupplier(supplier);
  };

  const handleAddSupplier = async () => {
    try {
      const addPromise = createSupplier({
        name: newSupplier.name,
        leadTime: newSupplier.leadTime,
      });

      toast.promise(addPromise, {
        loading: `Creating supplier "${newSupplier.name}"...`,
        success: (createdSupplier) => {
          setIsAddDialogOpen(false);
          setNewSupplier({ name: "", leadTime: 7 });
          router.refresh();
          return `Supplier "${newSupplier.name}" created successfully!`;
        },
        error: (error) => {
          console.error("Failed to add supplier:", error);
          return `Failed to create supplier: ${
            error.response?.data?.message || error.message
          }`;
        },
      });
    } catch (error) {
      console.error("Failed to add supplier:", error);
      toast.error(
        "Failed to create supplier. Please check the console for details."
      );
    }
  };

  if (!supplier) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6">
        <div className="max-w-[95rem] mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-purple-100 text-center">
            <Truck className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-600 mb-2">
              No Suppliers Found
            </h2>
            <p className="text-gray-500">There are no suppliers to display.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6">
      <div className="max-w-[95rem] mx-auto">
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 mb-6">
          <div className="flex justify-between items-start">
            <div className="flex items-center gap-4">
              <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-3 rounded-xl">
                <Users className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-800">Suppliers</h1>
                <p className="text-gray-600 mt-1 flex items-center gap-2">
                  <Package className="h-4 w-4" />
                  {supplier.length} supplier{supplier.length !== 1 ? "s" : ""}{" "}
                  registered
                </p>
              </div>
            </div>

            <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
              <DialogTrigger asChild>
                <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-sm">
                  <Plus className="h-5 w-5" />
                  Add Supplier
                </button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px] bg-white border border-purple-100 rounded-2xl">
                <DialogHeader className="space-y-4">
                  <DialogTitle className="flex items-center gap-2 text-xl font-bold text-gray-800">
                    <Users className="h-6 w-6 text-purple-600" />
                    Add New Supplier
                  </DialogTitle>

                  <DialogDescription className="text-gray-600">
                    Enter the details for the new supplier.
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
                        value={newSupplier.name}
                        onChange={(e) =>
                          setNewSupplier((prev) => ({
                            ...prev,
                            name: e.target.value,
                          }))
                        }
                        placeholder="Enter supplier name"
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
                        value={newSupplier.leadTime}
                        onChange={(e) =>
                          setNewSupplier((prev) => ({
                            ...prev,
                            leadTime: parseInt(e.target.value) || 1,
                          }))
                        }
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
                      />
                      <p className="text-xs text-gray-500">
                        Average delivery time in days
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4">
                  <button
                    onClick={() => setIsAddDialogOpen(false)}
                    className="flex items-center gap-2 flex-1 justify-center border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium transition-all duration-200"
                  >
                    <X className="h-4 w-4" />
                    Cancel
                  </button>
                  <button
                    onClick={handleAddSupplier}
                    disabled={!newSupplier.name.trim()}
                    className="flex items-center gap-2 flex-1 justify-center bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200"
                  >
                    <Save className="h-4 w-4" />
                    Create Supplier
                  </button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="bg-white rounded-2xl p-4 shadow-sm border border-purple-100 mb-6">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search suppliers by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <button className="flex items-center gap-2 border border-gray-200 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-xl font-medium transition-all duration-200">
              <Filter className="h-4 w-4" />
              Filter
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
          {filteredSuppliers.map((sup) => (
            <SupplierCard key={sup.id} supplier={sup} router={router} />
          ))}
        </div>

        {filteredSuppliers.length === 0 && (
          <div className="bg-white rounded-2xl p-12 shadow-sm border border-purple-100 text-center">
            <Truck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-600 mb-2">
              No suppliers found
            </h3>
            <p className="text-gray-500 mb-6">
              {searchTerm
                ? "Try adjusting your search terms"
                : "Get started by adding your first supplier"}
            </p>
            {!searchTerm && (
              <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                <DialogTrigger asChild>
                  <button className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200 shadow-sm">
                    <Plus className="h-5 w-5" />
                    Add Your First Supplier
                  </button>
                </DialogTrigger>
              </Dialog>
            )}
          </div>
        )}

        {selectedSupplier && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-purple-50 p-2 rounded-lg">
                  <Truck className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedSupplier.name}
                </h3>
              </div>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Supplier ID:</span>
                  <span className="font-medium">{selectedSupplier.id}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Lead Time:</span>
                  <span className="font-medium">
                    {selectedSupplier.leadTime} days
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Products:</span>
                  <span className="font-medium">
                    {selectedSupplier.products?.length || 0}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Created:</span>
                  <span className="font-medium">
                    {new Date(selectedSupplier.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated:</span>
                  <span className="font-medium">
                    {new Date(selectedSupplier.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setSelectedSupplier(null)}
                className="mt-6 w-full bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white py-2.5 rounded-xl font-medium transition-all duration-200"
              >
                Close
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function SupplierCard({
  supplier,

  router,
}: {
  supplier: Supplier;

  router: any;
}) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [editForm, setEditForm] = useState({
    name: supplier.name,
    leadTime: supplier.leadTime,
  });

  const handleSaveEdit = async () => {
    try {
      const updatePromise = updateSupplier(supplier.id, {
        name: editForm.name,
        leadTime: editForm.leadTime,
      });

      toast.promise(updatePromise, {
        loading: `Updating supplier "${supplier.name}"...`,
        success: (updatedSupplier) => {
          setIsEditDialogOpen(false);
          router.refresh();
          return `Supplier "${editForm.name}" updated successfully!`;
        },
        error: (error) => {
          console.error("Failed to update supplier:", error);
          return `Failed to update supplier: ${
            error.response?.data?.message || error.message
          }`;
        },
      });
    } catch (error) {
      console.error("Failed to update supplier:", error);
      toast.error(
        "Failed to update supplier. Please check the console for details."
      );
    }
  };

  const handleDeleteSupplier = async () => {
    try {
      const deletePromise = deleteSupplier(supplier.id);

      toast.promise(deletePromise, {
        loading: `Deleting supplier "${supplier.name}"...`,
        success: (success) => {
          setIsDeleteDialogOpen(false);
          router.refresh();
          return `Supplier "${supplier.name}" deleted successfully!`;
        },
        error: (error) => {
          console.error("Failed to delete supplier:", error);
          return `Failed to delete supplier: ${
            error.response?.data?.message || error.message
          }`;
        },
      });
    } catch (error) {
      console.error("Failed to delete supplier:", error);
      toast.error(
        "Failed to delete supplier. Please check the console for details."
      );
    }
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100 hover:shadow-md transition-all duration-300 group">
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3">
          <div className="bg-purple-50 p-2 rounded-lg">
            <Truck className="h-6 w-6 text-purple-600" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-800 group-hover:text-purple-600 transition-colors duration-200">
              {supplier.name}
            </h3>
            <p className="text-sm text-gray-500">
              ID: {supplier.id.slice(0, 8)}...
            </p>
          </div>
        </div>
      </div>

      <div className="space-y-3 mb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Lead Time</span>
          </div>
          <span className="text-sm font-semibold text-gray-800">
            {supplier.leadTime} day{supplier.leadTime !== 1 ? "s" : ""}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Package className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Products</span>
          </div>
          <span className="text-sm font-semibold text-gray-800">
            {supplier.products?.length || 0}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-gray-400" />
            <span className="text-sm text-gray-600">Updated</span>
          </div>
          <span className="text-sm text-gray-600">
            {new Date(supplier.updatedAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div
            className={`h-2 w-2 rounded-full ${
              supplier.leadTime <= 3
                ? "bg-green-500"
                : supplier.leadTime <= 7
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
          />
          <span className="text-xs font-medium text-gray-600">
            {supplier.leadTime <= 3
              ? "Fast Delivery"
              : supplier.leadTime <= 7
              ? "Standard Delivery"
              : "Slow Delivery"}
          </span>
        </div>

        {supplier.deletedAt && (
          <span className="text-xs bg-red-50 text-red-600 px-2 py-1 rounded-full">
            Inactive
          </span>
        )}
      </div>

      <div className="flex gap-2 pt-4 border-t border-gray-100">
        <Link
          href={`/dashboard/supplier/${supplier.id}`}
          className="flex-1 flex items-center justify-center gap-1 bg-purple-50 text-purple-600 hover:bg-purple-100 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200"
        >
          {" "}
          <Eye className="h-3 w-3" />
          View
        </Link>

        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogTrigger asChild>
            <button className="flex-1 flex items-center justify-center gap-1 bg-green-50 text-green-600 hover:bg-green-100 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200">
              <Edit className="h-3 w-3" />
              Edit
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
                      setEditForm((prev) => ({ ...prev, name: e.target.value }))
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
                  <p className="text-xs text-gray-500">
                    Average delivery time in days
                  </p>
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-4">
              <button
                onClick={() => setIsEditDialogOpen(false)}
                className="flex items-center gap-2 flex-1 justify-center border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-medium transition-all duration-200"
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={!editForm.name.trim()}
                className="flex items-center gap-2 flex-1 justify-center bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200"
              >
                <Save className="h-4 w-4" />
                Save Changes
              </button>
            </div>
          </DialogContent>
        </Dialog>

        {/* Delete Supplier Alert Dialog */}
        <AlertDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
        >
          <AlertDialogTrigger asChild>
            <button className="flex-1 flex items-center justify-center gap-1 bg-red-50 text-red-600 hover:bg-red-100 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200">
              <Trash2 className="h-3 w-3" />
              Delete
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
                <strong>"{supplier.name}"</strong>? This action cannot be
                undone.
              </AlertDialogDescription>
            </AlertDialogHeader>

            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mt-4">
              <div className="flex items-start gap-3">
                <Trash2 className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm text-red-800">
                  <strong>Warning:</strong> This will permanently delete the
                  supplier and may affect associated products.
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
  );
}
