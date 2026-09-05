import { FdaApiResponse, FdaDrugLabel, NormalizedDrugCard } from "@/types/fda";

const FDA_API_BASE = "https://api.fda.gov/drug/label.json";

export async function searchDrugsByBrand(
  brandName: string,
  signal?: AbortSignal
): Promise<{ drugs: FdaDrugLabel[]; total: number }> {
  const trimmed = brandName.trim();
  if (!trimmed) {
    return { drugs: [], total: 0 };
  }

  // API Endpoint: https://api.fda.gov/drug/label.json?search=openfda.brand_name:"SEARCH_INPUT"&limit=20
  const searchInput = trimmed.replace(/"/g, "");
  const url = `https://api.fda.gov/drug/label.json?search=openfda.brand_name:"${encodeURIComponent(searchInput)}"&limit=20`;

  try {
    const response = await fetch(url, { signal });

    if (response.status === 404) {

      return { drugs: [], total: 0 };
    }

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const message =
        errorData?.error?.message ||
        `FDA API request failed with status: ${response.status}`;
      throw new Error(message);
    }

    const data: FdaApiResponse = await response.json();
    const results = data.results || [];
    const total = data.meta?.results?.total || results.length;

    return { drugs: results, total };
  } catch (error: unknown) {
    if (error instanceof DOMException && error.name === "AbortError") {

      throw error;
    }
    if (error instanceof Error) {
      throw error;
    }
    throw new Error("An unexpected error occurred while contacting the FDA API.");
  }
}

export async function getDrugById(
  id: string,
  signal?: AbortSignal
): Promise<FdaDrugLabel | null> {
  const trimmed = id.trim();
  if (!trimmed) return null;

  const sanitizedId = trimmed.replace(/"/g, '\\"');
  const url = `${FDA_API_BASE}?search=id:"${encodeURIComponent(
    sanitizedId
  )}"&limit=1`;

  try {
    const response = await fetch(url, { signal });

    if (response.status === 404) {
      const fallbackUrl = `${FDA_API_BASE}?search=openfda.spl_id:"${encodeURIComponent(
        sanitizedId
      )}"&limit=1`;
      const fallbackResponse = await fetch(fallbackUrl, { signal });
      if (!fallbackResponse.ok) return null;
      const fallbackData: FdaApiResponse = await fallbackResponse.json();
      return fallbackData.results?.[0] || null;
    }

    if (!response.ok) {
      return null;
    }

    const data: FdaApiResponse = await response.json();
    return data.results?.[0] || null;
  } catch (error) {
    if (error instanceof DOMException && error.name === "AbortError") {
      throw error;
    }
    return null;
  }
}

export function normalizeDrug(drug: FdaDrugLabel): NormalizedDrugCard {
  const openfda = drug.openfda;

  const brandName =
    openfda?.brand_name?.[0] ||
    openfda?.generic_name?.[0] ||
    "Unknown Brand";

  const genericName = openfda?.generic_name?.[0] || "Generic name unavailable";

  const manufacturer =
    openfda?.manufacturer_name?.[0] || "Manufacturer unlisted";

  const productType = openfda?.product_type?.[0] || "Pharmaceutical Drug";

  const routes = (openfda?.route || [])
    .filter((r): r is string => typeof r === "string" && r.length > 0)
    .map((r) => r.toUpperCase());

  const substances = (openfda?.substance_name || []).filter(
    (s): s is string => typeof s === "string" && s.length > 0
  );

  const productNdc = openfda?.product_ndc?.[0] || "N/A";
  const applicationNumber = openfda?.application_number?.[0] || "N/A";

  const productTypeUpper = productType.toUpperCase();
  const isOtc = productTypeUpper.includes("OTC");
  const isRx =
    productTypeUpper.includes("PRESCRIPTION") || productTypeUpper.includes("RX");

  return {
    id: drug.id,
    brandName,
    genericName,
    manufacturer,
    productType,
    routes,
    substances,
    productNdc,
    applicationNumber,
    isOtc,
    isRx,
    hasOpenFda: Boolean(openfda),
  };
}
