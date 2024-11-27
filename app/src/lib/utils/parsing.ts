import * as anchor from "@coral-xyz/anchor";
import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
import { parseHashToURI } from "./helpers";
import { getMetadataAccount } from "./pda";
import { type Listing } from "./types";

export async function parseListings(
  listings: anchor.ProgramAccount<{
    nftMint: PublicKey;
    initialOwner: PublicKey;
    basePrice: anchor.BN;
    listingUriHash: string;
    bump: number;
  }>[]
) {
  let l: Listing[] = [];
  const connection = new anchor.web3.Connection(
    "https://rpc.testnet.soo.network/rpc"
  );

  for (const listing of listings) {
    const { nftMint, initialOwner, basePrice, listingUriHash } =
      listing.account;

    const uriPattern =
      /https:\/\/[a-zA-Z0-9\-\.]+(\/ipfs\/[a-zA-Z0-9]+(?:[\/][a-zA-Z0-9\-]+)*)/;

    const nftUri = (
      await connection.getParsedAccountInfo(await getMetadataAccount(nftMint))
    ).value.data
      .toString()
      .match(uriPattern)[0];

    const resListing = await fetch(parseHashToURI(listingUriHash));
    const resNft = await fetch(nftUri);

    const listingData = (await resListing.json()) as Listing;
    const nftData = await resNft.json();

    listingData.nftMint = nftMint;
    listingData.initialOwner = initialOwner;
    listingData.basePrice = basePrice;
    listingData.listingUriHash = listingUriHash;
    listingData.imageUri = nftData.image;
    listingData.name = nftData.name;
    listingData.publicKey = listing.publicKey;

    l = [...l, listingData];
  }

  return l;
}

export async function parseBids(
  bids: anchor.ProgramAccount<{
    nftMint: anchor.web3.PublicKey;
    bidder: anchor.web3.PublicKey;
    listingAccount: anchor.web3.PublicKey;
    basePrice: anchor.BN;
    bump: number;
  }>[],
  listingAccuountInitialOwner: anchor.web3.PublicKey
) {
  let b: any[] = [];
  const connection = new anchor.web3.Connection(
    "https://rpc.testnet.soo.network/rpc"
  );
  for (const bid of bids) {
    const bidData = {
      balance: (await connection.getBalance(bid.publicKey)) / LAMPORTS_PER_SOL,
      bidder: bid.account.bidder.toBase58(),
      listingAccuountInitialOwner,
      publicKey: bid.publicKey,
    };

    b = [...b, bidData];
  }

  return b;
}
