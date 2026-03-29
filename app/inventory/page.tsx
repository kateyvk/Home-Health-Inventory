"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import { InventoryItem } from "@/types/inventory"; 

export default function InventoryPage() {
  const [inventory, setInventoryItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    fetchInventoryItems(); 
  }, []);

  async function fetchInventoryItems() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("inventory_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching inventory data:", error);
      setError(error.message);
    } else {
      setInventoryItems((data as InventoryItem[]) || []);
    }

    setLoading(false);
  }

  const filteredInventory = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return inventory;

    return inventory.filter((item) => {
      const matchesName = item.name.toLowerCase().includes(search);
      const matchesCategory = item.category.toLowerCase().includes(search);
      const matchesLocation = item.location.toLowerCase().includes(search);
      const matchesCondition = item.condition.toLowerCase().includes(search);
      const matchesStatus = item.status.toLowerCase().includes(search);
      const matchesUnit = item.unit.toLowerCase().includes(search);
      const matchesNotes = item.notes?.toLowerCase().includes(search) ?? false;

      return (
        matchesName ||
        matchesCategory ||
        matchesLocation ||
        matchesCondition ||
        matchesStatus ||
        matchesUnit ||
        matchesNotes
      );
    });
  }, [inventory, searchTerm]);

  return (
    <main className="p-6">
      <h1 className="border-b-2 border-gray-300 pb-2 text-center text-3xl font-bold">
        Your Home Health Inventory
      </h1>

      <div className="my-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href="/inventory/new"
          className="rounded bg-blue-300 px-6 py-4 text-lg font-bold text-gray-800 hover:bg-blue-500"
        >
          Add New Item
        </Link>

        <input
          type="text"
          placeholder="Search by name, category, location, status..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-3 shadow-sm sm:max-w-md"
        />
      </div>

      {loading && <p>Loading inventory...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && inventory.length === 0 && <p>No inventory items found.</p>}

      {!loading && inventory.length > 0 && filteredInventory.length === 0 && (
        <p>No matching inventory items found.</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {filteredInventory.map((item) => (
          <div key={item.id} className="rounded-lg border bg-black  p-4 shadow-sm">
            {item.image_url && (
              <img
                src={item.image_url}
                alt={item.name}
                className="h-32 w-full rounded-lg object-cover"
              />
            )}

            <h2 className="mt-2 text-lg font-semibold">{item.name}</h2>
            <p>Category: {item.category}</p>
            <p>
              Quantity: {item.quantity} {item.unit}
            </p>
            <p>Location: {item.location}</p>
            <p>Condition: {item.condition}</p>
            <p>Status: {item.status}</p>
            {item.expiration_date && <p>Expires: {item.expiration_date}</p>}
            {item.notes && <p>Notes: {item.notes}</p>}
          </div>
        ))}
      </div>
    </main>
  );
}