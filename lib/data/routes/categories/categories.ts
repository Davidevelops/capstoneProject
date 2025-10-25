import axios from "axios"
import { apiEndpoints } from "@/lib/apiEndpoints"
import { Category } from "@/lib/types"

export const getCategories = async (): Promise<Category[] | null> => {
	try {
		const res = await axios.get(apiEndpoints.categories())
		return res.data.data
	} catch (error) {
		console.error("Error fetching categories:", error)
		return null
	}
}

export const createCategory = async (categoryData: {
	name: string
	description?: string
}): Promise<Category | null> => {
	try {
		const res = await axios.post(apiEndpoints.categories(), categoryData)
		return res.data.data
	} catch (error) {
		console.error("Error creating category:", error)
		return null
	}
}

export const updateCategory = async (
	categoryId: string,
	categoryData: { name: string; description?: string },
): Promise<Category | null> => {
	try {
		const res = await axios.put(
			apiEndpoints.categories(categoryId),
			categoryData,
		)
		return res.data.data
	} catch (error) {
		console.error("Error updating category:", error)
		return null
	}
}

export const deleteCategory = async (categoryId: string): Promise<boolean> => {
	try {
		await axios.delete(apiEndpoints.categories(categoryId))
		return true
	} catch (error) {
		console.error("Error deleting category:", error)
		return false
	}
}
