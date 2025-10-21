import ProductDetails from "@/components/productDetails";
import { SingleProduct } from "@/lib/types";
import axios from "axios";

interface pageProps {
	params: {
		groupId: string;
		productId: string;
	};
}

export default async function page({ params }: pageProps) {
	const { groupId, productId } = params;

	const getProductDetails = async (): Promise<SingleProduct | null> => {
		try {
			let api_url = process.env.NEXT_PUBLIC_PRODUCT_API as string;
			let response = await axios.get(
				`${api_url}/${groupId}/products/${productId}`
			);

			return response.data;
		} catch (error) {
			console.log(
				"An error occured while trying to fetch product details: ",
				error
			);
			return null;
		}
	};

	const data = await getProductDetails();

	return (
		<div>
			{data ? <ProductDetails product={data} /> : <div>Product not found</div>}
		</div>
	);
}
