export interface ProductSetting {
  classification: "fast" | "medium" | "slow";
  serviceLevel: number;
  fillRate: number;
  safetyStockCalculationMethod: "dynamic" | "static" | "manual";
}

export interface SingleProduct {
  id: string;
  groupId: string;
  accountId: string;
  name: string;
  safetyStock: number;
  stock: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  setting: ProductSetting;
}

export interface ProductGroup {
  accountId: string;
  createdAt: string;
  deletedAt: string | null;
  id: string;
  name: string;
  productCategoryId: string | null;
  updatedAt: string;
  products: SingleProduct[];
}

export interface Product {
  products: ProductGroup[];
}

export interface Supplier {
  id: string;
  accountId: string;
  name: string;
  leadTime: number;
  createdAt: string;
  deletedAt: string | null;
  updatedAt: string;
  products: any[];
}
