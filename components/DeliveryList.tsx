"use client";

import { Delivery } from "@/lib/types";
import {
	Truck,
	Clock,
	CheckCircle,
	XCircle,
	MoreVertical,
	Edit,
	Trash2,
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
	Search,
	Package,
	Calendar,
	User,
	MapPin,
} from "lucide-react";
import { useState, useEffect } from "react";
import UpdateDelivery from "./UpdateDelivery";
import DeleteDelivery from "./DeleteDelivery";

interface DeliveryListProps {
	deliveries: Delivery[];
	onDeliveryUpdated: () => void;
}

const ITEMS_PER_PAGE = 5;

export default function DeliveryList({
	deliveries,
	onDeliveryUpdated,
}: DeliveryListProps) {
	const [selectedDelivery, setSelectedDelivery] = useState<Delivery | null>(
		null
	);
	const [actionType, setActionType] = useState<"update" | "delete" | null>(
		null
	);
	const [showMenu, setShowMenu] = useState<string | null>(null);
	const [searchTerm, setSearchTerm] = useState("");
	const [currentPage, setCurrentPage] = useState(1);
	const [itemsPerPage, setItemsPerPage] = useState(ITEMS_PER_PAGE);

	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm]);

	const filteredDeliveries = deliveries.filter((delivery) =>
		delivery.supplier.name.toLowerCase().includes(searchTerm.toLowerCase())
	);

	const totalItems = filteredDeliveries.length;
	const totalPages = Math.ceil(totalItems / itemsPerPage);
	const startIndex = (currentPage - 1) * itemsPerPage;
	const endIndex = startIndex + itemsPerPage;
	const currentDeliveries = filteredDeliveries.slice(startIndex, endIndex);

	const goToPage = (page: number) => {
		setCurrentPage(Math.max(1, Math.min(page, totalPages)));
	};

	const goToFirstPage = () => goToPage(1);
	const goToLastPage = () => goToPage(totalPages);
	const goToNextPage = () => goToPage(currentPage + 1);
	const goToPrevPage = () => goToPage(currentPage - 1);

	const getStatusConfig = (status: string) => {
		switch (status) {
			case "completed":
				return {
					icon: <CheckCircle className="h-5 w-5" />,
					bgColor: "bg-green-50",
					borderColor: "border-green-200",
					textColor: "text-green-700",
					badgeColor: "bg-green-100 text-green-800 border-green-200",
					gradient: "from-green-500 to-green-600",
				};
			case "cancelled":
				return {
					icon: <XCircle className="h-5 w-5" />,
					bgColor: "bg-red-50",
					borderColor: "border-red-200",
					textColor: "text-red-700",
					badgeColor: "bg-red-100 text-red-800 border-red-200",
					gradient: "from-red-500 to-red-600",
				};
			default:
				return {
					icon: <Clock className="h-5 w-5" />,
					bgColor: "bg-purple-50",
					borderColor: "border-purple-200",
					textColor: "text-purple-700",
					badgeColor: "bg-purple-100 text-purple-800 border-purple-200",
					gradient: "from-purple-500 to-purple-600",
				};
		}
	};

	const formatDate = (dateString: string) => {
		const date = new Date(dateString);
		return date.toLocaleDateString("en-US", {
			month: "short",
			day: "numeric",
			year: "numeric",
		});
	};

	const handleUpdate = (delivery: Delivery) => {
		setSelectedDelivery(delivery);
		setActionType("update");
		setShowMenu(null);
	};

	const handleDelete = (delivery: Delivery) => {
		setSelectedDelivery(delivery);
		setActionType("delete");
		setShowMenu(null);
	};

	const handleClose = () => {
		setSelectedDelivery(null);
		setActionType(null);
		onDeliveryUpdated();
	};

	return (
		<>
			<div className="p-6">
				<div className="flex items-center justify-between mb-6">
					<div className="flex items-center gap-3">
						<div className="bg-gradient-to-br from-purple-500 to-purple-600 p-3 rounded-2xl">
							<Truck className="h-8 w-8 text-white" />
						</div>
						<div>
							<h2 className="text-3xl font-bold text-gray-800">
								All Deliveries
							</h2>
							<p className="text-gray-600 mt-1">
								Manage and track your delivery orders
							</p>
						</div>
					</div>
					<div className="flex items-center gap-2 text-sm text-gray-500 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl border border-gray-200">
						<Truck className="h-4 w-4" />
						<span className="font-semibold text-gray-800">
							{deliveries.length}
						</span>
						<span>deliveries</span>
					</div>
				</div>

				<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xs border border-gray-100/80 mb-6">
					<div className="flex flex-col sm:flex-row gap-4 max-w-4xl mx-auto">
						<div className="flex-1 relative">
							<Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
							<input
								type="text"
								placeholder="Search deliveries by supplier name..."
								value={searchTerm}
								onChange={(e) => setSearchTerm(e.target.value)}
								className="w-full pl-12 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
							/>
						</div>
					</div>
				</div>

				<div className="grid gap-6">
					{currentDeliveries.map((delivery) => {
						const statusConfig = getStatusConfig(delivery.status);
						const totalItemsCount = delivery.items.reduce(
							(sum, item) => sum + item.quantity,
							0
						);
						const totalProducts = delivery.items.length;

						return (
							<div
								key={delivery.id}
								className="bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 border border-gray-100 shadow-xs hover:shadow-lg transition-all duration-300 hover:border-gray-300 group"
							>
								<div className="flex items-start justify-between">
									<div className="flex items-start gap-4 flex-1">
										<div
											className={`p-4 rounded-2xl ${statusConfig.bgColor} ${statusConfig.borderColor} border`}
										>
											{statusConfig.icon}
										</div>

										<div className="flex-1">
											<div className="flex items-center gap-3 mb-3">
												<h3 className="text-xl font-bold text-gray-800 group-hover:text-purple-700 transition-colors">
													Delivery #{delivery.id.slice(0, 8).toUpperCase()}
												</h3>
												<span
													className={`px-3 py-1.5 rounded-full text-sm font-semibold border ${statusConfig.badgeColor} flex items-center gap-2`}
												>
													{statusConfig.icon}
													{delivery.status.charAt(0).toUpperCase() +
														delivery.status.slice(1)}
												</span>
											</div>

											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
												<div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200">
													<User className="h-5 w-5 text-purple-600" />
													<div>
														<p className="text-sm text-gray-600">Supplier</p>
														<p className="font-semibold text-gray-800">
															{delivery.supplier.name}
														</p>
													</div>
												</div>

												<div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200">
													<Package className="h-5 w-5 text-blue-600" />
													<div>
														<p className="text-sm text-gray-600">Items</p>
														<p className="font-semibold text-gray-800">
															{totalItemsCount} total · {totalProducts} product
															{totalProducts !== 1 ? "s" : ""}
														</p>
													</div>
												</div>

												<div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200">
													<Calendar className="h-5 w-5 text-green-600" />
													<div>
														<p className="text-sm text-gray-600">Requested</p>
														<p className="font-semibold text-gray-800">
															{formatDate(delivery.requestedAt)}
														</p>
													</div>
												</div>

												{delivery.scheduledArrivalDate && (
													<div className="flex items-center gap-3 bg-white/80 backdrop-blur-sm p-3 rounded-xl border border-gray-200">
														<MapPin className="h-5 w-5 text-orange-600" />
														<div>
															<p className="text-sm text-gray-600">Arrival</p>
															<p className="font-semibold text-gray-800">
																{formatDate(delivery.scheduledArrivalDate)}
															</p>
														</div>
													</div>
												)}
											</div>

											{delivery.items.length > 0 && (
												<div className="mt-4 pt-4 border-t border-gray-200">
													<h4 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
														<Package className="h-4 w-4" />
														Delivery Items
													</h4>
													<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
														{delivery.items.map((item) => (
															<div
																key={item.id}
																className="bg-white/90 backdrop-blur-sm rounded-xl p-4 border border-gray-200 hover:border-purple-300 hover:shadow-sm transition-all duration-200 group/item"
															>
																<div className="flex items-start justify-between">
																	<div className="flex-1">
																		<p className="font-semibold text-gray-800 group-hover/item:text-purple-700 transition-colors">
																			{item.product.name}
																		</p>
																		<div className="flex items-center gap-4 mt-2 text-sm">
																			<span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-lg border border-blue-200 font-medium">
																				Qty: {item.quantity}
																			</span>
																			<span className="bg-green-50 text-green-700 px-2 py-1 rounded-lg border border-green-200">
																				Stock: {item.product.stock}
																			</span>
																		</div>
																	</div>
																</div>
															</div>
														))}
													</div>
												</div>
											)}
										</div>
									</div>

									<div className="relative">
										<button
											onClick={() =>
												setShowMenu(
													showMenu === delivery.id ? null : delivery.id
												)
											}
											className="p-3 hover:bg-gray-100 rounded-xl transition-all duration-200 border border-gray-200 hover:border-gray-300"
										>
											<MoreVertical className="h-5 w-5 text-gray-400" />
										</button>

										{showMenu === delivery.id && (
											<div className="absolute right-0 top-12 bg-white border border-gray-200 rounded-xl shadow-xl z-10 min-w-40 overflow-hidden">
												<button
													onClick={() => handleUpdate(delivery)}
													className="flex items-center gap-3 w-full px-4 py-3 text-sm text-gray-700 hover:bg-purple-50 hover:text-purple-700 transition-colors"
												>
													<Edit className="h-4 w-4" />
													Edit Delivery
												</button>
												<button
													onClick={() => handleDelete(delivery)}
													className="flex items-center gap-3 w-full px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors"
												>
													<Trash2 className="h-4 w-4" />
													Delete Delivery
												</button>
											</div>
										)}
									</div>
								</div>
							</div>
						);
					})}
				</div>

				{filteredDeliveries.length === 0 && (
					<div className="text-center py-16 bg-gradient-to-br from-white to-gray-50 border border-gray-200 rounded-2xl">
						<div className="bg-gradient-to-br from-gray-100 to-gray-200 p-6 rounded-2xl w-24 h-24 mx-auto mb-6">
							<Truck className="h-12 w-12 text-gray-400 mx-auto" />
						</div>
						<h3 className="text-2xl font-bold text-gray-700 mb-3">
							No deliveries found
						</h3>
						<p className="text-gray-500 text-lg max-w-md mx-auto">
							{searchTerm
								? "Try adjusting your search terms or try a different supplier name"
								: "Get started by creating your first delivery order"}
						</p>
					</div>
				)}

				{totalPages > 1 && (
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-xs border border-gray-100/80 mt-6">
						<div className="flex flex-col sm:flex-row items-center justify-between gap-4">
							<div className="text-sm text-gray-600">
								Showing{" "}
								<span className="font-semibold text-gray-800">
									{startIndex + 1}-{Math.min(endIndex, totalItems)}
								</span>{" "}
								of{" "}
								<span className="font-semibold text-gray-800">
									{totalItems}
								</span>{" "}
								deliver{totalItems !== 1 ? "ies" : "y"}
							</div>

							<div className="flex items-center gap-2">
								<button
									onClick={goToFirstPage}
									disabled={currentPage === 1}
									className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
								>
									<ChevronsLeft className="h-4 w-4 text-gray-600" />
								</button>

								<button
									onClick={goToPrevPage}
									disabled={currentPage === 1}
									className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
								>
									<ChevronLeft className="h-4 w-4 text-gray-600" />
								</button>

								<div className="flex items-center gap-1">
									{Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
										let pageNum;
										if (totalPages <= 5) {
											pageNum = i + 1;
										} else if (currentPage <= 3) {
											pageNum = i + 1;
										} else if (currentPage >= totalPages - 2) {
											pageNum = totalPages - 4 + i;
										} else {
											pageNum = currentPage - 2 + i;
										}

										return (
											<button
												key={pageNum}
												onClick={() => goToPage(pageNum)}
												className={`min-w-[40px] h-10 rounded-lg border transition-all duration-200 font-medium ${currentPage === pageNum
													? "bg-gradient-to-r from-purple-500 to-purple-600 text-white border-purple-600 shadow-lg shadow-purple-500/25"
													: "border-gray-200 text-gray-700 hover:bg-gray-50"
													}`}
											>
												{pageNum}
											</button>
										);
									})}
								</div>

								<button
									onClick={goToNextPage}
									disabled={currentPage === totalPages}
									className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
								>
									<ChevronRight className="h-4 w-4 text-gray-600" />
								</button>

								<button
									onClick={goToLastPage}
									disabled={currentPage === totalPages}
									className="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
								>
									<ChevronsRight className="h-4 w-4 text-gray-600" />
								</button>
							</div>

							<div className="flex items-center gap-2 text-sm">
								<span className="text-gray-600">Show:</span>
								<select
									value={itemsPerPage}
									onChange={(e) => {
										setItemsPerPage(Number(e.target.value));
										setCurrentPage(1);
									}}
									className="border border-gray-200 rounded-lg px-3 py-2 focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/80 backdrop-blur-sm"
								>
									<option value={5}>5</option>
									<option value={10}>10</option>
									<option value={20}>20</option>
									<option value={50}>50</option>
								</select>
								<span className="text-gray-600">per page</span>
							</div>
						</div>
					</div>
				)}
			</div>

			{selectedDelivery && actionType === "update" && (
				<UpdateDelivery
					delivery={selectedDelivery}
					onClose={handleClose}
					onDeliveryUpdated={onDeliveryUpdated}
				/>
			)}

			{selectedDelivery && actionType === "delete" && (
				<DeleteDelivery
					delivery={selectedDelivery}
					onClose={handleClose}
					onDeliveryDeleted={onDeliveryUpdated}
				/>
			)}
		</>
	);
}
