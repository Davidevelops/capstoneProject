"use client";

import { useState, useEffect } from "react";
import { Delivery } from "@/lib/types";
import DeliveryList from "@/components/DeliveryList";
import CreateDelivery from "@/components/CreateDelivery";
import {
	Truck,
	Clock,
	CheckCircle,
	XCircle,
	RefreshCw,
	AlertCircle,
	Package,
	Filter,
	Calendar,
} from "lucide-react";
import { getAllDeliveries } from "@/lib/data/routes/delivery/delivery";

export default function DeliveriesPage() {
	const [deliveries, setDeliveries] = useState<Delivery[] | null>(null);
	const [loading, setLoading] = useState(true);
	const [refreshing, setRefreshing] = useState(false);

	const fetchDeliveries = async () => {
		try {
			setRefreshing(true);
			const data = await getAllDeliveries();
			setDeliveries(data);
		} catch (error) {
			console.error("Error while getting deliveries: ", error);
			setDeliveries(null);
		} finally {
			setLoading(false);
			setRefreshing(false);
		}
	};

	useEffect(() => {
		fetchDeliveries();
	}, []);

	const getStatusStats = () => {
		if (!deliveries) return { pending: 0, completed: 0, cancelled: 0 };

		return {
			pending: deliveries.filter((d) => d.status === "pending").length,
			completed: deliveries.filter((d) => d.status === "completed").length,
			cancelled: deliveries.filter((d) => d.status === "cancelled").length,
		};
	};

	const getTotalItems = () => {
		if (!deliveries) return 0;
		return deliveries.reduce(
			(total, delivery) =>
				total + delivery.items.reduce((sum, item) => sum + item.quantity, 0),
			0
		);
	};

	const statusStats = getStatusStats();
	const totalItems = getTotalItems();

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

					<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
						{[...Array(4)].map((_, i) => (
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

					<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xs border border-gray-100/80 overflow-hidden">
						<div className="p-6 border-b border-gray-100">
							<div className="h-7 w-48 bg-gray-200 rounded-lg animate-pulse"></div>
						</div>
						<div className="p-6">
							{[...Array(5)].map((_, i) => (
								<div
									key={i}
									className="flex items-center justify-between py-4 border-b border-gray-100 last:border-b-0"
								>
									<div className="flex items-center gap-4">
										<div className="w-10 h-10 bg-gray-200 rounded-lg animate-pulse"></div>
										<div className="space-y-2">
											<div className="h-5 w-32 bg-gray-200 rounded animate-pulse"></div>
											<div className="h-4 w-24 bg-gray-200 rounded animate-pulse"></div>
										</div>
									</div>
									<div className="flex items-center gap-4">
										<div className="h-8 w-20 bg-gray-200 rounded-lg animate-pulse"></div>
										<div className="h-9 w-9 bg-gray-200 rounded-lg animate-pulse"></div>
									</div>
								</div>
							))}
						</div>
					</div>
				</div>
			</div>
		);
	}

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
					<div className="flex items-center gap-4 mb-4 lg:mb-0">
						<div className="relative">
							<div className="bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 p-3 rounded-2xl shadow-lg shadow-blue-500/20">
								<Truck className="h-8 w-8 text-white" />
							</div>
							<div className="absolute -top-1 -right-1 w-5 h-5 bg-green-400 border-2 border-white rounded-full animate-pulse"></div>
						</div>
						<div>
							<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
								Delivery Management
							</h1>
							<div className="flex items-center gap-4 mt-3">
								<p className="text-gray-600 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-100 shadow-xs">
									<Package className="h-4 w-4 text-blue-500" />
									<span className="font-semibold text-gray-800">
										{deliveries?.length || 0}
									</span>{" "}
									total deliveries
								</p>
								<p className="text-gray-600 flex items-center gap-2 bg-white/80 backdrop-blur-sm px-3 py-1.5 rounded-lg border border-gray-100 shadow-xs">
									<Calendar className="h-4 w-4 text-green-500" />
									<span className="font-semibold text-gray-800">
										{totalItems}
									</span>{" "}
									total items
								</p>
							</div>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<button
							onClick={fetchDeliveries}
							disabled={refreshing}
							className="flex items-center gap-2 bg-white/80 backdrop-blur-sm hover:bg-white border border-gray-200 text-gray-700 px-4 py-3 rounded-xl font-medium transition-all duration-200 hover:shadow-md hover:border-gray-300 disabled:opacity-50"
						>
							<RefreshCw
								className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
							/>
							Refresh
						</button>

						<CreateDelivery onDeliveryCreated={fetchDeliveries} />
					</div>
				</div>

				{deliveries && deliveries.length > 0 && (
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
						<div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-2xl p-6 shadow-xs hover:shadow-sm transition-shadow duration-200">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-blue-700 mb-1">
										Total Deliveries
									</p>
									<p className="text-3xl font-bold text-gray-800">
										{deliveries.length}
									</p>
								</div>
								<div className="bg-white p-3 rounded-xl shadow-xs">
									<Truck className="h-6 w-6 text-blue-600" />
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
										{statusStats.completed}
									</p>
								</div>
								<div className="bg-white p-3 rounded-xl shadow-xs">
									<CheckCircle className="h-6 w-6 text-green-600" />
								</div>
							</div>
						</div>

						<div className="bg-gradient-to-br from-red-50 to-rose-50 border border-red-100 rounded-2xl p-6 shadow-xs hover:shadow-sm transition-shadow duration-200">
							<div className="flex items-center justify-between">
								<div>
									<p className="text-sm font-medium text-red-700 mb-1">
										Cancelled
									</p>
									<p className="text-3xl font-bold text-gray-800">
										{statusStats.cancelled}
									</p>
								</div>
								<div className="bg-white p-3 rounded-xl shadow-xs">
									<XCircle className="h-6 w-6 text-red-600" />
								</div>
							</div>
						</div>
					</div>
				)}

				{deliveries && deliveries.length > 0 && (
					<div className="bg-gradient-to-r from-blue-50/80 to-indigo-50/80 backdrop-blur-sm border border-blue-200/60 rounded-2xl p-6 mb-8 shadow-xs">
						<div className="flex items-center gap-4">
							<div className="bg-white p-3 rounded-xl shadow-xs">
								<Truck className="h-6 w-6 text-blue-600" />
							</div>
							<div className="flex-1">
								<h3 className="font-semibold text-gray-800 text-lg">
									Delivery Management Dashboard
								</h3>
								<p className="text-gray-600 mt-1">
									Track and manage{" "}
									<span className="font-semibold text-blue-600">
										{deliveries.length}
									</span>{" "}
									deliveries with{" "}
									<span className="font-semibold text-blue-600">
										{statusStats.pending}
									</span>{" "}
									pending,{" "}
									<span className="font-semibold text-blue-600">
										{statusStats.completed}
									</span>{" "}
									completed, and{" "}
									<span className="font-semibold text-blue-600">
										{statusStats.cancelled}
									</span>{" "}
									cancelled shipments
								</p>
							</div>
							<div className="hidden md:block">
								<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
							</div>
						</div>
					</div>
				)}

				<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xs border border-gray-100/80 overflow-hidden hover:shadow-sm transition-shadow duration-200">
					{deliveries === null ? (
						<div className="text-center py-20">
							<div className="bg-gradient-to-br from-red-50 to-orange-50 border border-red-200 rounded-2xl p-8 max-w-md mx-auto shadow-xs">
								<div className="bg-white p-4 rounded-2xl w-16 h-16 mx-auto mb-4 shadow-xs">
									<AlertCircle className="h-8 w-8 text-red-400 mx-auto" />
								</div>
								<h3 className="text-xl font-bold text-gray-800 mb-3">
									Failed to Load Deliveries
								</h3>
								<p className="text-gray-600 mb-6">
									There was an error fetching your delivery data. Please check
									your connection and try again.
								</p>
								<button
									onClick={fetchDeliveries}
									disabled={refreshing}
									className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white px-8 py-3 rounded-xl font-semibold transition-all duration-200 shadow-lg shadow-red-500/25 hover:shadow-xl hover:shadow-red-500/30 disabled:opacity-50"
								>
									{refreshing ? "Retrying..." : "Try Again"}
								</button>
							</div>
						</div>
					) : deliveries && deliveries.length === 0 ? (
						<div className="text-center py-20">
							<div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-200 rounded-2xl p-10 max-w-md mx-auto shadow-xs">
								<div className="bg-white p-4 rounded-2xl w-20 h-20 mx-auto mb-6 shadow-xs">
									<Truck className="h-10 w-10 text-blue-400 mx-auto" />
								</div>
								<h3 className="text-2xl font-bold text-gray-800 mb-3">
									No Deliveries Found
								</h3>
								<p className="text-gray-600 mb-8">
									Start managing your shipments by creating your first delivery.
								</p>
								<CreateDelivery onDeliveryCreated={fetchDeliveries} />
							</div>
						</div>
					) : (
						<div className="p-1">
							<DeliveryList
								deliveries={deliveries}
								onDeliveryUpdated={fetchDeliveries}
							/>
						</div>
					)}
				</div>
			</div>
		</div>
	);
}
