import { PUBLIC_PINATA_API_KEY } from "$env/static/public";
import { PINATA_SECRET_KEY } from "$env/static/private";
import axios from "axios";
import { CarListing } from "$lib/utils/types";
import {
  convertCarListingtoMetadata,
  parseHashToURI,
} from "$lib/utils/helpers";

export async function POST({ request }: { request: Request }) {
  const file = await request.formData();
  const image = file.get("image");
  const data = JSON.parse(file.get("data").toString()) as CarListing;

  const formData = new FormData();
  formData.append("file", image as Blob);

  try {
    const image = await uploadImage(formData);
    if (!image) {
      return new Response("Failed to upload image", {
        status: 500,
      });
    }
    const metadataUrl = await uploadMetadata(data, image);
    if (!metadataUrl) {
      return new Response("Failed to upload metadata", {
        status: 500,
      });
    }
    const listingHash = await uploaListing(data, image);
    if (!listingHash) {
      return new Response("Failed to upload listing", {
        status: 500,
      });
    }
    return new Response(
      JSON.stringify({
        metadataUrl,
        name: data.make + " " + data.model,
        symbol: "RVK",
        listingHash,
      }),
      {
        headers: {
          "content-type": "application/json",
        },
      }
    );
  } catch (error) {
    return new Response("Failed to upload to IPFS", {
      status: 500,
    });
  }
}

async function uploadMetadata(data: CarListing, image: string) {
  data.photos = [image];
  const attributes = convertCarListingtoMetadata(data);
  const metadata = JSON.stringify({
    name: data.make + " " + data.model,
    description: data.location + " " + data.price,
    image,
    attributes,
  });
  const uploadMetadataResponse = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    metadata,
    {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: `${PUBLIC_PINATA_API_KEY}`,
        pinata_secret_api_key: `${PINATA_SECRET_KEY}`,
      },
    }
  );

  if (uploadMetadataResponse.status !== 200) {
    return;
  }

  return parseHashToURI(uploadMetadataResponse.data.IpfsHash);
}

async function uploadImage(imageFormData: FormData) {
  const uploadImageResponse = await axios.post(
    "https://api.pinata.cloud/pinning/pinFileToIPFS",
    imageFormData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
        pinata_api_key: `${PUBLIC_PINATA_API_KEY}`,
        pinata_secret_api_key: `${PINATA_SECRET_KEY}`,
      },
    }
  );

  if (uploadImageResponse.status !== 200) {
    return;
  }
  return parseHashToURI(uploadImageResponse.data.IpfsHash);
}

async function uploaListing(data: CarListing, image: string) {
  data.photos = [image];
  const listing = JSON.stringify(data);

  const uploadListingResponse = await axios.post(
    "https://api.pinata.cloud/pinning/pinJSONToIPFS",
    listing,
    {
      headers: {
        "Content-Type": "application/json",
        pinata_api_key: `${PUBLIC_PINATA_API_KEY}`,
        pinata_secret_api_key: `${PINATA_SECRET_KEY}`,
      },
    }
  );

  if (uploadListingResponse.status !== 200) {
    return;
  }

  return uploadListingResponse.data.IpfsHash;
}
