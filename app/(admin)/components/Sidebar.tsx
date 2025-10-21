"use client";
import {
	Package,
	Warehouse,
	ChartColumn,
	TriangleAlert,
	Settings,
	Blocks,
	Truck,
	ChevronLeft,
	ChevronRight,
	Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function Sidebar() {
	const [isCollapsed, setIsCollapsed] = useState(false);
	const pathname = usePathname();

	const Links = [
		{ href: "/dashboard", label: "Dashboard", icon: ChartColumn },
		{ href: "/dashboard/products", label: "Products", icon: Blocks },
		{ href: "/dashboard/deliveries", label: "Deliveries", icon: Truck },
		{ href: "/dashboard/inventory", label: "Inventory", icon: Warehouse },
		{ href: "/dashboard/accounts", label: "Manage Accounts", icon: Users },
		{ href: "/dashboard/alerts", label: "Alerts", icon: TriangleAlert },
		{ href: "/dashboard/settings", label: "Settings", icon: Settings },
	];

	return (
		<div
			className={`
      bg-white/80 backdrop-blur-lg border-r border-purple-100/50 
      transition-all duration-300 ease-in-out h-screen relative
      ${isCollapsed ? "w-20" : "w-64"}
      shadow-xl
    `}
		>
			{/* Header */}
			<div className="flex items-center justify-between p-6 border-b border-purple-100/30">
				<div
					className={`flex items-center gap-3 transition-all duration-300 ${isCollapsed
						? "opacity-0 scale-0 w-0"
						: "opacity-100 scale-100 w-auto"
						}`}
				>
					<div className="bg-gradient-to-br from-purple-500 to-purple-600 p-2 rounded-lg">
						<Package size={20} className="text-white" />
					</div>
					<div>
						<h1 className="font-bold text-gray-800">Inventory Pro</h1>
						<p className="text-xs text-gray-500">v2.1.0</p>
					</div>
				</div>

				<button
					onClick={() => setIsCollapsed(!isCollapsed)}
					className="p-2 hover:bg-purple-100 rounded-lg transition-all duration-200 shrink-0"
				>
					{isCollapsed ? (
						<ChevronRight size={16} className="text-purple-600" />
					) : (
						<ChevronLeft size={16} className="text-purple-600" />
					)}
				</button>
			</div>

			<nav className="p-4 space-y-1">
				{Links.map((link, index) => {
					const isActive = pathname === link.href;
					const Icon = link.icon;

					return (
						<Link
							href={link.href}
							key={index}
							className={`
                flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group
                ${isActive
									? "bg-purple-500 text-white shadow-md"
									: "text-gray-600 hover:bg-purple-50 hover:text-purple-700"
								}
                ${isCollapsed ? "justify-center" : ""}
              `}
						>
							<Icon
								size={20}
								className={isActive ? "text-white" : "text-purple-500"}
							/>

							<span
								className={`
                font-medium transition-all duration-300
                ${isCollapsed ? "opacity-0 w-0 absolute" : "opacity-100 w-auto"}
              `}
							>
								{link.label}
							</span>

							{isCollapsed && (
								<div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-sm rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap z-50">
									{link.label}
								</div>
							)}
						</Link>
					);
				})}
			</nav>
		</div>
	);
}
