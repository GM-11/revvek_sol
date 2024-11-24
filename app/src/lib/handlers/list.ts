// import { mplID, program } from "$lib/utils/constants";
// import {
//   getListingAccount,
//   getMasterEditionAccount,
//   getMetadataAccount,
//   getVault,
// } from "$lib/utils/pda";
// import { BN, web3 } from "@coral-xyz/anchor";
// import {
//   ASSOCIATED_TOKEN_PROGRAM_ID,
//   TOKEN_PROGRAM_ID,
// } from "@solana/spl-token";
// import { PublicKey } from "@solana/web3.js";

// export default async function list(
//   wallet: PublicKey,
//   price: number,
//   name: string,
//   symbol: string,
//   uri: string
// ) {
//   const nftMint = web3.Keypair.generate();

//   const listingAccount = await getListingAccount(wallet, nftMint.publicKey);
//   const nftVault = await getVault(nftMint.publicKey, listingAccount);

//   const metadata = await getMetadataAccount(nftMint.publicKey);
//   const masterEdition = await getMasterEditionAccount(nftMint.publicKey);

//   return await program.methods
//     .newListing(new BN(price), name, symbol, uri)
//     .accountsPartial({
//       initialOwner: wallet,
//       nftMint: nftMint.publicKey,
//       metadata,
//       masterEdition,
//       listingAccount,
//       nftVault,
//       rent: web3.SYSVAR_RENT_PUBKEY,
//       systemProgram: web3.SystemProgram.programId,
//       metadataProgram: mplID,
//       tokenProgram: TOKEN_PROGRAM_ID,
//       associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
//     })
//     .signers([nftMint])
//     .transaction();
// }
