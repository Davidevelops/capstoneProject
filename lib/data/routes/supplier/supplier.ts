// lib/data/routes/supplier/supplier.ts
import axios from "axios";
import { Supplier } from "@/lib/types";

export const getSuppliers = async (): Promise<Supplier[] | null> => {
  const api_url = process.env.NEXT_PUBLIC_SUPPLIER_API as string;

  try {
    const res = await axios.get(`${api_url}?include=products`);
    console.log("📦 Suppliers API Response:", res.data);
    return res.data.data;
  } catch (error) {
    console.error("An error occurred while fetching suppliers data:", error);
    return null;
  }
};

// lib/data/routes/supplier/supplier.ts
export const getSupplier = async (id: string): Promise<Supplier | null> => {
  const api_url = process.env.NEXT_PUBLIC_SUPPLIER_API as string;

  try {
    // Add include=products to get the associated products
    const res = await axios.get(`${api_url}/${id}?include=products`);
    console.log("✅ API Response for supplier", id, ":", res.data);
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

export const addProductToSupplier = async (
  supplierId: string,
  data: { productId: string; min: number; max: number }
): Promise<Supplier | null> => {
  const api_url = process.env.NEXT_PUBLIC_SUPPLIER_API as string;

  try {
    console.log(
      "🚀 Making API request to:",
      `${api_url}/${supplierId}/products`
    );
    console.log("📦 Request data:", data);

    const res = await axios.post(`${api_url}/${supplierId}/products`, data);

    console.log("✅ API Response:", res.data);
    return res.data.data;
  } catch (error: any) {
    console.error("❌ API Error:", error);
    console.error("❌ Error response:", error.response?.data);
    console.error("❌ Error status:", error.response?.status);
    throw error;
  }
};

// Add these to your lib/data/routes/supplier/supplier.ts file

// Add these to your lib/data/routes/supplier/supplier.ts file

export const updateSupplierProduct = async (
  supplierId: string,
  productId: string,
  data: { min: number; max: number }
): Promise<Supplier | null> => {
  const api_url = process.env.NEXT_PUBLIC_SUPPLIER_API as string;

  try {
    console.log("🔄 Updating supplier product:", {
      supplierId,
      productId,
      data,
    });
    const res = await axios.patch(
      `${api_url}/${supplierId}/products/${productId}`,
      data
    );
    console.log("✅ Supplier product updated:", res.data);
    return res.data.data;
  } catch (error) {
    console.error("An error occurred while updating supplier product:", error);
    throw error;
  }
};

export const deleteSupplierProduct = async (
  supplierId: string,
  productId: string
): Promise<boolean> => {
  const api_url = process.env.NEXT_PUBLIC_SUPPLIER_API as string;

  try {
    console.log("🗑️ Deleting supplier product:", { supplierId, productId });
    await axios.delete(`${api_url}/${supplierId}/products/${productId}`);
    console.log("✅ Supplier product deleted successfully");
    return true;
  } catch (error) {
    console.error("An error occurred while deleting supplier product:", error);
    throw error;
  }
};
