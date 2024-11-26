<script lang="ts">
  import { type Listing } from "$lib/utils/types";
  import { workspaceStore } from "$lib/stores/workspace-store";
  import { walletStore } from "@svelte-on-solana/wallet-adapter-core";
  import * as anchor from "@coral-xyz/anchor";
  import { LAMPORTS_PER_SOL, PublicKey } from "@solana/web3.js";
  import { getBidAccount, getVault } from "$lib/utils/pda";
  import { onMount } from "svelte";
  import { parseBids } from "$lib/utils/parsing";
  import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID, getOrCreateAssociatedTokenAccount } from "@solana/spl-token";

  let { data } = $props();
  const listingData = (data as any).listingData as Listing;
  let bidAmount = $state(listingData.price);
  let bids: any[] = $state([]);

  onMount(async () => {
     const b  = (await $workspaceStore.program.account.bid.all()).filter(function (bid) {
       return bid.account.nftMint.toBase58() === listingData.nftMint.toBase58();
     });
     const listings = (await $workspaceStore.program.account.listing.all()).filter(function (listing) {
       return listing.account.nftMint.toBase58() === listingData.nftMint.toBase58();
     })[0];
    bids = await parseBids(b, listings.account.initialOwner);
  })

  async function bid() {
    const bidAccount = await getBidAccount($walletStore.publicKey, new PublicKey(listingData.publicKey))
    const price = new anchor.BN(bidAmount * LAMPORTS_PER_SOL);
    const tx = await $workspaceStore.program.methods.bidForVehicle(price).accountsPartial({
      systemProgram: anchor.web3.SystemProgram.programId,
      bidder: $walletStore.publicKey,
      bidAccount,
      listingAccount: new PublicKey(listingData.publicKey),
    }).rpc()
    console.log(tx)
  }

  async function acceptBid(bidAccount: PublicKey, bidder: PublicKey) {



    const nftVault = await getVault(listingData.nftMint, listingData.publicKey);

    const [bidderAta] = anchor.web3.PublicKey.findProgramAddressSync(
        [bidder.toBuffer(), TOKEN_PROGRAM_ID.toBuffer(), listingData.nftMint.toBuffer()],
        ASSOCIATED_TOKEN_PROGRAM_ID
    );

    console.log(bidder.toString());
    console.log(bidAccount.toString());
    console.log(nftVault.toString());
    console.log(listingData.publicKey.toString());
    console.log(bidderAta.toString());
    console.log(listingData.nftMint.toString());
    console.log($walletStore.publicKey.toString());
    console.log(ASSOCIATED_TOKEN_PROGRAM_ID.toString());
    console.log(TOKEN_PROGRAM_ID.toString());
    console.log(anchor.web3.SystemProgram.programId.toString());
    const tx = await $workspaceStore.program.methods
          .acceptBid()
          .accountsPartial({
            initialOwner: $walletStore.publicKey,
            nftMint: listingData.nftMint,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
            tokenProgram: TOKEN_PROGRAM_ID,
            systemProgram: anchor.web3.SystemProgram.programId,
            bidder,
            bidAccount,
            nftVault,
            listingAccount: listingData.publicKey,
            bidderAta,
          })
          .rpc();
    console.log(tx)
  }
</script>

