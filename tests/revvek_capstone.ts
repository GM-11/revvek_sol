import * as anchor from "@coral-xyz/anchor";
import { Program } from "@coral-xyz/anchor";
import { MPL_TOKEN_METADATA_PROGRAM_ID } from "@metaplex-foundation/mpl-token-metadata";
import { getKeypairFromFile } from "@solana-developers/helpers";
import {
  ASSOCIATED_TOKEN_PROGRAM_ID,
  getOrCreateAssociatedTokenAccount,
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

  async function getListingAccount() {
    const wallet = await getKeypairFromFile("~/.config/solana/id.json");
    const [listingAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("listing"),
        wallet.publicKey.toBuffer(),
        nft_mint.publicKey.toBuffer(),
      ],
      program.programId
    );
    return listingAccount;
  }

  async function getBidAccount() {
    const listingAccount = await getListingAccount();
    const wallet1 = await getKeypairFromFile("./wallets/wallet1.json");

    const [bidAccount] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        Buffer.from("bid"),
        listingAccount.toBuffer(),
        wallet1.publicKey.toBuffer(),
      ],
      program.programId
    );
    return bidAccount;
  }

  async function getVault() {
    const listingAccount = await getListingAccount();
    const [nftVault] = anchor.web3.PublicKey.findProgramAddressSync(
      [
        listingAccount.toBuffer(),
        TOKEN_PROGRAM_ID.toBuffer(),
        nft_mint.publicKey.toBuffer(),
      ],
      ASSOCIATED_TOKEN_PROGRAM_ID
    );
    return nftVault;
  }

  async function getBidVault() {
    const bidAccount = await getBidAccount();
    const [bidVault] = anchor.web3.PublicKey.findProgramAddressSync(
      [Buffer.from("bidVault"), bidAccount.toBuffer()],
      program.programId
    );
    return bidVault;
  }

  it("Is creates new listing!", async () => {
    const wallet = await getKeypairFromFile("~/.config/solana/id.json");

    const listingAccount = await getListingAccount();
    const nftVault = await getVault();

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

    console.log("--- NEW LISTING ---");
    console.log(`Transaction Hash: ${tx}`);
    console.log(`NFT mint: ${nft_mint.publicKey.toBase58()}`);
  });

  it("Bids for vehicle", async () => {
    // const wallet = await getKeypairFromFile("~/.config/solana/id.json");
    const wallet1 = await getKeypairFromFile("./wallets/wallet1.json");

    // const [listingAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    //   [
    //     Buffer.from("listing"),
    //     wallet.publicKey.toBuffer(),
    //     nft_mint.publicKey.toBuffer(),
    //   ],
    //   program.programId
    // );

    // const [bidAccount] = anchor.web3.PublicKey.findProgramAddressSync(
    //   [
    //     Buffer.from("bid"),
    //     listingAccount.toBuffer(),
    //     wallet1.publicKey.toBuffer(),
    //   ],
    //   program.programId
    // );
    //
    const listingAccount = await getListingAccount();
    const bidAccount = await getBidAccount();
    const bidVault = await getBidVault();

    const tx = await program.methods
      .bidForVehicle(new anchor.BN(100))
      .accountsPartial({
        systemProgram: anchor.web3.SystemProgram.programId,
        bidder: wallet1.publicKey,
        bidAccount,
        listingAccount,
      })
      .signers([wallet1])
      .rpc();

    console.log("--- BIDDING FOR VEHICLE ---");
    console.log(`Transaction Hash: ${tx}`);
    console.log(`Bid account: ${bidAccount.toBase58()}`);
  });

  it("Accepts bid", async () => {
    const wallet = await getKeypairFromFile("~/.config/solana/id.json");
    const wallet1 = await getKeypairFromFile("./wallets/wallet1.json");

    const listingAccount = await getListingAccount();
    const bidAccount = await getBidAccount();
    const nftVault = await getVault();
    const bidVault = await getBidVault();

    const bidderAta = await getOrCreateAssociatedTokenAccount(
      provider.connection,
      wallet,
      nft_mint.publicKey,
      wallet1.publicKey
    );

    const tx = await program.methods
      .acceptBid()
      .accountsPartial({
        initialOwner: wallet.publicKey,
        nftMint: nft_mint.publicKey,
        associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
        tokenProgram: TOKEN_PROGRAM_ID,
        systemProgram: anchor.web3.SystemProgram.programId,
        bidder: wallet1.publicKey,
        bidAccount,
        nftVault,
        listingAccount,
        bidderAta: bidderAta.address,
      })
      .signers([wallet])
      .rpc();

    console.log("--- ACCEPTING BID ---");
    console.log(`Transaction Hash: ${tx}`);
  });
});
