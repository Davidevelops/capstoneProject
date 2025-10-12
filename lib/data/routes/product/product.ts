import { ProductGroup } from "@/lib/types";
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
