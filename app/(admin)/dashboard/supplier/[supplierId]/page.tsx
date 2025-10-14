import { getSupplier, getSuppliers } from "@/lib/data/routes/supplier/supplier";
import React from "react";
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
} from "lucide-react";
import Link from "next/link";

export async function generateStaticParams() {
  const suppliers = await getSuppliers();

  return (
    suppliers?.map((supplier) => ({
      id: supplier.id,
    })) || []
  );
}

interface Props {
  params: {
    supplierId: string;
  };
}

export default async function Page({ params }: Props) {
  const { supplierId } = params;
  const supplier = await getSupplier(supplierId);

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
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-6 py-3 rounded-xl font-semibold transition-all duration-200"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Link>
          </div>
        </div>
      </div>
    );
  }

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

  const leadTimeStatus = getLeadTimeStatus(supplier.leadTime);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-white p-6">
      <div className="max-w-[95rem] mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-purple-600 hover:text-purple-700 transition-colors duration-200 p-2 hover:bg-purple-50 rounded-lg"
          >
            <ArrowLeft className="h-5 w-5" />
            <span className="font-medium">Back</span>
          </Link>
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
                <button className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl font-semibold transition-all duration-200 shadow-sm">
                  <Edit className="h-4 w-4" />
                  Edit Supplier
                </button>
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
                <span className="bg-purple-50 text-purple-600 px-4 py-2 rounded-full text-sm font-medium">
                  {supplier.products?.length || 0} product
                  {supplier.products?.length !== 1 ? "s" : ""}
                </span>
              </div>

              {supplier.products && supplier.products.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {supplier.products.map((product) => (
                    <div
                      key={product.id}
                      className="p-4 bg-gray-50 rounded-xl border border-gray-100 hover:shadow-md transition-all duration-200"
                    >
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
                    Products will appear here when added to this supplier
                  </p>
                </div>
              )}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-purple-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-purple-600" />
                Quick Actions
              </h2>
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-2 bg-purple-50 text-purple-600 hover:bg-purple-100 px-4 py-3 rounded-xl font-medium transition-all duration-200">
                  <Edit className="h-4 w-4" />
                  Edit Supplier Details
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-green-50 text-green-600 hover:bg-green-100 px-4 py-3 rounded-xl font-medium transition-all duration-200">
                  <Package className="h-4 w-4" />
                  Add New Product
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-blue-50 text-blue-600 hover:bg-blue-100 px-4 py-3 rounded-xl font-medium transition-all duration-200">
                  <TrendingUp className="h-4 w-4" />
                  View Performance Report
                </button>
                <button className="w-full flex items-center justify-center gap-2 bg-red-50 text-red-600 hover:bg-red-100 px-4 py-3 rounded-xl font-medium transition-all duration-200">
                  <Package className="h-4 w-4" />
                  Manage Inventory
                </button>
              </div>
            </div>

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
