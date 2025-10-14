import axios from "axios";
import { Supplier } from "@/lib/types";

export const getSuppliers = async (): Promise<Supplier[] | null> => {
  const api_url = process.env.NEXT_PUBLIC_SUPPLIER_API as string;

  try {
    const res = await axios.get(`${api_url}`);
    return res.data.data;
  } catch (error) {
    console.error("An error occurred while fetching suppliers data:", error);
    return null;
  }
};

export const getSupplier = async (id: string): Promise<Supplier | null> => {
  const api_url = process.env.NEXT_PUBLIC_SUPPLIER_API as string;

  try {
    const res = await axios.get(`${api_url}/${id}`);
    console.log("✅ API Response:", res.data); // This shows the full response

    // Your API returns { data: { ...supplierData } }
    // So return res.data.data to get the actual supplier object
    return res.data.data;
  } catch (error) {
    console.error("An error occurred while fetching supplier data:", error);
    return null;
  }
};
export const updateSupplier = async (
  supplierId: string,
  data: { name: string; leadTime: number }
): Promise<Supplier | null> => {
  const api_url = process.env.NEXT_PUBLIC_SUPPLIER_API as string;

  try {
    const res = await axios.patch(`${api_url}/${supplierId}`, data);
    return res.data.data;
  } catch (error) {
    console.error("An error occurred while updating supplier:", error);
    throw error;
  }
};

export const deleteSupplier = async (supplierId: string): Promise<boolean> => {
  const api_url = process.env.NEXT_PUBLIC_SUPPLIER_API as string;

  try {
    await axios.delete(`${api_url}/${supplierId}`);
    return true;
  } catch (error) {
    console.error("An error occurred while deleting supplier:", error);
    throw error;
  }
};

export const createSupplier = async (data: {
  name: string;
  leadTime: number;
}): Promise<Supplier | null> => {
  const api_url = process.env.NEXT_PUBLIC_SUPPLIER_API as string;

  try {
    const res = await axios.post(`${api_url}`, data);
    return res.data.data;
  } catch (error) {
    console.error("An error occurred while creating supplier:", error);
    throw error;
  }
};
