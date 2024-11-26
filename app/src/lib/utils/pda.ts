import * as anchor from "@coral-xyz/anchor";

export const mplID = new anchor.web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { PublicKey } from "@solana/web3.js";
import idl from "$lib/idl/revvek.json";

export async function getMetadataAccount(nftMint: PublicKey) {
  const [metadata] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), mplID.toBuffer(), nftMint.toBuffer()],
    mplID
  );
  return metadata;
}

export async function getMasterEditionAccount(nftMint: PublicKey) {
  const [masterEdition] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      mplID.toBuffer(),
      nftMint.toBuffer(),
      Buffer.from("edition"),
    ],
    mplID
  );
  return masterEdition;
}
export async function getListingAccount(
  wallet: PublicKey,
  nft_mint: PublicKey
) {
  const [listingAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("listing"), wallet.toBuffer(), nft_mint.toBuffer()],
    new PublicKey(idl.address)
  );
  return listingAccount;
}

export async function getBidAccount(
  wallet: PublicKey,
  listingAccount: PublicKey
) {
  const [bidAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("bid"), listingAccount.toBuffer(), wallet.toBuffer()],
    new PublicKey(idl.address)
  );
  return bidAccount;
}

export async function getVault(nftMint: PublicKey, listingAccount: PublicKey) {
  const [nftVault] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      listingAccount.toBuffer(),
      TOKEN_PROGRAM_ID.toBuffer(),
      nftMint.toBuffer(),
    ],
    ASSOCIATED_TOKEN_PROGRAM_ID
  );
  return nftVault;
}

export async function getBidVault(bidAccount: PublicKey) {
  const [bidVault] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("bidVault"), bidAccount.toBuffer()],
    new PublicKey(idl.address)
  );
  return bidVault;
}
