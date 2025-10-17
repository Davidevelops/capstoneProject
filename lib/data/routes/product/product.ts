import { ProductGroup, SalesResponse, Sale } from "@/lib/types";
import axios from "axios";

export const getProductList = async (): Promise<ProductGroup[] | null> => {
  try {
    let api_url = process.env.NEXT_PUBLIC_PRODUCT_API as string;
    const response = await axios.get(api_url);

    return response.data.data;
  } catch (error) {
    console.error("Error while getting the products: ", error);
    return null;
  }
};

export const getProductSales = async (groupId: string, productId: string): Promise<SalesResponse> => {
  try {
    let api_url = process.env.NEXT_PUBLIC_PRODUCT_API as string;
    const response = await axios.get(
      `${api_url}/${groupId}/products/${productId}/sales`
    );

    return response.data;
  } catch (error) {
    console.error("Error while getting product sales: ", error);
    throw error;
  }
};

export const addSale = async (groupId: string, productId: string, saleData: { date: string; quantity: number; status: string }): Promise<Sale> => {
  try {
    let api_url = process.env.NEXT_PUBLIC_PRODUCT_API as string;
    const response = await axios.post(
      `${api_url}/${groupId}/products/${productId}/sales`,
      saleData,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error while adding sale: ", error);
    console.error("Error details:", error.response?.data);
    throw error;
  }
};

export const updateSale = async (groupId: string, productId: string, saleId: string, saleData: { date: string; quantity: number; status: string }): Promise<Sale> => {
  try {
    let api_url = process.env.NEXT_PUBLIC_PRODUCT_API as string;
    const response = await axios.patch(
      `${api_url}/${groupId}/products/${productId}/sales/${saleId}`,
      saleData,
      {
        headers: {
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("Error while updating sale: ", error);
    console.error("Error details:", error.response?.data);
    throw error;
  }
};

export const deleteSale = async (groupId: string, productId: string, saleId: string): Promise<void> => {
  try {
    let api_url = process.env.NEXT_PUBLIC_PRODUCT_API as string;
    await axios.delete(
      `${api_url}/${groupId}/products/${productId}/sales/${saleId}`
    );
  } catch (error: any) {
    console.error("Error while deleting sale: ", error);
    console.error("Error details:", error.response?.data);
    throw error;
  }
};