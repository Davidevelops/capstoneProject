"use client"

import { useState, useEffect } from "react"
import { Sale } from "@/lib/types"
import {
	ShoppingCart,
	TrendingUp,
	AlertCircle,
	BarChart3,
	Search,
	ChevronLeft,
	ChevronRight,
} from "lucide-react"
import { getSales } from "@/lib/data/routes/sales/sales"

export default function SalesPage() {
	const [sales, setSales] = useState<Sale[] | null>(null)
	const [loading, setLoading] = useState(true)
	const [searchTerm, setSearchTerm] = useState("")
	const [currentPage, setCurrentPage] = useState(1)
	const itemsPerPage = 10

	const fetchSalesData = async () => {
		try {
			const salesData = await getSales()
			setSales(salesData)
		} catch (error) {
			setSales(null)
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		fetchSalesData()
	}, [])

	const filteredSales =
		sales?.filter(
			(sale) =>
				sale.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
				sale.accountId.toLowerCase().includes(searchTerm.toLowerCase()) ||
				sale.productId.toLowerCase().includes(searchTerm.toLowerCase()) ||
				sale.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
				sale.quantity.toString().includes(searchTerm),
		) || []

	const totalPages = Math.ceil(filteredSales.length / itemsPerPage)
	const startIndex = (currentPage - 1) * itemsPerPage
	const paginatedSales = filteredSales.slice(
		startIndex,
		startIndex + itemsPerPage,
	)

	const totalSales = sales?.length || 0
	const totalQuantity =
		sales?.reduce((total, sale) => total + sale.quantity, 0) || 0
	const completedSales =
		sales?.filter((sale) => sale.status === "completed").length || 0

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString("en-US", {
			year: "numeric",
			month: "short",
			day: "numeric",
			hour: "2-digit",
			minute: "2-digit",
		})
	}

	const getStatusBadge = (status: string) => {
		let colorClass = "bg-gray-100 text-gray-800"

		if (status === "completed") {
			colorClass = "bg-green-100 text-green-800"
		} else if (status === "pending") {
			colorClass = "bg-yellow-100 text-yellow-800"
		} else if (status === "cancelled") {
			colorClass = "bg-red-100 text-red-800"
		}

		return (
			<span
				className={`px-2 py-1 rounded-full text-xs font-medium ${colorClass}`}
			>
				{status}
			</span>
		)
	}

	if (loading) {
		return (
			<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6">
				<div className="max-w-7xl mx-auto">
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
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
					<div className="flex items-center gap-4 mb-4 lg:mb-0">
						<div className="relative">
							<div className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 p-3 rounded-2xl shadow-lg shadow-purple-500/20">
								<ShoppingCart className="h-8 w-8 text-white" />
							</div>
							<div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
						</div>
						<div>
							<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
								Sales Dashboard
							</h1>
							<div className="flex items-center gap-4 mt-3">
								<p className="text-gray-600 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-100 shadow-xs">
									<TrendingUp className="h-4 w-4 text-purple-500" />
									<span className="font-semibold text-gray-800">
										{totalSales}
									</span>{" "}
									total sales
								</p>
								<p className="text-gray-600 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-100 shadow-xs">
									<BarChart3 className="h-4 w-4 text-blue-500" />
									<span className="font-semibold text-gray-800">
										{totalQuantity}
									</span>{" "}
									items sold
								</p>
							</div>
						</div>
					</div>
				</div>

				{sales && sales.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						<div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-100 rounded-2xl p-6 shadow-xs hover:shadow-sm transition-shadow duration-200">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-purple-700 mb-1">
										Total Sales
									</p>
									<p className="text-3xl font-bold text-gray-800">
										{totalSales}
									</p>
								</div>
								<div className="bg-white p-3 rounded-xl shadow-xs">
									<ShoppingCart className="h-6 w-6 text-purple-600" />
								</div>
							</div>
						</div>

						<div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-100 rounded-2xl p-6 shadow-xs hover:shadow-sm transition-shadow duration-200">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-blue-700 mb-1">
										Items Sold
									</p>
									<p className="text-3xl font-bold text-gray-800">
										{totalQuantity}
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
										Completed
									</p>
									<p className="text-3xl font-bold text-gray-800">
										{completedSales}
									</p>
								</div>
								<div className="bg-white p-3 rounded-xl shadow-xs">
									<TrendingUp className="h-6 w-6 text-green-600" />
								</div>
							</div>
						</div>
					</div>
				)}

				<div className="bg-gradient-to-r from-purple-50/80 to-indigo-50/80 backdrop-blur-sm border border-purple-200/60 rounded-2xl p-6 mb-8 shadow-xs">
					<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
						<div className="flex items-center gap-4">
							<div className="bg-white p-3 rounded-xl shadow-xs">
								<TrendingUp className="h-6 w-6 text-purple-600" />
							</div>
							<div className="flex-1">
								<h3 className="font-semibold text-gray-800 text-lg">
									Sales Management Dashboard
								</h3>
								<p className="text-gray-600 mt-1">
									Monitor your sales performance with{" "}
									<span className="font-semibold text-purple-600">
										{totalSales}
									</span>{" "}
									total sales and{" "}
									<span className="font-semibold text-purple-600">
										{totalQuantity}
									</span>{" "}
									items sold
								</p>
							</div>
						</div>

						<div className="relative">
							<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
							<input
								type="text"
								placeholder="Search sales..."
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

				<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xs border border-gray-100/80 overflow-hidden hover:shadow-sm transition-shadow duration-200">
					{sales === null ? (
						<div className="text-center py-20">
							<div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto shadow-xs">
								<div className="bg-white p-4 rounded-2xl w-16 h-16 mx-auto mb-4 shadow-xs">
									<AlertCircle className="h-8 w-8 text-red-400 mx-auto" />
								</div>
								<h3 className="text-xl font-bold text-gray-800 mb-3">
									Failed to Load Sales
								</h3>
								<p className="text-gray-600 mb-6">
									There was an error fetching your sales data. Please check your
									connection and try again.
								</p>
								<button
									onClick={fetchSalesData}
									className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30"
								>
									Try Again
								</button>
							</div>
						</div>
					) : sales && sales.length === 0 ? (
						<div className="text-center py-20">
							<div className="bg-gradient-to-br from-purple-50 to-indigo-50 border border-purple-200 rounded-2xl p-10 max-w-md mx-auto shadow-xs">
								<div className="bg-white p-4 rounded-2xl w-20 h-20 mx-auto mb-6 shadow-xs">
									<ShoppingCart className="h-10 w-10 text-purple-400 mx-auto" />
								</div>
								<h3 className="text-2xl font-bold text-gray-800 mb-3">
									No Sales Found
								</h3>
								<p className="text-gray-600 mb-8">
									Sales records will appear here once transactions are
									processed.
								</p>
							</div>
						</div>
					) : (
						<div className="p-6">
							{/* Table Header with Results Count */}
							<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
								<div>
									<h3 className="text-lg font-semibold text-gray-800">
										Sales Records
									</h3>
									<p className="text-sm text-gray-600 mt-1">
										Showing {paginatedSales.length} of {filteredSales.length}{" "}
										sales
										{searchTerm && ` (filtered from ${sales.length} total)`}
									</p>
								</div>
							</div>

							{/* Sales Table */}
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-b border-gray-200">
											<th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
												Sale ID
											</th>
											<th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
												Account
											</th>
											<th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
												Product
											</th>
											<th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
												Quantity
											</th>
											<th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
												Status
											</th>
											<th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
												Sale Date
											</th>
											<th className="text-left py-3 px-4 text-sm font-medium text-gray-600">
												Created
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-100">
										{paginatedSales.map((sale) => (
											<tr
												key={sale.id}
												className="hover:bg-gray-50/50 transition-colors duration-150"
											>
												<td className="py-4 px-4">
													<div
														className="text-sm font-mono text-gray-900"
														title={sale.id}
													>
														{sale.id.slice(0, 8)}...
													</div>
												</td>
												<td className="py-4 px-4">
													<div
														className="text-sm text-gray-900"
														title={sale.accountId}
													>
														{sale.accountId.slice(0, 8)}...
													</div>
												</td>
												<td className="py-4 px-4">
													<div
														className="text-sm text-gray-900"
														title={sale.productId}
													>
														{sale.productId.slice(0, 8)}...
													</div>
												</td>
												<td className="py-4 px-4">
													<div className="text-sm font-semibold text-gray-900">
														{sale.quantity}
													</div>
												</td>
												<td className="py-4 px-4">
													{getStatusBadge(sale.status)}
												</td>
												<td className="py-4 px-4">
													<div className="text-sm text-gray-900">
														{formatDate(sale.date)}
													</div>
												</td>
												<td className="py-4 px-4">
													<div className="text-sm text-gray-500">
														{formatDate(sale.createdAt)}
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
			</div>
		</div>
	)
}
