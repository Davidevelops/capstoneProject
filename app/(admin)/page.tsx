import { Building2, Box, Boxes } from "lucide-react";
const supplier = [
  {
    supplierName: "Supplier A",
    product: [
      {
        productName: "Product A",
        productVariants: [
          {
            variantName: "Variant name",
            restockDate: Date.now(),
            recommendedUnits: 150,
          },
          {
            variantName: "Variant Name",
            restockDate: Date.now(),
            recommendedUnits: 100,
          },
        ],
      },
      {
        productName: "Product B",
        productVariants: [
          {
            variantName: "Variant name",
            restockDate: Date.now(),
            recommendedUnits: 150,
          },
          {
            variantName: "Variant Name",
            restockDate: Date.now(),
            recommendedUnits: 100,
          },
        ],
      },
      {
        productName: "Product C",
        productVariants: [
          {
            variantName: "Variant name",
            restockDate: Date.now(),
            recommendedUnits: 150,
          },
          {
            variantName: "Variant Name",
            restockDate: Date.now(),
            recommendedUnits: 100,
          },
        ],
      },
    ],
  },
  {
    supplierName: "Supplier B",
    product: [
      {
        productName: "Product A",
        productVariants: [
          {
            variantName: "Variant name",
            restockDate: Date.now(),
            recommendedUnits: 150,
          },
          {
            variantName: "Variant Name",
            restockDate: Date.now(),
            recommendedUnits: 100,
          },
        ],
      },
      {
        productName: "Product B",
        productVariants: [
          {
            variantName: "Variant name",
            restockDate: Date.now(),
            recommendedUnits: 150,
          },
          {
            variantName: "Variant Name",
            restockDate: Date.now(),
            recommendedUnits: 100,
          },
        ],
      },
      {
        productName: "Product C",
        productVariants: [
          {
            variantName: "Variant name",
            restockDate: Date.now(),
            recommendedUnits: 150,
          },
          {
            variantName: "Variant Name",
            restockDate: Date.now(),
            recommendedUnits: 100,
          },
        ],
      },
    ],
  },
  {
    supplierName: "Supplier C",
    product: [
      {
        productName: "Product A",
        productVariants: [
          {
            variantName: "Variant name",
            restockDate: Date.now(),
            recommendedUnits: 150,
          },
          {
            variantName: "Variant Name",
            restockDate: Date.now(),
            recommendedUnits: 100,
          },
        ],
      },
      {
        productName: "Product B",
        productVariants: [
          {
            variantName: "Variant name",
            restockDate: Date.now(),
            recommendedUnits: 150,
          },
          {
            variantName: "Variant Name",
            restockDate: Date.now(),
            recommendedUnits: 100,
          },
        ],
      },
      {
        productName: "Product C",
        productVariants: [
          {
            variantName: "Variant name",
            restockDate: Date.now(),
            recommendedUnits: 150,
          },
          {
            variantName: "Variant Name",
            restockDate: Date.now(),
            recommendedUnits: 100,
          },
        ],
      },
    ],
  },
];
export default function Home() {
  return (
    <div className="p-3">
      <h1 className="text-3xl border-b p-3 my-6">Rendering list by supplier</h1>

      {supplier.map((s, index) => (
        <div
          key={index}
          className="supplier-wrapper my-3 bg-slate-200 p-5 rounded-2xl"
        >
          <span className="flex items-center gap-1 my-8 ms-2">
            <Building2 size={40} className="text-purple-700" />
            <h1 className="text-2xl font-semibold">{s.supplierName}</h1>
          </span>
          <div className="products-list bg-slate-50 p-3 rounded-3xl">
            {s.product.map((prod, index) => (
              <div className="product p-5" key={index}>
                <div className="name-container">
                  <span className="product-name flex gap-4 items-center">
                    <Boxes size={40} className="rounded bg-gray-200 p-1" />
                    <span>
                      <h1 className="font-semibold">{prod.productName}</h1>
                      <p className="text-sm text-gray-500 ms-1">All variants</p>
                    </span>
                  </span>
                </div>
                {prod.productVariants.map((variant, index) => (
                  <div
                    className="variant-container ms-4 my-3 flex justify-between p-4"
                    key={index}
                  >
                    <div className="variant-details">
                      <span className="flex gap-1">
                        <Box />
                        <h1>
                          Variant:
                          {variant.variantName}
                        </h1>
                      </span>
                      <p className="text-sm text-gray-600">
                        Restock Date:{variant.restockDate}
                      </p>
                    </div>
                    <div className="items-group flex items-center gap-8">
                      <input
                        type="number"
                        className="quantity border w-[100px] p-2"
                        placeholder="quantity"
                      />
                      <span className="badge bg-purple-300 text-purple-900 p-2 rounded-4xl">
                        recommended
                      </span>
                      <h1 className="recommended-units">
                        Recommended Units:{" "}
                        <span className="font-bold">
                          {" "}
                          {variant.recommendedUnits}{" "}
                        </span>
                      </h1>
                    </div>
                  </div>
                ))}
              </div>
            ))}
            <div className="button-container flex justify-end p-3">
              <button className=" rounded-4xl py-2 px-3 me-4 bg-purple-400 text-white hover:bg-purple-500 transition-colors duration-300 hover:cursor-pointer">
                Order now
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
