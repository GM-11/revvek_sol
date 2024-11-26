import { type CarListing } from "./types";

export function convertCarListingtoMetadata(carListing: CarListing) {
  const metadata: {
    trait_type: string;
    value: string;
  }[] = [];

  const entries = Object.entries(carListing);

  console.log(entries);

  for (const [key, value] of entries) {
    if (key === "photos" || key === "video") {
      continue;
    }

    metadata.push({
      trait_type: key,
      value: value.toString(),
    });
  }
  return metadata;
}

export const CURRENT_SOL_PRICE = 235.15; // will change
