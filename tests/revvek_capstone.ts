import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MPL_TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { getKeypairFromFile } from "@solana-developers/helpers";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
  TOKEN_2022_PROGRAM_ID,
  TOKEN_PROGRAM_ID,
} from "@solana/spl-token";
import { RevvekCapstone } from "../target/types/revvek_capstone";

const name = "Homer NFT";
const symbol = "HOMR";
const uri =
  "https://raw.githubusercontent.com/solana-developers/program-examples/new-examples/tokens/tokens/.assets/nft.json";

describe("revvek_capstone", () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env();
  anchor.setProvider(provider);

  const program = anchor.workspace.RevvekCapstone as Program<RevvekCapstone>;

  const nft_mint = anchor.web3.Keypair.generate();

  const mplID = new anchor.web3.PublicKey(
    MPL_TOKEN_METADATA_PROGRAM_ID.toString()
  );

  const [metadata] = anchor.web3.PublicKey.findProgramAddressSync(
    [Buffer.from("metadata"), mplID.toBuffer(), nft_mint.publicKey.toBuffer()],
    mplID
  );
  const [masterEdition] = anchor.web3.PublicKey.findProgramAddressSync(
    [
      Buffer.from("metadata"),
      mplID.toBuffer(),
      nft_mint.publicKey.toBuffer(),
      Buffer.from("edition"),
    ],
    mplID
  );

  it("Is initialized!", async () => {
    const wallet = await getKeypairFromFile("~/.config/solana/id.json");

    const [listingAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("listing"),
        wallet.publicKey.toBuffer(),
        nft_mint.publicKey.toBuffer(),
      ],
      program.programId
    );
    // const nftVault = await getOrCreateAssociatedTokenAccount(
    //   provider.connection,
    //   wallet,
    //   nft_mint.publicKey,
    //   listingAccount,
    //   true,
    //   "confirmed"
    // );s

    const [nftVault] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        listingAccount.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        nft_mint.publicKey.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );

    try {
      const tx = await program.methods
        .newListing(new anchor.BN(100), name, symbol, uri)
        .accountsPartial({
          initialOwner: wallet.publicKey,
          nftMint: nft_mint.publicKey,
          metadata,
          masterEdition,
          listingAccount,
          nftVault,
          rent: anchor.web3.SYSVAR_RENT_PUBKEY,
          systemProgram: anchor.web3.SystemProgram.programId,
          metadataProgram: mplID,
          tokenProgram: TOKEN_PROGRAM_ID,
          associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        })
        .signers([wallet, nft_mint])
        .rpc();
      console.log(tx);
      console.log(nft_mint.publicKey.toBase58());
    } catch (e) {
      console.log(e);
    }
  });
});
