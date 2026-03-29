"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type GuideFormProps = {  
  onGuideAdded: () => void;
  onClose: () => void;
};

export default function GuideForm({
  onGuideAdded,
  onClose,
}: GuideFormProps) {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [suppliesNeeded, setSuppliesNeeded] = useState("");
  const [steps, setSteps] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const suppliesArray = suppliesNeeded
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    const stepsArray = steps
      .split("\n")
      .map((step) => step.trim())
      .filter(Boolean);

    const { error } = await supabase.from("caregiver_guides").insert([
      {
        title,
        category,
        description,
        supplies_needed: suppliesArray,
        steps: stepsArray,
      },
    ]);

    if (error) {
      console.error("Error adding guide:", error);
      setError(error.message);
    } else {
      setTitle("");
      setCategory("");
      setDescription("");
      setSuppliesNeeded("");
      setSteps("");
      onGuideAdded();
      onClose();
    }

    setLoading(false);
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="mb-8 rounded-lg border bg-gray-700 p-6 shadow-md"
    >
      <h2 className="mb-4 text-xl font-semibold">Add New Caregiver Guide</h2>

      {error && <p className="mb-4 text-red-500">Error: {error}</p>}

      <div className="mb-4">
        <label className="mb-1 block font-medium">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
          className="w-full rounded border p-2"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block font-medium">Category</label>
        <input
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          required
          className="w-full rounded border p-2"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block font-medium">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          required
          rows={3}
          className="w-full rounded border p-2"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block font-medium">
          Supplies Needed (comma separated)
        </label>
        <input
          type="text"
          value={suppliesNeeded}
          onChange={(e) => setSuppliesNeeded(e.target.value)}
          placeholder="Gloves, Wipes, Bandage"
          className="w-full rounded border p-2"
        />
      </div>

      <div className="mb-4">
        <label className="mb-1 block font-medium">
          Steps (one step per line)
        </label>
        <textarea
          value={steps}
          onChange={(e) => setSteps(e.target.value)}
          required
          rows={6}
          placeholder={`Wash hands\nPut on gloves\nPrepare supplies`}
          className="w-full rounded border p-2"
        />
      </div>

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-blue-500 px-4 py-2 font-semibold text-white hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Save Guide"}
        </button>

        <button
          type="button"
          onClick={onClose}
          className="rounded bg-gray-300 px-4 py-2 font-semibold text-gray-800 hover:bg-gray-400"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}