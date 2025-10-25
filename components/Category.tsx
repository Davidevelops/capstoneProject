"use client"

import { useState } from "react"
import { Category } from "@/lib/types"
import { X, Save } from "lucide-react"

interface CategoryFormProps {
	category?: Category | null
	isOpen: boolean
	onClose: () => void
	onSave: (categoryData: {
		name: string
		description?: string
	}) => Promise<void>
	isSubmitting: boolean
}

export default function CategoryForm({
	category,
	isOpen,
	onClose,
	onSave,
	isSubmitting,
}: CategoryFormProps) {
	const [formData, setFormData] = useState({
		name: category?.name || "",
		description: category?.description || "",
	})

	const [errors, setErrors] = useState<{ name?: string }>({})

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()

		const newErrors: { name?: string } = {}
		if (!formData.name.trim()) {
			newErrors.name = "Category name is required"
		}

		if (Object.keys(newErrors).length > 0) {
			setErrors(newErrors)
			return
		}

		await onSave({
			name: formData.name.trim(),
			description: formData.description.trim() || undefined,
		})

		if (!category) {
			setFormData({ name: "", description: "" })
		}
		setErrors({})
	}

	if (!isOpen) return null

	return (
		<div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
			<div className="bg-white rounded-2xl shadow-xl w-full max-w-md">
				<div className="flex items-center justify-between p-6 border-b border-gray-200">
					<h2 className="text-xl font-bold text-gray-800">
						{category ? "Edit Category" : "Create New Category"}
					</h2>
					<button
						onClick={onClose}
						className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
					>
						<X className="h-5 w-5 text-gray-500" />
					</button>
				</div>

				<form onSubmit={handleSubmit} className="p-6 space-y-4">
					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Category Name *
						</label>
						<input
							type="text"
							value={formData.name}
							onChange={(e) =>
								setFormData({ ...formData, name: e.target.value })
							}
							className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all ${
								errors.name ? "border-red-300" : "border-gray-300"
							}`}
							placeholder="Enter category name"
						/>
						{errors.name && (
							<p className="text-red-500 text-sm mt-1">{errors.name}</p>
						)}
					</div>

					<div>
						<label className="block text-sm font-medium text-gray-700 mb-2">
							Description
						</label>
						<textarea
							value={formData.description}
							onChange={(e) =>
								setFormData({ ...formData, description: e.target.value })
							}
							rows={3}
							className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all"
							placeholder="Enter category description (optional)"
						/>
					</div>

					<div className="flex gap-3 pt-4">
						<button
							type="button"
							onClick={onClose}
							className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							disabled={isSubmitting}
							className="flex-1 px-4 py-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white rounded-lg font-medium hover:from-purple-600 hover:to-purple-700 disabled:opacity-50 transition-all flex items-center justify-center gap-2"
						>
							<Save className="h-4 w-4" />
							{isSubmitting ? "Saving..." : category ? "Update" : "Create"}
						</button>
					</div>
				</form>
			</div>
		</div>
	)
}
