"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";

// Dummy aquatic products & suppliers
const products = [
  {
    id: 1,
    name: "Aquarium Tank (50L)",
    suppliers: ["Supplier AquaOne", "Supplier BlueWave"],
  },
  {
    id: 2,
    name: "Tropical Fish Food Pellets",
    suppliers: ["Supplier Oceanic", "Supplier AquaOne"],
  },
  {
    id: 3,
    name: "Coral Decoration Set",
    suppliers: ["Supplier ReefLife", "Supplier BlueWave"],
  },
  {
    id: 4,
    name: "Water Filter Pump",
    suppliers: ["Supplier AquaTech", "Supplier Oceanic"],
  },
];

export default function DeliveriesPage() {
  const [inTransit, setInTransit] = useState([
    {
      id: 1,
      product: "Aquarium Tank (50L)",
      supplier: "Supplier BlueWave",
      quantity: 10,
      eta: "Aug 31, 2025 2:00 PM",
      status: "In-Transit",
    },
  ]);

  const [lowStock, setLowStock] = useState([
    { id: 2, name: "Tropical Fish Food Pellets", stock: 8, status: "Low" },
    { id: 3, name: "Coral Decoration Set", stock: 15, status: "Medium" },
    { id: 4, name: "Water Filter Pump", stock: 5, status: "Low" },
  ]);

  const handleRestock = (product: {
    id: number;
    name: string;
    stock: number;
    status: string;
  }) => {
    const newDelivery = {
      id: inTransit.length + 1,
      product: product.name,
      supplier: "Supplier AquaOne",
      quantity: 30,
      eta: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toLocaleString(),
      status: "Scheduled",
    };

    setInTransit([...inTransit, newDelivery]);
    setLowStock(lowStock.filter((p) => p.id !== product.id));
  };

  return (
    <div className="p-6 space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>In-Transit Deliveries</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Product</TableHead>
                <TableHead>Supplier</TableHead>
                <TableHead>Quantity</TableHead>
                <TableHead>ETA</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {inTransit.map((delivery) => (
                <TableRow key={delivery.id}>
                  <TableCell>{delivery.product}</TableCell>
                  <TableCell>{delivery.supplier}</TableCell>
                  <TableCell>{delivery.quantity}</TableCell>
                  <TableCell>{delivery.eta}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        delivery.status === "In-Transit"
                          ? "bg-purple-500 text-white"
                          : "bg-gray-400 text-white"
                      }
                    >
                      {delivery.status}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Low / Medium Stock Products</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {lowStock.map((product) => (
            <div
              key={product.id}
              className="flex items-center justify-between border p-3 rounded-lg"
            >
              <div>
                <p className="font-medium">{product.name}</p>
                <p className="text-sm text-muted-foreground">
                  Stock: {product.stock}{" "}
                  <Badge
                    className={
                      product.status === "Low"
                        ? "bg-red-300 text-red-900"
                        : "bg-yellow-300 text-yellow-900"
                    }
                  >
                    {product.status}
                  </Badge>
                </p>
              </div>
              <Button
                onClick={() => handleRestock(product)}
                className="bg-purple-500 hover:bg-purple-600 transition-colors duration-200"
              >
                Restock
              </Button>
            </div>
          ))}

          {lowStock.length === 0 && (
            <p className="text-sm text-muted-foreground">
              No low stock products.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
