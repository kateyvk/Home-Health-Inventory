import InventoryItemForm from "@/components/inventory/InventoryItemForm";

export default function NewInventoryItemPage() {
    return(
        <main className="mx-auto max-w-2xl p-8">
            <h1 className="text-3xl font-bold mb-6">Add New Inventory Item</h1>
            <InventoryItemForm />
        </main>
    );  
}