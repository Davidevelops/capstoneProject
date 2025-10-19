import {
  Delivery,
  DeliveriesResponse,
  CreateDeliveryData,
  UpdateDeliveryStatusData,
  UpdateDeliveryScheduleData,
} from "@/lib/types";
import axios from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_DELIVERY_API as string;

export const getAllDeliveries = async (): Promise<Delivery[] | null> => {
  try {
    const response = await axios.get<DeliveriesResponse>(BASE_URL);
    return response.data.data;
  } catch (error) {
    console.error("Error while getting deliveries: ", error);
    return null;
  }
};

export const getDelivery = async (
  deliveryId: string
): Promise<Delivery | null> => {
  try {
    const response = await axios.get<{ data: Delivery }>(
      `${BASE_URL}/${deliveryId}`
    );
    return response.data.data;
  } catch (error) {
    console.error("Error while getting delivery: ", error);
    return null;
  }
};

export const createDelivery = async (
  deliveryData: CreateDeliveryData
): Promise<Delivery> => {
  try {
    const response = await axios.post<{ data: Delivery }>(
      BASE_URL,
      deliveryData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Error while creating delivery: ", error);
    console.error("Error details:", error.response?.data);
    throw error;
  }
};

export const completeDelivery = async (
  deliveryId: string,
  updateData: UpdateDeliveryStatusData
): Promise<Delivery> => {
  try {
    const response = await axios.patch<{ data: Delivery }>(
      `${BASE_URL}/${deliveryId}`,
      updateData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Error while completing delivery: ", error);
    console.error("Error details:", error.response?.data);
    throw error;
  }
};

export const cancelDelivery = async (
  deliveryId: string,
  cancellationData: UpdateDeliveryStatusData
): Promise<Delivery> => {
  try {
    const response = await axios.patch<{ data: Delivery }>(
      `${BASE_URL}/${deliveryId}`,
      cancellationData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Error while cancelling delivery: ", error);
    console.error("Error details:", error.response?.data);
    throw error;
  }
};

export const updateDeliverySchedule = async (
  deliveryId: string,
  scheduleData: UpdateDeliveryScheduleData
): Promise<Delivery> => {
  try {
    const response = await axios.patch<{ data: Delivery }>(
      `${BASE_URL}/${deliveryId}`,
      scheduleData,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    return response.data.data;
  } catch (error: any) {
    console.error("Error while updating delivery schedule: ", error);
    console.error("Error details:", error.response?.data);
    throw error;
  }
};

export const deleteDelivery = async (deliveryId: string): Promise<void> => {
  try {
    await axios.delete(`${BASE_URL}/${deliveryId}`);
  } catch (error: any) {
    console.error("Error while deleting delivery: ", error);
    console.error("Error details:", error.response?.data);
    throw error;
  }
};
