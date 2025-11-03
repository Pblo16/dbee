import localData from "$lib/services/data.json";

// Load table data from API with local fallback
export async function loadTableData(name: string): Promise<any[]> {
  // Try API first
  try {
    const res = await fetch(`/api/tables/${encodeURIComponent(name)}`);
    if (res.ok) {
      const json = await res.json();
      if (Array.isArray(json)) return json;
      if (json && Array.isArray(json.data)) return json.data;
    }
  } catch (err) {
    // ignore and fallback
  }

  // Fallback to local JSON
  const records = (localData as Record<string, any[]>)[name];
  return Array.isArray(records) ? records : [];
}
