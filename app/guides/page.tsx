"use client";

import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabase";
import { Careguide } from "@/types/guides";
import GuideForm from "@/components/guides/GuideForm";

export default function GuidesPage() {
  const [guides, setGuides] = useState<Careguide[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [showForm, setShowForm] = useState(false); 
 
  useEffect(() => {
    fetchGuides(); 
  }, []);

  async function fetchGuides() {
    setLoading(true);
    setError(null);

    const { data, error } = await supabase
      .from("caregiver_guides")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching guides:", error);
      setError(error.message);
    } else {
      const mappedGuides: Careguide[] = (data || []).map((guide) => ({
        id: guide.id,
        title: guide.title,
        category: guide.category,
        description: guide.description,
        supplies_needed: guide.supplies_needed || [],
        steps: guide.steps || [],
        created_at: guide.created_at,
      }));

      setGuides(mappedGuides);
    }

    setLoading(false);
  }

  const filteredGuides = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return guides;

    return guides.filter((guide) => {
      const matchesTitle = guide.title.toLowerCase().includes(search);
      const matchesCategory = guide.category.toLowerCase().includes(search);
      const matchesDescription = guide.description.toLowerCase().includes(search);
      const matchesSupplies = guide.supplies_needed.some((supply) =>
        supply.toLowerCase().includes(search)
      );
      const matchesSteps = guide.steps.some((step) =>
        step.toLowerCase().includes(search)
      );

      return (
        matchesTitle ||
        matchesCategory ||
        matchesDescription ||
        matchesSupplies ||
        matchesSteps
      );
    });
  }, [guides, searchTerm]);

  return (
    <main className="p-6">
      <h1 className="border-b-2 border-gray-300 pb-2 text-center text-3xl font-bold">
        Caregiver Guides
      </h1>

      <div className="my-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <button
          onClick={() => setShowForm((prev) => !prev)}
          className="rounded bg-blue-300 px-6 py-3 text-lg font-bold text-gray-900 hover:bg-blue-500"
        >
          {showForm ? "Close Guide Form" : "Add Caregiver Guide"}
        </button>

        <input
          type="text"
          placeholder="Search guides by title, category, supplies, or steps..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full rounded-lg border border-gray-300 p-3 shadow-sm sm:max-w-md"
        />
      </div>

      {showForm && (
        <GuideForm
          onGuideAdded={fetchGuides}
          onClose={() => setShowForm(false)}
        />
      )}

      {loading && <p>Loading guides...</p>}
      {error && <p className="text-red-500">Error: {error}</p>}

      {!loading && guides.length === 0 && <p>No caregiver guides found.</p>}

      {!loading && guides.length > 0 && filteredGuides.length === 0 && (
        <p>No matching caregiver guides found.</p>
      )}

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {filteredGuides.map((guide) => (
          <div key={guide.id} className="rounded-lg border bg-black p-5 shadow-sm">
            <h2 className="mb-2 text-xl font-semibold">{guide.title}</h2>
            <p className="mb-2 text-sm font-medium text-blue-300">
              Category: {guide.category}
            </p>
            <p className="mb-4 text-gray-400">{guide.description}</p>

            {guide.supplies_needed.length > 0 && (
              <div className="mb-4">
                <h3 className="mb-2 font-semibold">Supplies Needed:</h3>
                <ul className="list-inside list-disc text-sm text-gray-400">
                  {guide.supplies_needed.map((supply, index) => (
                    <li key={index}>{supply}</li>
                  ))}
                </ul>
              </div>
            )}

            {guide.steps.length > 0 && (
              <div>
                <h3 className="mb-2 font-semibold">Steps:</h3>
                <ol className="list-inside list-decimal text-sm text-gray-400">
                  {guide.steps.map((step, index) => (
                    <li key={index}>{step}</li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        ))}
      </div>
    </main>
  );
}