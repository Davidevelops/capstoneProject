"use client";
import {
  Package,
  Warehouse,
  ChartColumn,
  TriangleAlert,
  Settings,
  Blocks,
  ChartNoAxesColumn,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
export default function Sidebar() {
  const Links = [
    { href: "/dashboard", label: "Dashboard", icon: ChartColumn },
    { href: "/dashboard/products", label: "Products", icon: Blocks },
    {
      href: "/dashboard/analytics",
      label: "Analytics",
      icon: ChartNoAxesColumn,
    },
    {
      href: "/dashboard/inventory",
      label: "Inventory",
      icon: Warehouse,
    },
    {
      href: "/dashboard/alerts",
      label: "Alerts",
      icon: TriangleAlert,
    },
    {
      href: "/dashboard/settings",
      label: "Settings",
      icon: Settings,
    },
  ];
  const pathname = usePathname();
  return (
    <div className="bg-gray-100 w-[300px]">
      <div className="nav-container">
        <span className="nav-logo flex items-center gap-2 p-4">
          <Package size={40} className="text-purple-900" />
          <h1 className="text-2xl font-semibold">Inventory Pro</h1>
        </span>
        <nav className="w-[200px] p-4">
          {Links.map((link, index) => {
            const isActive = pathname === link.href;

            return (
              <Link
                href={link.href}
                key={index}
                className={`flex items-center gap-2 transition-colors duration-100 rounded-xl p-3 ${
                  isActive ? "bg-purple-300 text-purple-900" : "text-gray-800"
                }`}
              >
                <link.icon />
                {link.label}
              </Link>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
