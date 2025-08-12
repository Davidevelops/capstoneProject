import { create } from "zustand";
import axios from "axios";

export type Product = {
  id: number; // or string if you switch to UUIDs
  name: string;
  variants: number;
  category:
    | "Electronics"
    | "Clothing"
    | "Home & Garden"
    | "Accessories"
    | "Sports & Outdoors";
  status: "Active" | "Inactive" | "Low Stock";
  price: number;
  stockLevel: "Sufficient Stock" | "Restock Immediately" | "Out of Stock";
  totalSales: number;
  currentStock: number;
  forecastAccuracy: number; // percentage value
};

export type ProductState = {
  products: Product[] | null;
  product: Product | null;
  isLoading: boolean;
  error: boolean | null;
  getProducts: () => void;
  getSingleProduct: (id: string) => void;
};

const API_URL = "http://localhost:8000";

export const useProductStore = create<ProductState>((set) => ({
  products: [],
  product: null,
  isLoading: false,
  error: false,
  getProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      let res = await axios.get(`${API_URL}/products`);
      set({ products: res.data, isLoading: false, error: null });
    } catch (error: any) {
      console.log("An error occured while trying to get the products: ", error);
      set({
        isLoading: false,
        error: error.response.data.message || "Failed to get the product",
      });
    }
  },
  getSingleProduct: async (id) => {
    set({ isLoading: true, error: null });
    try {
      let res = await axios.get(`${API_URL}/products/${id}`);
      set({ product: res.data, isLoading: false, error: null });
    } catch (error: any) {
      console.log("An error occured while trying to get the products: ", error);
      set({
        isLoading: false,
        error: error.response.data.message || "Failed to get the product",
      });
    }
  },
}));
