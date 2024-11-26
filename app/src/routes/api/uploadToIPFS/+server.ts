import { PUBLIC_PINATA_API_KEY } from "$env/static/public";
import { PINATA_SECRET_KEY } from "$env/static/private";
import axios from "axios";
import { CarListing } from "$lib/utils/types";
import { convertCarListingtoMetadata } from "$lib/utils/helpers";

function parseHashToURI(hash: String) {
  return `https://ivory-absolute-pony-623.mypinata.cloud/ipfs/${hash}`;
}

export async function POST({ request }: { request: Request }) {
  const file = await request.formData();
  const image = file.get("image");
  const data = JSON.parse(file.get("data").toString()) as CarListing;

  const attributes = convertCarListingtoMetadata(data);

  const formData = new FormData();
  formData.append("file", image as Blob);

  try {
    const uploadImageResponse = await axios.post(
      "https://api.pinata.cloud/pinning/pinFileToIPFS",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          pinata_api_key: `${PUBLIC_PINATA_API_KEY}`,
          pinata_secret_api_key: `${PINATA_SECRET_KEY}`,
        },
      }
    );

    if (uploadImageResponse.status !== 200) {
      return new Response("Failed to upload image", {
        status: 500,
      });
    }
    const imageUrl = parseHashToURI(uploadImageResponse.data.IpfsHash);
    const metadata = JSON.stringify({
      name: data.make + " " + data.model,
      description: data.location + " " + data.price,
      image: imageUrl,
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
      return new Response("Failed to upload metadata", {
        status: 500,
      });
    }

    const metadataUrl = parseHashToURI(uploadMetadataResponse.data.IpfsHash);
    return new Response(
      JSON.stringify({
        metadataUrl,
        name: data.make + " " + data.model,
        symbol: "RVK",
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
