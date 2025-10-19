"use client";

import { Delivery } from "@/lib/types";
import {
  Truck,
  Clock,
  CheckCircle,
  XCircle,
  MoreVertical,
  Edit,
  Trash2,
} from "lucide-react";
import { useState } from "react";
import UpdateDelivery from "./UpdateDelivery";
import DeleteDelivery from "./DeleteDelivery";

interface DeliveryListProps {
  deliveries: Delivery[];
  onDeliveryUpdated: () => void;
}

export default function DeliveryList({
  deliveries,
  onDeliveryUpdated,
}: DeliveryListProps) {
  const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
    null
  );
  const [actionType, setActionType] = useState<"update" | "delete" | null>(
    null
  );
  const [showMenu, setShowMenu] = useState<string | null>(null);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "completed":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "cancelled":
        return <XCircle className="h-5 w-5 text-red-500" />;
      default:
        return <Clock className="h-5 w-5 text-amber-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800 border-green-200";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-purple-100 text-purple-800 border-purple-200";
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const handleUpdate = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setActionType("update");
    setShowMenu(null);
  };

  const handleDelete = (delivery: Delivery) => {
    setSelectedDelivery(delivery);
    setActionType("delete");
    setShowMenu(null);
  };

  const handleClose = () => {
    setSelectedDelivery(null);
    setActionType(null);
    onDeliveryUpdated();
  };

  return (
    <>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Deliveries</h2>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Truck className="h-4 w-4" />
            <span>{deliveries.length} deliveries</span>
          </div>
        </div>

        <div className="space-y-4">
          {deliveries.map((delivery) => (
            <div
              key={delivery.id}
              className="bg-white rounded-xl p-6 border border-gray-100 shadow-xs hover:shadow-sm transition-all duration-200 hover:border-gray-200"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-3 rounded-xl">
                    <Truck className="h-6 w-6 text-purple-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-800">
                      Delivery #{delivery.id.slice(0, 8)}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      Supplier: {delivery.supplier.name}
                    </p>
                    <div className="flex items-center gap-4 mt-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                          delivery.status
                        )}`}
                      >
                        {delivery.status}
                      </span>
                      <span className="text-xs text-gray-500">
                        {formatDate(delivery.requestedAt)}
                      </span>
                      {delivery.scheduledArrivalDate && (
                        <span className="text-xs text-gray-500">
                          Arrives: {formatDate(delivery.scheduledArrivalDate)}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">
                      {delivery.items.reduce(
                        (sum, item) => sum + item.quantity,
                        0
                      )}{" "}
                      items
                    </p>
                    <p className="text-sm text-gray-600">
                      {delivery.items.length} product
                      {delivery.items.length !== 1 ? "s" : ""}
                    </p>
                  </div>

                  <div className="relative">
                    <button
                      onClick={() =>
                        setShowMenu(
                          showMenu === delivery.id ? null : delivery.id
                        )
                      }
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <MoreVertical className="h-4 w-4 text-gray-400" />
                    </button>

                    {showMenu === delivery.id && (
                      <div className="absolute right-0 top-10 bg-white border border-gray-200 rounded-lg shadow-lg z-10 min-w-32">
                        <button
                          onClick={() => handleUpdate(delivery)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-gray-700 hover:bg-gray-50 first:rounded-t-lg last:rounded-b-lg"
                        >
                          <Edit className="h-4 w-4 text-purple-600" />
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(delivery)}
                          className="flex items-center gap-2 w-full px-3 py-2 text-sm text-red-600 hover:bg-red-50 first:rounded-t-lg last:rounded-b-lg"
                        >
                          <Trash2 className="h-4 w-4" />
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {delivery.items.length > 0 && (
                <div className="mt-4 pt-4 border-t border-gray-100">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">
                    Items:
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {delivery.items.map((item) => (
                      <div
                        key={item.id}
                        className="bg-gray-50 rounded-lg p-3 border border-gray-200"
                      >
                        <p className="font-medium text-gray-800">
                          {item.product.name}
                        </p>
                        <p className="text-sm text-gray-600">
                          Quantity: {item.quantity}
                        </p>
                        <p className="text-xs text-gray-500">
                          Stock: {item.product.stock}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {selectedDelivery && actionType === "update" && (
        <UpdateDelivery
          delivery={selectedDelivery}
          onClose={handleClose}
          onDeliveryUpdated={onDeliveryUpdated}
        />
      )}

      {selectedDelivery && actionType === "delete" && (
        <DeleteDelivery
          delivery={selectedDelivery}
          onClose={handleClose}
          onDeliveryDeleted={onDeliveryUpdated}
        />
      )}
    </>
  );
}
