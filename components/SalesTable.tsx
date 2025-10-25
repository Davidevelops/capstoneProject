"use client";

import { Sale } from "@/lib/types";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import {
	Package,
	Calendar,
	TrendingUp,
	ShoppingCart,
	CheckCircle,
	Clock,
	XCircle,
	DollarSign,
	BarChart3,
	Users,
	Sparkles,
	ArrowLeft,
	AlertTriangle,
	Plus,
	Eye,
	Edit,
	Trash2,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useState, useEffect } from "react";
import { addSale, updateSale, deleteSale } from "@/lib/data/routes/product/product";
import { useRouter } from "next/navigation";

interface SalesTableProps {
	sales: Sale[];
	productName: string;
	groupId: string;
	productId: string;
}

export default function SalesTable({ sales, productName, groupId, productId }: SalesTableProps) {
	const router = useRouter();
	const [isAddSaleOpen, setIsAddSaleOpen] = useState(false);
	const [isViewSaleOpen, setIsViewSaleOpen] = useState(false);
	const [isUpdateSaleOpen, setIsUpdateSaleOpen] = useState(false);
	const [isDeleteSaleOpen, setIsDeleteSaleOpen] = useState(false);
	const [selectedSale, setSelectedSale] = useState<Sale | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [showDebug, setShowDebug] = useState(false);
	const [formData, setFormData] = useState({
		date: new Date().toISOString().split('T')[0],
		quantity: 1,
		status: 'pending'
	});

	const formatDate = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric'
		});
	};

	const formatDateTime = (dateString: string) => {
		return new Date(dateString).toLocaleDateString('en-US', {
			year: 'numeric',
			month: 'short',
			day: 'numeric',
			hour: '2-digit',
			minute: '2-digit'
		});
	};

	const getStatusVariant = (status: string) => {
		switch (status.toLowerCase()) {
			case 'completed':
				return 'default';
			case 'pending':
				return 'secondary';
			case 'cancelled':
				return 'destructive';
			default:
				return 'outline';
		}
	};

	const getStatusIcon = (status: string) => {
		switch (status.toLowerCase()) {
			case 'completed':
				return <CheckCircle className="h-3 w-3" />;
			case 'pending':
				return <Clock className="h-3 w-3" />;
			case 'cancelled':
				return <XCircle className="h-3 w-3" />;
			default:
				return <Clock className="h-3 w-3" />;
		}
	};

	const getStatusColor = (status: string) => {
		switch (status.toLowerCase()) {
			case 'completed':
				return 'bg-green-50 text-green-700 border-green-200 hover:bg-green-100';
			case 'pending':
				return 'bg-yellow-50 text-yellow-700 border-yellow-200 hover:bg-yellow-100';
			case 'cancelled':
				return 'bg-red-50 text-red-700 border-red-200 hover:bg-red-100';
			default:
				return 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100';
		}
	};

	const handleViewSale = (sale: Sale) => {
		setSelectedSale(sale);
		setIsViewSaleOpen(true);
	};

	const handleUpdateSale = (sale: Sale) => {
		setSelectedSale(sale);
		setFormData({
			date: sale.date.split('T')[0],
			quantity: sale.quantity,
			status: sale.status.toLowerCase()
		});
		setIsUpdateSaleOpen(true);
	};

	const handleDeleteSale = (sale: Sale) => {
		setSelectedSale(sale);
		setIsDeleteSaleOpen(true);
	};

	const handleAddSale = async () => {
		setIsLoading(true);
		try {
			console.log("🚀 ADD SALE - ID Debug:");
			console.log("Group ID:", groupId);
			console.log("Product ID:", productId);
			console.log("Form Data:", formData);

			await addSale(groupId, productId, {
				date: formData.date,
				quantity: Number(formData.quantity),
				status: formData.status
			});

			router.refresh();
			setIsAddSaleOpen(false);
			setFormData({
				date: new Date().toISOString().split('T')[0],
				quantity: 1,
				status: 'completed'
			});
		} catch (error: any) {
			console.error("❌ Error adding sale:", error);
			console.error("Error response:", error.response?.data);
			console.error("Error status:", error.response?.status);
			const errorMessage = error.response?.data?.message || error.message;
			alert(`Failed to add sale: ${errorMessage}\n\nCheck console for details.`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleUpdate = async () => {
		if (!selectedSale) return;

		setIsLoading(true);
		try {
			console.log("🚀 UPDATE SALE - ID Debug:");
			console.log("Group ID:", groupId);
			console.log("Product ID:", productId);
			console.log("Sale ID:", selectedSale.id);
			console.log("Form Data:", formData);

			await updateSale(groupId, productId, selectedSale.id, {
				date: formData.date,
				quantity: Number(formData.quantity),
				status: formData.status
			});

			router.refresh();
			setIsUpdateSaleOpen(false);
		} catch (error: any) {
			console.error("❌ Error updating sale:", error);
			console.error("Error response:", error.response?.data);
			console.error("Error status:", error.response?.status);
			const errorMessage = error.response?.data?.message || error.message;
			alert(`Failed to update sale: ${errorMessage}\n\nCheck console for details.`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleDelete = async () => {
		if (!selectedSale) return;

		setIsLoading(true);
		try {
			console.log("🚀 DELETE SALE - ID Debug:");
			console.log("Group ID:", groupId);
			console.log("Product ID:", productId);
			console.log("Sale ID:", selectedSale.id);

			await deleteSale(groupId, productId, selectedSale.id);

			router.refresh();
			setIsDeleteSaleOpen(false);
		} catch (error: any) {
			console.error("❌ Error deleting sale:", error);
			console.error("Error response:", error.response?.data);
			console.error("Error status:", error.response?.status);
			const errorMessage = error.response?.data?.message || error.message;
			alert(`Failed to delete sale: ${errorMessage}\n\nCheck console for details.`);
		} finally {
			setIsLoading(false);
		}
	};

	const handleFormChange = (field: string, value: string | number) => {
		setFormData(prev => ({
			...prev,
			[field]: value
		}));
	};


	const totalSales = sales.reduce((sum, sale) => sum + sale.quantity, 0);
	const completedSales = sales.filter(sale => sale.status.toLowerCase() === 'completed').length;
	const pendingSales = sales.filter(sale => sale.status.toLowerCase() === 'pending').length;
	const totalRevenue = sales.reduce((sum, sale) => sum + (sale.quantity * 1), 0);

	return (
		<div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30 p-6">
			<div className="max-w-7xl mx-auto">
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
					<div className="flex items-center gap-4 mb-4 lg:mb-0">
						<div className="bg-gradient-to-br from-purple-500 via-purple-600 to-indigo-600 p-3 rounded-2xl shadow-lg shadow-purple-500/20">
							<BarChart3 className="h-8 w-8 text-white" />
						</div>
						<div>
							<h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 via-purple-700 to-purple-800 bg-clip-text text-transparent">
								Sales Analytics
							</h1>
							<div className="text-gray-600 mt-2 flex items-center gap-2">
								<div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
								Detailed sales performance for {productName}
							</div>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<Link href={`/dashboard/product-view/${groupId}/${productId}`}>
							<Button
								variant="outline"
								className="bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-600 hover:bg-white hover:text-gray-700 px-4 py-2 rounded-xl"
							>
								<ArrowLeft className="h-4 w-4 mr-2" />
								Back to Product
							</Button>
						</Link>

						<Dialog open={isAddSaleOpen} onOpenChange={setIsAddSaleOpen}>
							<DialogTrigger asChild>
								<Button className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white px-4 py-2 rounded-xl shadow-lg shadow-purple-500/25 hover:shadow-purple-500/40 transition-all duration-300">
									<Plus className="h-4 w-4 mr-2" />
									Add Sale
								</Button>
							</DialogTrigger>
							<DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-sm border border-purple-100/50 rounded-2xl shadow-xl">
								<DialogHeader>
									<DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
										Add New Sale
									</DialogTitle>
									<DialogDescription className="text-gray-600">
										Create a new sales record for {productName}
									</DialogDescription>
								</DialogHeader>
								<div className="grid gap-4 py-4">
									<div className="grid gap-2">
										<Label htmlFor="date" className="text-gray-700 font-medium">Date</Label>
										<Input
											id="date"
											type="date"
											value={formData.date}
											onChange={(e) => handleFormChange('date', e.target.value)}
											className="bg-white/80 border-gray-200 rounded-xl focus:border-purple-300 focus:ring-purple-200"
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="quantity" className="text-gray-700 font-medium">Quantity</Label>
										<Input
											id="quantity"
											type="number"
											placeholder="Enter quantity"
											min="1"
											value={formData.quantity}
											onChange={(e) => handleFormChange('quantity', parseInt(e.target.value) || 1)}
											className="bg-white/80 border-gray-200 rounded-xl focus:border-purple-300 focus:ring-purple-200"
										/>
									</div>
									<div className="grid gap-2">
										<Label htmlFor="status" className="text-gray-700 font-medium">Status</Label>
										<Select
											value={formData.status}
											onValueChange={(value) => handleFormChange('status', value)}
											defaultValue="completed"
										>
											<SelectTrigger className="bg-white/80 border-gray-200 rounded-xl focus:border-purple-300 focus:ring-purple-200">
												<SelectValue placeholder="Select status" defaultValue={"completed"} />
											</SelectTrigger>
											<SelectContent className="bg-white/95 backdrop-blur-sm border border-purple-100/50 rounded-xl">
												<SelectItem value="completed" className="focus:bg-purple-50 focus:text-purple-700">Completed</SelectItem>
												<SelectItem value="cancelled" className="focus:bg-purple-50 focus:text-purple-700">Cancelled</SelectItem>
											</SelectContent>
										</Select>
									</div>
								</div>
								<DialogFooter>
									<Button
										variant="outline"
										onClick={() => setIsAddSaleOpen(false)}
										className="bg-white/80 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl"
										disabled={isLoading}
									>
										Cancel
									</Button>
									<Button
										onClick={handleAddSale}
										disabled={isLoading}
										className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-purple-500/25 disabled:opacity-50"
									>
										{isLoading ? "Adding..." : "Add Sale"}
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>

						<div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm">
							<Calendar className="h-4 w-4" />
							{new Date().toLocaleDateString("en-US", {
								weekday: "long",
								year: "numeric",
								month: "long",
								day: "numeric",
							})}
						</div>
					</div>
				</div>

				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
					<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-xs border border-purple-100/80 hover:shadow-md transition-all duration-300 group">
						<div className="flex items-center gap-3">
							<div className="bg-purple-50 p-2.5 rounded-xl">
								<TrendingUp className="h-5 w-5 text-purple-500" />
							</div>
							<div>
								<div className="text-2xl font-bold text-gray-800">
									{totalSales}
								</div>
								<div className="text-sm font-medium text-gray-600">
									Total Sales
								</div>
								<div className="text-xs text-purple-500 mt-1">
									Units sold
								</div>
							</div>
						</div>
						<div className="mt-3 flex items-center gap-2 text-xs text-purple-600 bg-purple-50 px-2 py-1 rounded-lg border border-purple-200">
							<TrendingUp className="h-3 w-3" />
							All-time sales volume
						</div>
					</div>

					<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-xs border border-blue-100/80 hover:shadow-md transition-all duration-300 group">
						<div className="flex items-center gap-3">
							<div className="bg-blue-50 p-2.5 rounded-xl">
								<ShoppingCart className="h-5 w-5 text-blue-500" />
							</div>
							<div>
								<div className="text-2xl font-bold text-gray-800">
									{sales.length}
								</div>
								<div className="text-sm font-medium text-gray-600">
									Transactions
								</div>
								<div className="text-xs text-blue-500 mt-1">
									Total orders
								</div>
							</div>
						</div>
						<div className="mt-3 flex items-center gap-2 text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded-lg border border-blue-200">
							<ShoppingCart className="h-3 w-3" />
							Purchase orders
						</div>
					</div>

					<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-xs border border-green-100/80 hover:shadow-md transition-all duration-300 group">
						<div className="flex items-center gap-3">
							<div className="bg-green-50 p-2.5 rounded-xl">
								<CheckCircle className="h-5 w-5 text-green-500" />
							</div>
							<div>
								<div className="text-2xl font-bold text-gray-800">
									{completedSales}
								</div>
								<div className="text-sm font-medium text-gray-600">
									Completed
								</div>
								<div className="text-xs text-green-500 mt-1">
									Successful orders
								</div>
							</div>
						</div>
						<div className="mt-3 flex items-center gap-2 text-xs text-green-600 bg-green-50 px-2 py-1 rounded-lg border border-green-200">
							<CheckCircle className="h-3 w-3" />
							Delivered to customers
						</div>
					</div>

					<div className="bg-white/80 backdrop-blur-sm rounded-2xl p-5 shadow-xs border border-orange-100/80 hover:shadow-md transition-all duration-300 group">
						<div className="flex items-center gap-3">
							<div className="bg-orange-50 p-2.5 rounded-xl">
								<DollarSign className="h-5 w-5 text-orange-500" />
							</div>
							<div>
								<div className="text-2xl font-bold text-gray-800">
									${totalRevenue}
								</div>
								<div className="text-sm font-medium text-gray-600">
									Revenue
								</div>
								<div className="text-xs text-orange-500 mt-1">
									Estimated total
								</div>
							</div>
						</div>
						<div className="mt-3 flex items-center gap-2 text-xs text-orange-600 bg-orange-50 px-2 py-1 rounded-lg border border-orange-200">
							<DollarSign className="h-3 w-3" />
							Based on unit price
						</div>
					</div>
				</div>

				<div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xs border border-gray-100/80 overflow-hidden hover:shadow-md transition-shadow duration-300 mb-2">
					<div className="p-5 border-b border-gray-100">
						<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
							<div className="flex items-center gap-3 mb-3 sm:mb-0">
								<div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
									<BarChart3 className="h-5 w-5 text-white" />
								</div>
								<div>
									<h2 className="text-xl font-bold text-gray-800">
										Sales History
									</h2>
									<p className="text-gray-600 text-sm">
										Detailed transaction records for {productName}
									</p>
								</div>
							</div>
							<div className="flex items-center gap-2">
								<div className="flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1.5 rounded-lg border border-purple-200">
									<div className="w-2 h-2 bg-purple-400 rounded-full"></div>
									<span className="text-sm font-medium">{sales.length} transactions</span>
								</div>
							</div>
						</div>
					</div>

					<div className="p-5">
						<div className="rounded-lg overflow-hidden border border-gray-200/60">
							<Table>
								<TableHeader>
									<TableRow className="bg-gradient-to-r from-purple-50 to-purple-100/50 hover:bg-purple-100/50">
										<TableHead className="text-gray-700 font-semibold">
											<div className="flex items-center gap-2">
												<Calendar className="h-4 w-4 text-purple-500" />
												Date
											</div>
										</TableHead>
										<TableHead className="text-gray-700 font-semibold">
											<div className="flex items-center gap-2">
												<Package className="h-4 w-4 text-purple-500" />
												Quantity
											</div>
										</TableHead>
										<TableHead className="text-gray-700 font-semibold">
											<div className="flex items-center gap-2">
												<CheckCircle className="h-4 w-4 text-purple-500" />
												Status
											</div>
										</TableHead>
										<TableHead className="text-gray-700 font-semibold">
											<div className="flex items-center gap-2">
												<Users className="h-4 w-4 text-purple-500" />
												Transaction ID
											</div>
										</TableHead>
										<TableHead className="text-gray-700 font-semibold">
											<div className="flex items-center gap-2">
												<Clock className="h-4 w-4 text-purple-500" />
												Created
											</div>
										</TableHead>
										<TableHead className="text-gray-700 font-semibold text-right">
											<div className="flex items-center gap-2 justify-end">
												<Sparkles className="h-4 w-4 text-purple-500" />
												Actions
											</div>
										</TableHead>
									</TableRow>
								</TableHeader>
								<TableBody>
									{sales.length === 0 ? (
										<TableRow>
											<TableCell colSpan={6} className="text-center py-8">
												<div className="flex flex-col items-center justify-center text-gray-400">
													<ShoppingCart className="h-12 w-12 mb-3 opacity-50" />
													<p className="text-lg font-semibold text-gray-600">No sales records found</p>
													<p className="text-sm text-gray-500">Sales data will appear here once transactions occur</p>
												</div>
											</TableCell>
										</TableRow>
									) : (
										sales.map((sale) => (
											<TableRow
												key={sale.id}
												className="border-gray-100 hover:bg-purple-50/30 transition-colors duration-200"
											>
												<TableCell className="font-medium">
													<div className="flex items-center gap-2">
														<div className="p-1.5 rounded bg-purple-100">
															<Calendar className="h-3.5 w-3.5 text-purple-600" />
														</div>
														<span className="text-gray-800">{formatDate(sale.date)}</span>
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<div className="p-1.5 rounded bg-green-100">
															<Package className="h-3.5 w-3.5 text-green-600" />
														</div>
														<div>
															<span className="font-semibold text-gray-800">{sale.quantity}</span>
															<span className="text-sm text-gray-600 ml-1">units</span>
														</div>
													</div>
												</TableCell>
												<TableCell>
													<div className={`flex items-center gap-1.5 w-fit px-3 py-1.5 rounded-full border text-sm font-medium transition-colors ${getStatusColor(sale.status)}`}>
														{getStatusIcon(sale.status)}
														{sale.status}
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2">
														<div className="p-1.5 rounded bg-blue-100">
															<Users className="h-3.5 w-3.5 text-blue-600" />
														</div>
														<code className="text-sm text-gray-700 bg-gray-50 px-2 py-1 rounded border">
															{sale.id.slice(0, 8)}...
														</code>
													</div>
												</TableCell>
												<TableCell className="text-gray-700">
													<div className="flex items-center gap-2">
														<Clock className="h-3.5 w-3.5 text-gray-500" />
														{formatDateTime(sale.createdAt)}
													</div>
												</TableCell>
												<TableCell>
													<div className="flex items-center gap-2 justify-end">

														<Button
															variant="ghost"
															size="sm"
															onClick={() => handleViewSale(sale)}
															className="p-2 h-9 w-9 bg-blue-50/80 hover:bg-blue-100/80 border border-blue-200/50 text-blue-600 hover:text-blue-700 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md"
														>
															<Eye className="h-4 w-4" />
														</Button>

														<Button
															variant="ghost"
															size="sm"
															onClick={() => handleUpdateSale(sale)}
															className="p-2 h-9 w-9 bg-green-50/80 hover:bg-green-100/80 border border-green-200/50 text-green-600 hover:text-green-700 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md"
														>
															<Edit className="h-4 w-4" />
														</Button>
														<Button
															variant="ghost"
															size="sm"
															onClick={() => handleDeleteSale(sale)}
															className="p-2 h-9 w-9 bg-red-50/80 hover:bg-red-100/80 border border-red-200/50 text-red-600 hover:text-red-700 rounded-xl transition-all duration-200 hover:scale-105 hover:shadow-md"
														>
															<Trash2 className="h-4 w-4" />
														</Button>
													</div>
												</TableCell>
											</TableRow>
										))
									)}
								</TableBody>
							</Table>
						</div>
					</div>

					<div className="px-5 pb-5 flex flex-wrap items-center justify-between gap-4 text-sm text-gray-500">
						<div className="flex items-center gap-4">
							<span>Last updated: {new Date().toLocaleDateString()}</span>
							<span className="hidden md:inline">•</span>
							<span className="hidden md:inline">{sales.length} transactions total</span>
						</div>
						<div className="flex items-center gap-2 text-purple-600">
							<Sparkles className="h-4 w-4" />
							<span className="font-medium">Live Data</span>
						</div>
					</div>
				</div>
				<Dialog open={isViewSaleOpen} onOpenChange={setIsViewSaleOpen}>
					<DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-sm border border-purple-100/50 rounded-2xl shadow-xl">
						<DialogHeader>
							<DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
								Sale Details
							</DialogTitle>
							<DialogDescription className="text-gray-600">
								Detailed information for this sales transaction
							</DialogDescription>
						</DialogHeader>
						{selectedSale && (
							<div className="grid gap-4 py-4">
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label className="text-sm font-medium text-gray-700">Transaction ID</Label>
										<div className="text-sm text-gray-700 bg-gray-50 p-2 rounded-xl border border-gray-200">
											{selectedSale.id}
										</div>
									</div>
									<div className="space-y-2">
										<Label className="text-sm font-medium text-gray-700">Date</Label>
										<div className="flex items-center gap-2 text-sm text-gray-700 bg-purple-50 p-2 rounded-xl border border-purple-200">
											<Calendar className="h-4 w-4 text-purple-500" />
											{formatDate(selectedSale.date)}
										</div>
									</div>
								</div>
								<div className="grid grid-cols-2 gap-4">
									<div className="space-y-2">
										<Label className="text-sm font-medium text-gray-700">Quantity</Label>
										<div className="flex items-center gap-2 text-sm text-gray-700 bg-green-50 p-2 rounded-xl border border-green-200">
											<Package className="h-4 w-4 text-green-500" />
											{selectedSale.quantity} units
										</div>
									</div>
									<div className="space-y-2">
										<Label className="text-sm font-medium text-gray-700">Status</Label>
										<div className={`flex items-center gap-1.5 w-fit px-3 py-2 rounded-full border text-sm font-medium ${getStatusColor(selectedSale.status)}`}>
											{getStatusIcon(selectedSale.status)}
											{selectedSale.status}
										</div>
									</div>
								</div>
								<div className="space-y-2">
									<Label className="text-sm font-medium text-gray-700">Created At</Label>
									<div className="flex items-center gap-2 text-sm text-gray-700 bg-blue-50 p-2 rounded-xl border border-blue-200">
										<Clock className="h-4 w-4 text-blue-500" />
										{formatDateTime(selectedSale.createdAt)}
									</div>
								</div>
							</div>
						)}
						<DialogFooter>
							<Button
								onClick={() => setIsViewSaleOpen(false)}
								className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-purple-500/25"
							>
								Close
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>


				<Dialog open={isUpdateSaleOpen} onOpenChange={setIsUpdateSaleOpen}>
					<DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-sm border border-purple-100/50 rounded-2xl shadow-xl">
						<DialogHeader>
							<DialogTitle className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-purple-700 bg-clip-text text-transparent">
								Update Sale
							</DialogTitle>
							<DialogDescription className="text-gray-600">
								Modify the sales record details
							</DialogDescription>
						</DialogHeader>
						{selectedSale && (
							<div className="grid gap-4 py-4">
								<div className="grid gap-2">
									<Label htmlFor="update-date" className="text-gray-700 font-medium">Date</Label>
									<Input
										id="update-date"
										type="date"
										value={formData.date}
										onChange={(e) => handleFormChange('date', e.target.value)}
										className="bg-white/80 border-gray-200 rounded-xl focus:border-purple-300 focus:ring-purple-200"
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="update-quantity" className="text-gray-700 font-medium">Quantity</Label>
									<Input
										id="update-quantity"
										type="number"
										value={formData.quantity}
										onChange={(e) => handleFormChange('quantity', parseInt(e.target.value) || 1)}
										min="1"
										className="bg-white/80 border-gray-200 rounded-xl focus:border-purple-300 focus:ring-purple-200"
									/>
								</div>
								<div className="grid gap-2">
									<Label htmlFor="update-status" className="text-gray-700 font-medium">Status</Label>
									<Select
										value={formData.status}
										onValueChange={(value) => handleFormChange('status', value)}
									>
										<SelectTrigger className="bg-white/80 border-gray-200 rounded-xl focus:border-purple-300 focus:ring-purple-200">
											<SelectValue placeholder="Select status" />
										</SelectTrigger>
										<SelectContent className="bg-white/95 backdrop-blur-sm border border-purple-100/50 rounded-xl">
											<SelectItem value="pending" className="focus:bg-purple-50 focus:text-purple-700">Pending</SelectItem>
											<SelectItem value="completed" className="focus:bg-purple-50 focus:text-purple-700">Completed</SelectItem>
											<SelectItem value="cancelled" className="focus:bg-purple-50 focus:text-purple-700">Cancelled</SelectItem>
										</SelectContent>
									</Select>
								</div>
							</div>
						)}
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setIsUpdateSaleOpen(false)}
								className="bg-white/80 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl"
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button
								onClick={handleUpdate}
								disabled={isLoading}
								className="bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white rounded-xl shadow-lg shadow-purple-500/25 disabled:opacity-50"
							>
								{isLoading ? "Updating..." : "Update Sale"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>

				<Dialog open={isDeleteSaleOpen} onOpenChange={setIsDeleteSaleOpen}>
					<DialogContent className="sm:max-w-[425px] bg-white/95 backdrop-blur-sm border border-red-100/50 rounded-2xl shadow-xl">
						<DialogHeader>
							<DialogTitle className="flex items-center gap-2 text-red-600 text-xl font-bold">
								<AlertTriangle className="h-5 w-5" />
								Confirm Deletion
							</DialogTitle>
							<DialogDescription className="text-gray-600">
								Are you sure you want to delete this sales record? This action cannot be undone.
							</DialogDescription>
						</DialogHeader>
						{selectedSale && (
							<div className="py-4">
								<div className="bg-red-50 border border-red-200 rounded-xl p-4">
									<div className="text-sm text-red-800 space-y-2">
										<p className="font-medium text-base">Sale Details:</p>
										<div className="flex items-center gap-2">
											<Calendar className="h-4 w-4" />
											Date: {formatDate(selectedSale.date)}
										</div>
										<div className="flex items-center gap-2">
											<Package className="h-4 w-4" />
											Quantity: {selectedSale.quantity} units
										</div>
										<div className="flex items-center gap-2">
											<CheckCircle className="h-4 w-4" />
											Status: {selectedSale.status}
										</div>
									</div>
								</div>
							</div>
						)}
						<DialogFooter>
							<Button
								variant="outline"
								onClick={() => setIsDeleteSaleOpen(false)}
								className="bg-white/80 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl"
								disabled={isLoading}
							>
								Cancel
							</Button>
							<Button
								variant="destructive"
								onClick={handleDelete}
								disabled={isLoading}
								className="bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg shadow-red-500/25 disabled:opacity-50"
							>
								<Trash2 className="h-4 w-4 mr-2" />
								{isLoading ? "Deleting..." : "Delete Sale"}
							</Button>
						</DialogFooter>
					</DialogContent>
				</Dialog>
			</div>
		</div>
	);
}
