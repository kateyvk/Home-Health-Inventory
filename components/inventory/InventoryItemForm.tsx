"use client"; 

import { useState } from "react";
import { supabase } from "@/lib/supabase";
import { uploadInventoryImage } from "@/lib/storage";

export default function InventoryItemForm() {
    const [name, setName] = useState("");
    const [category, setCategory] = useState("");
    const [quantity, setQuantity] = useState(1);
    const [unit, setUnit] = useState("");
    const [location, setLocation] = useState("");
    const [condition, setCondition] = useState<"new" | "used" | "needs replacement">("new");
    const [status, setStatus] = useState<"in stock" | "low stock" | "out of stock">("in stock");
    const [expiration_date, setExpirationDate] = useState<string | null>(null);
    const [reorder_threshold, setReorderThreshold] = useState(1);
    const [notes, setNotes] = useState("");
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0] || null;
        setImageFile(file);
        if (!file) {
            setImageFile(null);
            setPreviewUrl(null);
            return; 
        }

        //check file type
        if (!file.type.startsWith("image/")) {
            alert("Please select a valid image file.");
            return;
        }

        //check file size 
        if (file.size > 5 * 1024 * 1024) {
            alert("Please select an image smaller than 5MB.");
            return;
        }

        setImageFile(file);
        //create preview url for the selected image
        const localPreview = URL.createObjectURL(file);
        setPreviewUrl(localPreview);
    }

    async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            let imageUrl: string | null = null;
            if (imageFile) {
                imageUrl = await uploadInventoryImage(imageFile);
            }

            const { error } = await supabase.from("inventory_items").insert([
                {
                    name,
                    category,
                    quantity,
                    unit,
                    location,
                    condition,
                    status,
                    expiration_date,
                    reorder_threshold: reorder_threshold,
                    notes: notes || null,
                    image_url: imageUrl,
                },
            ]);

            if(error) {
                throw new Error("Failed to add inventory item: " + error.message);
            }

            alert("Inventory item added successfully!");


            if (previewUrl) {
                URL.revokeObjectURL(previewUrl);
            }

            // Reset form
            setName("");
            setCategory("");
            setQuantity(1);
            setUnit("");
            setLocation("");
            setCondition("new");
            setStatus("in stock");
            setExpirationDate(null);
            setReorderThreshold(1);
            setNotes("");
            setImageFile(null);
            setPreviewUrl(null);
        } catch (error) {
            console.error(error);
            alert("Error adding inventory item: ");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-4 rounded-xl border p-6 shadow-sm">
            <h2 className="text-2xl font-bold">Add Inventory Item</h2>

            <div>
                <label className="mb-1 block font-medium">Item Name</label>
                <input
                    className="w-full rounded border p-2"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Blood Pressure Monitor"
                    required
                />    
            </div>

            <div>
                <label className="mb-1 block font-medium">Category</label>
                <input
                    className="w-full rounded border p-2"
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    placeholder="Monitoring Equipment"
                    required
                />
            </div>

            <div>
                <label className="mb-1 block font-medium">Quantity</label>
                <input
                    className="w-full rounded border p-2"
                    type="number"
                    value={quantity}
                    onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                    min={1}
                    required
                />
            </div>

            <div>
                <label className="mb-1 block font-medium">Unit</label>
                <input
                    className="w-full rounded border p-2"
                    value={unit}
                    onChange={(e) => setUnit(e.target.value)}
                    placeholder="device, box, etc."
                    required
                />
            </div>

            <div>
                <label className="mb-1 block font-medium">Location</label>
                <input
                    className="w-full rounded border p-2"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Bedroom Drawer, Bathroom Closet, etc."
                    required
                />
            </div>

            <div>
                <label className="mb-1 block font-medium">Condition</label>
                <select
                    className="w-full rounded border p-2"
                    value={condition}
                    onChange={(e) => setCondition(e.target.value as "new" | "used" | "needs replacement")}
                >
                    <option value="new">New</option>
                    <option value="used">Used</option>
                    <option value="needs replacement">Needs Replacement</option>
                </select>
            </div>

            <div>
                <label className="mb-1 block font-medium">Status</label>
                <select
                    className="w-full rounded border p-2"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as "in stock" | "out of stock" | "low stock")}
                >
                    <option value="in stock">In Stock</option>
                    <option value="out of stock">Out of Stock</option>
                    <option value="low stock">Low Stock</option>
                </select>
            </div>

            <div>
                <label className="mb-1 block font-medium">Reorder Threshold</label>
                <input
                    className="w-full rounded border p-2"
                    type="number"
                    value={reorder_threshold}
                    onChange={(e) => setReorderThreshold(parseInt(e.target.value))}
                    min={0}
                    required
                />
            </div>
            <div>
                <label className="mb-1 block font-medium">Expiration Date</label>
                <input
                    className="w-full rounded border p-2"
                    type="date"
                    value={expiration_date || ""}
                    onChange={(e) => setExpirationDate(e.target.value || null)}
                />
            </div>

            <div>
                <label className="mb-1 block font-medium">Notes</label>
                <textarea
                    className="w-full rounded border p-2"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="Optional notes..."
                />
            </div>

            <div>
                <label className="mb-1 block font-medium">Item Image</label>
                <input
                type="file"
                accept ="image/*"
                capture="environment"
                onChange={handleFileChange}
                className="w-full rounded border p-2"
                />
                <p className="mt-1 text-sm text-gray-500">
                    You can upload or take a photo of the object.
                </p>
            </div>

            {previewUrl && (
                <div>
                    <p className="mb-1 block font-medium">Image Preview:</p>
                    <img src={previewUrl}
                    alt="selected img preview"
                    className="h-40 w-40 rounded-lg border object-cover"
                    />
                </div>
            )}

            <button
            type="submit"
            className="rounded bg-blue-500 text-white py-2 px-4 disabled:opacity-50"
            disabled={isSubmitting}
            >
                {isSubmitting ? "Adding..." : "Add Item"}
            </button>
        </form>
    );
}