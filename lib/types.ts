export interface VariantSetting {
  classification: string;
  serviceLevel: number;
  fillRate: number;
  safetyStockCalculationMethod: string;
}

export interface CreateVariantInput {
  name: string;
  setting?: {
    classification: string;
    serviceLevel: number;
    fillRate: number;
    safetyStockCalculationMethod: string;
  };
}

export interface ProductVariant {
  id: string;
  name: string;
  stock: number;
  safetyStock: number;
  updatedAt: string;
  groupId: string;
  setting?: VariantSetting;
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
  setting: VariantSetting;
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

export interface Sale {
  id: string;
  accountId: string;
  productId: string;
  quantity: number;
  status: string;
  date: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

export interface SalesResponse {
  data: Sale[];
}

export interface AccountPermission {
  id: string;
  name: string;
}

export interface Account {
  id: string;
  username: string;
  role: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  permissions?: AccountPermission[];
}

export interface CreateAccountRequest {
  username: string;
  password: string;
  role: string;
}

export interface Permission {
  id: string;
  name: string;
}

export interface AssignPermissionsRequest {
  permissions: string[];
}
