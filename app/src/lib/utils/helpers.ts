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

    if (
      key === "make" ||
      key === "model" ||
      key === "type" ||
      key === "color" ||
      key === "transmission" ||
      key === "mileage" ||
      key === "fuelType" ||
      key === "engineSize" ||
      key === "vin"
    ) {
      metadata.push({
        trait_type: key,
        value: value.toString(),
      });
    }
  }
  return metadata;
}

export function parseHashToURI(hash: String) {
  return `https://white-abstract-alligator-386.mypinata.cloud/ipfs/${hash}`;
}
