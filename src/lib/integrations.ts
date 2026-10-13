import { unstable_cache } from "next/cache";
import { revalidateTag } from "next/cache";
import { getDecryptedIntegrationValue, getIntegration } from "@/data/store";

export interface PublicIntegrations {
  ga4MeasurementId: string;
  searchConsoleVerification: string;
  googleMapsEmbedUrl: string;
  googlePlaceId: string;
}

/**
 * Fetch public integration settings.
 * Cached with Next.js cache tag "integrations".
 * Automatically purged via revalidateIntegrationsCache() when updated in admin.
 */
async function fetchPublicIntegrationsInternal(): Promise<PublicIntegrations> {
  const ga4Item = getIntegration("ga4_measurement_id");
  const scItem = getIntegration("search_console_verification");
  const mapsItem = getIntegration("google_maps_embed_url");
  const placeIdItem = getIntegration("google_place_id");

  const ga4MeasurementId = (
    ga4Item?.value ||
    process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID ||
    process.env.GA_MEASUREMENT_ID ||
    ""
  ).trim();

  const searchConsoleVerification = (
    scItem?.value ||
    process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION ||
    process.env.GOOGLE_SITE_VERIFICATION ||
    ""
  ).trim();

  const googleMapsEmbedUrl = (
    mapsItem?.value ||
    process.env.NEXT_PUBLIC_GOOGLE_MAPS_EMBED_URL ||
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3893.385351662973!2d107.6896263!3d11.9930776!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3173fe7e1708d75b%3A0xc3b7cb7801df8ca5!2zQ-G6q20gQ8O5IEhvdXNlIGNvZmZlZSAmIEZvb2Q!5e0!3m2!1svi!2s!4v1715000000000!5m2!1svi!2s"
  ).trim();

  const googlePlaceId = (
    placeIdItem?.value ||
    process.env.NEXT_PUBLIC_GOOGLE_PLACE_ID ||
    "ChIJW9cIF37-czERpYzfAXjLt8M"
  ).trim();

  return {
    ga4MeasurementId,
    searchConsoleVerification,
    googleMapsEmbedUrl,
    googlePlaceId,
  };
}

const cachedGetPublicIntegrations = unstable_cache(
  fetchPublicIntegrationsInternal,
  ["camcu_public_integrations"],
  {
    tags: ["integrations"],
    revalidate: 600, // 10 minutes cache
  }
);

export async function getPublicIntegrations(): Promise<PublicIntegrations> {
  try {
    return await cachedGetPublicIntegrations();
  } catch {
    return await fetchPublicIntegrationsInternal();
  }
}

export function revalidateIntegrationsCache(): void {
  try {
    revalidateTag("integrations", "max");
  } catch (error) {
    console.warn("[Integrations] revalidateTag warning:", error);
  }
}
