import { getProductList } from "@/lib/data/routes/product/product";
import ProductList from "@/components/productList";

export default async function ProductsPage() {
  const productGroups = await getProductList();
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Products</h1>
      {productGroups === null ? (
        <div className="text-red-500">Failed to load products.</div>
      ) : productGroups && productGroups.length === 0 ? (
        <div>No products found</div>
      ) : (
        <ProductList productGroups={productGroups} />
      )}
    </div>
  );
}
