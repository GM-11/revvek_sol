export type CarListing = {
  make: string;
  model: string;
  year: number;
  type: string;
  mileage: number;
  fuelType: string;
  transmission: string;
  condition: string;
  color: string;
  engineSize: string;
  owners: number;
  accidentHistory: string;
  features: string[];
  serviceRecords: string;
  insuranceDetails: string;
  location: string;
  price: number;
  negotiable: boolean;
  photos: File[];
  video?: File;
  sellerName: string;
  contact: string;
  communicationPreference: string;
  reasonForSale?: string;
  vin?: string;
  warranty?: string;
};
