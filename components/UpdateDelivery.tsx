"use client";

import { useState } from "react";
import {
  Delivery,
  UpdateDeliveryStatusData,
  UpdateDeliveryScheduleData,
} from "@/lib/types";
import { X, Calendar, Clock, Save, RotateCcw } from "lucide-react";
import {
  completeDelivery,
  cancelDelivery,
  updateDeliverySchedule,
} from "@/lib/data/routes/delivery/delivery";

interface UpdateDeliveryProps {
  delivery: Delivery;
  onClose: () => void;
  onDeliveryUpdated: () => void;
}

export default function UpdateDelivery({
  delivery,
  onClose,
  onDeliveryUpdated,
}: UpdateDeliveryProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<"status" | "schedule">("status");
  const [formData, setFormData] = useState({
    status: delivery.status,
    cancelledAt: delivery.cancelledAt || new Date().toISOString().split("T")[0],
    requestedAt: delivery.requestedAt.split("T")[0],
    scheduledArrivalDate: delivery.scheduledArrivalDate?.split("T")[0] || "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      if (activeTab === "status") {
        const updateData: UpdateDeliveryStatusData = {
          status: formData.status,
        };

        if (formData.status === "cancelled") {
          updateData.cancelledAt = formData.cancelledAt;
        }

        if (formData.status === "cancelled") {
          await cancelDelivery(delivery.id, updateData);
        } else {
          await completeDelivery(delivery.id, updateData);
        }
      } else {
        const scheduleData: UpdateDeliveryScheduleData = {
          requestedAt: formData.requestedAt,
          scheduledArrivalDate: formData.scheduledArrivalDate,
        };
        await updateDeliverySchedule(delivery.id, scheduleData);
      }

      onDeliveryUpdated();
      onClose();
    } catch (error) {
      console.error("Error updating delivery:", error);
      alert("Failed to update delivery. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-purple-600" />
            Update Delivery
          </h3>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-6">
          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
            <button
              type="button"
              onClick={() => setActiveTab("status")}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
                activeTab === "status"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Clock className="h-4 w-4" />
              Status
            </button>
            <button
              type="button"
              onClick={() => setActiveTab("schedule")}
              className={`flex-1 py-2 px-3 text-sm font-medium rounded-md transition-colors flex items-center justify-center gap-2 ${
                activeTab === "schedule"
                  ? "bg-white text-purple-600 shadow-sm"
                  : "text-gray-600 hover:text-gray-800"
              }`}
            >
              <Calendar className="h-4 w-4" />
              Schedule
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {activeTab === "status" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) => handleChange("status", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  >
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                {formData.status === "cancelled" && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-purple-600" />
                      Cancellation Date
                    </label>
                    <input
                      type="date"
                      value={formData.cancelledAt}
                      onChange={(e) =>
                        handleChange("cancelledAt", e.target.value)
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                      required
                    />
                  </div>
                )}
              </>
            )}

            {activeTab === "schedule" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Clock className="h-4 w-4 text-purple-600" />
                    Requested Date
                  </label>
                  <input
                    type="date"
                    value={formData.requestedAt}
                    onChange={(e) =>
                      handleChange("requestedAt", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-purple-600" />
                    Scheduled Arrival
                  </label>
                  <input
                    type="date"
                    value={formData.scheduledArrivalDate}
                    onChange={(e) =>
                      handleChange("scheduledArrivalDate", e.target.value)
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    required
                  />
                </div>
              </>
            )}

            <div className="flex gap-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                disabled={loading}
              >
                <X className="h-4 w-4" />
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-purple-500 hover:bg-purple-600 text-white rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Save className="h-4 w-4" />
                {loading ? "Updating..." : "Update Delivery"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
