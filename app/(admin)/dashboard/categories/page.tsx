"use client"

import { useState, useEffect } from "react"
import { Category } from "@/lib/types"
import {
	Folder,
	TrendingUp,
	AlertCircle,
	BarChart3,
	Search,
	ChevronLeft,
	ChevronRight,
	Plus,
	Edit3,
	Trash2,
} from "lucide-react"
import {
	getCategories,
	createCategory,
	updateCategory,
	deleteCategory,
} from "@/lib/data/routes/categories/categories"
import CategoryForm from "@/components/Category"

export default function CategoriesPage() {
	const [categories, setCategories] = useState<Category[] | null>(null)
	const [loading, setLoading] = useState(true)
	const [searchTerm, setSearchTerm] = useState("")
	const [currentPage, setCurrentPage] = useState(1)
	const [isFormOpen, setIsFormOpen] = useState(false)
	const [editingCategory, setEditingCategory] = useState<Category | null>(null)
	const [isSubmitting, setIsSubmitting] = useState(false)
	const itemsPerPage = 10

	const fetchCategoriesData = async () => {
		try {
			const categoriesData = await getCategories()
			setCategories(categoriesData)
		} catch (error) {
			setCategories(null)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchCategoriesData()
	}, [])

	// Filter categories based on search term
	const filteredCategories =
		categories?.filter(
			(category) =>
				category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
				category.description?.toLowerCase().includes(searchTerm.toLowerCase()),
		) || []

	// Pagination calculations
	const totalPages = Math.ceil(filteredCategories.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const paginatedCategories = filteredCategories.slice(
		startIndex,
		startIndex + itemsPerPage,
	)

	const handleCreateCategory = async (categoryData: {
		name: string
		description?: string
	}) => {
		setIsSubmitting(true)
		const newCategory = await createCategory(categoryData)
		if (newCategory) {
			await fetchCategoriesData()
			setIsFormOpen(false)
		}
		setIsSubmitting(false)
	}

	const handleUpdateCategory = async (categoryData: {
		name: string
		description?: string
	}) => {
		if (!editingCategory) return

		setIsSubmitting(true)
		const updatedCategory = await updateCategory(
			editingCategory.id,
			categoryData,
		)
		if (updatedCategory) {
			await fetchCategoriesData()
			setEditingCategory(null)
			setIsFormOpen(false)
		}
		setIsSubmitting(false)
	}

	const handleDeleteCategory = async (categoryId: string) => {
		if (
			window.confirm(
				"Are you sure you want to delete this category? This action cannot be undone.",
			)
		) {
			const success = await deleteCategory(categoryId)
			if (success) {
				await fetchCategoriesData()
			}
		}
	}

	const handleEdit = (category: Category) => {
		setEditingCategory(category)
		setIsFormOpen(true)
	}

	const handleCloseForm = () => {
		setIsFormOpen(false)
		setEditingCategory(null)
	}

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
		})
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6">
				<div className="max-w-7xl mx-auto">
					{/* Loading skeleton - same as before but adjusted for categories */}
					<div className="flex items-center justify-between mb-8">
						<div className="flex items-center gap-4">
							<div className="w-14 h-14 bg-gradient-to-br from-gray-200 to-gray-300 rounded-2xl animate-pulse shadow-sm"></div>
							<div className="space-y-3">
								<div className="h-9 w-56 bg-gradient-to-r from-gray-200 to-gray-300 rounded-lg animate-pulse"></div>
								<div className="flex gap-4">
									<div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
									<div className="h-5 w-28 bg-gray-200 rounded animate-pulse"></div>
								</div>
							</div>
						</div>
						<div className="flex gap-3">
							<div className="h-12 w-12 bg-gray-200 rounded-xl animate-pulse"></div>
							<div className="h-12 w-36 bg-gray-200 rounded-xl animate-pulse"></div>
						</div>
					</div>

					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						{[...Array(3)].map((_, i) => (
							<div
								key={i}
								className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xs border border-gray-100/80 animate-pulse"
							>
								<div className="flex items-center justify-between">
									<div className="space-y-2">
										<div className="h-6 w-20 bg-gray-200 rounded"></div>
										<div className="h-8 w-16 bg-gray-300 rounded-lg"></div>
									</div>
									<div className="w-12 h-12 bg-gray-200 rounded-xl"></div>
								</div>
							</div>
						))}
					</div>

					<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xs border border-gray-100/80 animate-pulse">
						<div className="h-10 w-48 bg-gray-200 rounded-lg mb-6"></div>
						<div className="space-y-4">
							{[...Array(5)].map((_, i) => (
								<div
									key={i}
									className="flex items-center justify-between py-4 border-b border-gray-100"
								>
									<div className="flex gap-4">
										<div className="h-12 w-12 bg-gray-200 rounded-lg"></div>
										<div className="space-y-2">
											<div className="h-4 w-32 bg-gray-200 rounded"></div>
											<div className="h-3 w-24 bg-gray-200 rounded"></div>
										</div>
									</div>
									<div className="h-6 w-20 bg-gray-200 rounded"></div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		)
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6">
			<div className="max-w-7xl mx-auto">
				{/* Header */}
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
					<div className="flex items-center gap-4 mb-4 lg:mb-0">
						<div className="relative">
							<div className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 p-3 rounded-2xl shadow-lg shadow-purple-500/20">
								<Folder className="h-8 w-8 text-white" />
							</div>
							<div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
						</div>
						<div>
							<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
								Categories
							</h1>
							<div className="flex items-center gap-4 mt-3">
								<p className="text-gray-600 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-100 shadow-xs">
									<TrendingUp className="h-4 w-4 text-purple-500" />
									<span className="font-semibold text-gray-800">
										{categories?.length || 0}
									</span>{" "}
									total categories
								</p>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<button
							onClick={() => setIsFormOpen(true)}
							className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-4 py-2.5 rounded-xl font-medium transition-all duration-200 hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30"
						>
							<Plus className="h-4 w-4" />
							Add Category
						</button>
					</div>
				</div>

				{/* Stats Cards */}
				{categories && categories.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						<div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-6 shadow-xs hover:shadow-sm transition-shadow duration-200">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-purple-700 mb-1">
										Total Categories
									</p>
									<p className="text-3xl font-bold text-gray-800">
										{categories.length}
									</p>
								</div>
								<div className="bg-white p-3 rounded-xl shadow-xs">
									<Folder className="h-6 w-6 text-purple-600" />
								</div>
							</div>
						</div>

						<div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-6 shadow-xs hover:shadow-sm transition-shadow duration-200">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-blue-700 mb-1">
										Active Categories
									</p>
									<p className="text-3xl font-bold text-gray-800">
										{categories.filter((cat) => !cat.deletedAt).length}
									</p>
								</div>
								<div className="bg-white p-3 rounded-xl shadow-xs">
									<BarChart3 className="h-6 w-6 text-blue-600" />
								</div>
							</div>
						</div>

						<div className="bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100 rounded-2xl p-6 shadow-xs hover:shadow-sm transition-shadow duration-200">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-green-700 mb-1">
										System Status
									</p>
									<p className="text-lg font-semibold text-gray-800 flex items-center gap-2">
										<span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
										Operational
									</p>
								</div>
								<div className="bg-white p-3 rounded-xl shadow-xs">
									<TrendingUp className="h-6 w-6 text-green-600" />
								</div>
							</div>
						</div>
					</div>
				)}

				{/* Search and Info Card */}
				<div className="bg-gradient-to-r from-purple-50/80 to-indigo-50/80 backdrop-blur-sm border border-purple-200/60 rounded-2xl p-6 mb-8 shadow-xs">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
						<div className="flex items-center gap-4">
							<div className="bg-white p-3 rounded-xl shadow-xs">
								<TrendingUp className="h-6 w-6 text-purple-600" />
							</div>
							<div className="flex-1">
								<h3 className="font-semibold text-gray-800 text-lg">
									Category Management
								</h3>
								<p className="text-gray-600 mt-1">
									Manage your product categories. You have{" "}
									<span className="font-semibold text-purple-600">
										{categories?.length || 0}
									</span>{" "}
									categories in your system
								</p>
							</div>
						</div>

						{/* Search Bar */}
						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
							<input
								type="text"
								placeholder="Search categories..."
								value={searchTerm}
								onChange={(e) => {
									setSearchTerm(e.target.value)
									setCurrentPage(1)
								}}
								className="pl-10 pr-4 py-2.5 bg-white/80 backdrop-blur-sm border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500 transition-all duration-200 w-full lg:w-64"
							/>
						</div>
					</div>
				</div>

				{/* Categories Table */}
				<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xs border border-gray-100/80 overflow-hidden hover:shadow-sm transition-shadow duration-200">
					{categories === null ? (
						<div className="text-center py-20">
							<div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto shadow-xs">
								<div className="bg-white p-4 rounded-2xl w-16 h-16 mx-auto mb-4 shadow-xs">
									<AlertCircle className="h-8 w-8 text-red-400 mx-auto" />
								</div>
								<h3 className="text-xl font-bold text-gray-800 mb-3">
									Failed to Load Categories
								</h3>
								<p className="text-gray-600 mb-6">
									There was an error fetching your categories data. Please check
									your connection and try again.
								</p>
								<button
									onClick={fetchCategoriesData}
									className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30"
								>
									Try Again
								</button>
							</div>
						</div>
					) : categories && categories.length === 0 ? (
						<div className="text-center py-20">
							<div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-10 max-w-md mx-auto shadow-xs">
								<div className="bg-white p-4 rounded-2xl w-20 h-20 mx-auto mb-6 shadow-xs">
									<Folder className="h-10 w-10 text-purple-400 mx-auto" />
								</div>
								<h3 className="text-2xl font-bold text-gray-800 mb-3">
									No Categories Found
								</h3>
								<p className="text-gray-600 mb-8">
									Start by creating your first product category to organize your
									inventory.
								</p>
								<button
									onClick={() => setIsFormOpen(true)}
									className="flex items-center gap-2 bg-gradient-to-r from-purple-500 to-purple-600 text-white px-6 py-3 rounded-xl font-medium transition-all duration-200 hover:from-purple-600 hover:to-purple-700 shadow-lg shadow-purple-500/25 hover:shadow-xl hover:shadow-purple-500/30 mx-auto"
								>
									<Plus className="h-4 w-4" />
									Create First Category
								</button>
							</div>
						</div>
					) : (
						<div className="p-6">
							{/* Table Header with Results Count */}
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
								<div>
									<h3 className="text-lg font-semibold text-gray-800">
										Category Records
									</h3>
									<p className="text-sm text-gray-600 mt-1">
										Showing {paginatedCategories.length} of{" "}
										{filteredCategories.length} categories
										{searchTerm &&
											` (filtered from ${categories.length} total)`}
									</p>
								</div>
							</div>

							{/* Categories Table */}
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-b border-gray-200">
											<th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
												Name
											</th>
											<th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
												Description
											</th>
											<th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
												Created
											</th>
											<th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
												Updated
											</th>
											<th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
												Actions
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-100">
										{paginatedCategories.map((category) => (
											<tr
												key={category.id}
												className="hover:bg-gray-50/50 transition-colors duration-150"
											>
												<td className="py-4 px-4">
													<div className="text-sm font-semibold text-gray-900">
														{category.name}
													</div>
												</td>
												<td className="py-4 px-4">
													<div className="text-sm text-gray-600 max-w-md">
														{category.description || "No description"}
													</div>
												</td>
												<td className="py-4 px-4">
													<div className="text-sm text-gray-500">
														{formatDate(category.createdAt)}
													</div>
												</td>
												<td className="py-4 px-4">
													<div className="text-sm text-gray-500">
														{formatDate(category.updatedAt)}
													</div>
												</td>
												<td className="py-4 px-4">
													<div className="flex items-center gap-2">
														<button
															onClick={() => handleEdit(category)}
															className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
															title="Edit category"
														>
															<Edit3 className="h-4 w-4" />
														</button>
														<button
															onClick={() => handleDeleteCategory(category.id)}
															className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
															title="Delete category"
														>
															<Trash2 className="h-4 w-4" />
														</button>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{/* Pagination */}
							{totalPages > 1 && (
								<div className="flex items-center justify-between border-t border-gray-200 pt-6 mt-6">
									<div className="text-sm text-gray-600">
										Page {currentPage} of {totalPages}
									</div>
									<div className="flex items-center gap-2">
										<button
											onClick={() =>
												setCurrentPage((prev) => Math.max(prev - 1, 1))
											}
											disabled={currentPage === 1}
											className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
										>
											<ChevronLeft className="h-4 w-4" />
											Previous
										</button>
										<button
											onClick={() =>
												setCurrentPage((prev) => Math.min(prev + 1, totalPages))
											}
											disabled={currentPage === totalPages}
											className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
										>
											Next
											<ChevronRight className="h-4 w-4" />
										</button>
									</div>
								</div>
							)}
						</div>
					)}
				</div>

				{/* Category Form Modal */}
				<CategoryForm
					category={editingCategory}
					isOpen={isFormOpen}
					onClose={handleCloseForm}
					onSave={editingCategory ? handleUpdateCategory : handleCreateCategory}
					isSubmitting={isSubmitting}
				/>
			</div>
		</div>
	)
}
