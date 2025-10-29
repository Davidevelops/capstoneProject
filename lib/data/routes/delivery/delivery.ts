
import { apiEndpoints } from "@/lib/apiEndpoints";
import {
  Delivery,
  DeliveriesResponse,
  CreateDeliveryData,
  UpdateDeliveryStatusData,
  UpdateDeliveryScheduleData,
  DeliveryStatus,
} from "@/lib/types";
import axios from "axios";

export const getAllDeliveries = async (status?: DeliveryStatus): Promise<Delivery[] | null> => {
  try {
    const params = status ? { status } : {};
    const response = await axios.get<DeliveriesResponse>(
      apiEndpoints.delivery(),
      { params }
    );
    return response.data.data;
  } catch (error) {
    console.error("Error while getting deliveries: ", error);
    return null;
  }
};

export const getDelivery = async (
  deliveryId: string,
): Promise<Delivery | null> => {
  try {
    const response = await axios.get<{ data: Delivery }>(
      apiEndpoints.delivery(deliveryId),
    );
    return response.data.data;
  } catch (error) {
    return null;
  }
};

export const createDelivery = async (
  deliveryData: CreateDeliveryData,
): Promise<Delivery> => {
  try {
    const response = await axios.post<{ data: Delivery }>(
      apiEndpoints.delivery(),
      deliveryData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

export const completeDelivery = async (
  deliveryId: string,
  updateData: UpdateDeliveryStatusData,
): Promise<Delivery> => {
  try {
    const response = await axios.patch<{ data: Delivery }>(
      apiEndpoints.delivery(deliveryId),
      updateData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

export const cancelDelivery = async (
  deliveryId: string,
  cancellationData: UpdateDeliveryStatusData,
): Promise<Delivery> => {
  try {
    const response = await axios.patch<{ data: Delivery }>(
      apiEndpoints.delivery(deliveryId),
      cancellationData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

export const updateDeliverySchedule = async (
  deliveryId: string,
  scheduleData: UpdateDeliveryScheduleData,
): Promise<Delivery> => {
  try {
    const response = await axios.patch<{ data: Delivery }>(
      apiEndpoints.delivery(deliveryId),
      scheduleData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.data;
  } catch (error: any) {
    throw error;
  }
};

export const deleteDelivery = async (deliveryId: string): Promise<void> => {
  try {
    await axios.delete(apiEndpoints.delivery(deliveryId));
  } catch (error: any) {
    throw error;
  }
};