<main>
    <div class="listing-container">
        <div class="image-section">
            <img src={listingData.imageUri} alt={`${listingData.make} ${listingData.model}`} />
            <label>
                Your bid amount:
                <input type="number" placeholder="Enter your bid amount" bind:value={bidAmount} />

                </label>
            <button onclick={bid} class="btn">BID FOR THIS CAR</button>

            {#each bids as bid}
                <div class="bid-info">
                    <p>
                       <strong>Bidder</strong> {bid.bidder}</p>
                    <p>
                       <strong>Bid price</strong> ${bid.balance}</p>

                    {#if bid.listingAccuountInitialOwner.toBase58() ===  $walletStore.publicKey.toBase58()}
                        <button onclick={() => acceptBid(bid.publicKey, new PublicKey(bid.bidder))} class="accept-bid">ACCEPT BID</button>
                    {/if}
                </div>

            {/each}
        </div>

        <div class="details-section">
            <h1>{listingData.make} {listingData.model}</h1>

            <div class="basic-info">
                <p><strong>Year:</strong> {listingData.year}</p>
                <p><strong>Price:</strong> ${listingData.price.toLocaleString()}</p>
                <p><strong>Mileage:</strong> {listingData.mileage.toLocaleString()} miles</p>
            </div>

            <div class="specs">
                <h2>Vehicle Specifications</h2>
                <div class="specs-grid">
                    <p><strong>Type:</strong> {listingData.type}</p>
                    <p><strong>Fuel Type:</strong> {listingData.fuelType}</p>
                    <p><strong>Transmission:</strong> {listingData.transmission}</p>
                    <p><strong>Color:</strong> {listingData.color}</p>
                    <p><strong>Engine Size:</strong> {listingData.engineSize}</p>
                    <p><strong>Condition:</strong> {listingData.condition}</p>
                </div>
            </div>

            <div class="additional-info">
                <h2>Additional Information</h2>
                <p><strong>Location:</strong> {listingData.location}</p>
                <p><strong>Accident History:</strong> {listingData.accidentHistory}</p>
                <p><strong>Service Records:</strong> {listingData.serviceRecords}</p>
                {#if listingData.warranty}
                    <p><strong>Warranty:</strong> {listingData.warranty}</p>
                {/if}
            </div>

            <div class="seller-info">
                <h2>Seller Information</h2>
                <p><strong>Seller Name:</strong> {listingData.sellerName}</p>
                <p><strong>Contact:</strong> {listingData.contact}</p>
                {#if listingData.reasonForSale}
                    <p><strong>Reason for Sale:</strong> {listingData.reasonForSale}</p>
                {/if}
            </div>
        </div>
    </div>
</main>

<style>
    img {
        border-radius: 1rem;
        max-width: 100%;
        height: auto;
    }

    main {
            padding-top: 10%;
            min-height: 100vh;
            padding-inline: 9%;
            background-color: var(--background);
            color: var(--text);
            display: flex;
            flex-direction: column;
            align-items: center;
        }

    .listing-container {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 2rem;
        max-width: 1200px;
        margin: 0 auto;
    }

    button {
        padding: 0.8rem 1.2rem;
        background-color: var(--primary);
        border: none;
        border-radius: 1rem;
        width: 100%;
        margin-block: 1rem;
        font-size: 1.2rem;
        color: var(--text);
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    input {
        padding: 1rem 1.2rem;
        background-color: var(--secondary);
        border: none;
        border-radius: 1rem;
        width: 93%;
        font-size: 1.2rem;
        color: var(--text);
        cursor: pointer;
        transition: background-color 0.3s ease;
    }


    button:hover{
        background-color: var(--primary-hover);

    }

    .details-section {
        display: flex;
        flex-direction: column;
        gap: 1.5rem;
    }

    h1 {
        font-size: 2rem;
        margin-bottom: 1rem;
    }

    h2 {
        font-size: 1.5rem;
        margin-bottom: 1rem;
    }

    .specs-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 1rem;

    }

    .basic-info, .specs, .additional-info, .seller-info {
        background-color: var(--secondary);
        padding: 1.5rem;
        border-radius: 0.5rem;
    }

    p {
        margin: 0.5rem 0;
    }

    .bid-info {
        background-color: var(--secondary);
        padding: 1rem;
        border-radius: 0.5rem;
        font-size: 10;
    }

    @media (max-width: 768px) {
        .listing-container {
            grid-template-columns: 1fr;
        }

        .specs-grid {
            grid-template-columns: 1fr;
        }
    }
</style>
