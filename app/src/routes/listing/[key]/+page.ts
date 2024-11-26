import { parseHashToURI } from "$lib/utils/helpers";
import { getMetadataAccount } from "$lib/utils/pda";
import { clusterApiUrl, PublicKey } from "@solana/web3.js";
import type { PageLoad } from "./$types";
import * as anchor from "@coral-xyz/anchor";
// import { type Listing } from "$lib/utils/types";

export const load: PageLoad = async ({ params }) => {
  const { key } = params;
  const connection = new anchor.web3.Connection(clusterApiUrl("devnet"));

  const [nftMint, listingUriHash, publickKey] = key.split("--");

  const uriPattern =
    /https:\/\/[a-zA-Z0-9\-\.]+(\/ipfs\/[a-zA-Z0-9]+(?:[\/][a-zA-Z0-9\-]+)*)/;

  const nftUri = (
    await connection.getParsedAccountInfo(
      await getMetadataAccount(new PublicKey(nftMint))
    )
  ).value.data
    .toString()
    .match(uriPattern)[0];

  const resListing = await fetch(parseHashToURI(listingUriHash));
  const resNft = await fetch(nftUri);

  const listingData = (await resListing.json()) as any;
  const nftData = await resNft.json();

  listingData.nftMint = new PublicKey(nftMint);
  listingData.imageUri = nftData.image;
  listingData.name = nftData.name;
  listingData.publicKey = new PublicKey(publickKey);

  console.log(listingData);
  return { listingData };
};
