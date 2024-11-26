import { PublicKey } from "@solana/web3.js";
import * as anchor from "@coral-xyz/anchor";

export type CarListing = {
  make: string;
  model: string;
  year: number;
  type: string;
  sellerGovtID: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  condition: string;
  color: string;
  engineSize: string;
  accidentHistory: string;
  serviceRecords: string;
  insuranceDetails: string;
  location: string;
  price: number;
  negotiable: boolean;
  photos: string[];
  video: File;
  sellerName: string;
  contact: string;
  reasonForSale?: string;
  vin?: string;
  warranty?: string;
};

export interface Listing extends CarListing {
  nftMint: PublicKey;
  initialOwner: PublicKey;
  basePrice: anchor.BN;
  listingUriHash: string;
  imageUri: string;
  name: string;
  publicKey: PublicKey;
}
