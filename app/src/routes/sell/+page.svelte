<script lang="ts">
    import { workspaceStore } from "$lib/stores/workspace-store";
    import { walletStore } from "@svelte-on-solana/wallet-adapter-core";
    import * as anchor from "@coral-xyz/anchor";
    import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
    import { getListingAccount, getVault, getMetadataAccount, getMasterEditionAccount, mplID } from "$lib/utils/pda";
    import { type CarListing } from "$lib/utils/types";

    let price = 0;
    let name = "";
    let symbol = "";
    let uri = "";

    let carListing: CarListing = {
       make: '',
       model: '',
       year: new Date().getFullYear(),
       type: '',
       mileage: 0,
       fuelType: '',
       transmission: '',
       condition: '',
       color: '',
       engineSize: '',
       owners: 1,
       accidentHistory: '',
       features: [],
       serviceRecords: '',
       insuranceDetails: '',
       location: '',
       price: 0,
       negotiable: false,
       photos: [],
       sellerName: '',
       contact: '',
       communicationPreference: '',
       reasonForSale: '',
       vin: '',
       warranty: ''
     };

    async function list() {
      const nftMint = anchor.web3.Keypair.generate();
        const listingAccount = await getListingAccount($walletStore.publicKey, nftMint.publicKey);
        const nftVault = await getVault(nftMint.publicKey, listingAccount);

        const metadata = await getMetadataAccount(nftMint.publicKey);
        const masterEdition = await getMasterEditionAccount(nftMint.publicKey);

        const tx =  await $workspaceStore.program.methods
          .newListing(new anchor.BN(price), name, symbol, uri)
          .accountsPartial({
            initialOwner: $walletStore.publicKey,
            nftMint: nftMint.publicKey,
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
          .signers([nftMint]).
          rpc();
    }

    const handleSubmit = (e: Event) => {
       e.preventDefault();
       console.log('Car Listing:', carListing);
       // You can send this data to your backend via fetch API
     };

    const handleFileChange = (event: Event, field: 'photos' | 'video') => {
      const input = event.target as HTMLInputElement;
      const files = input.files;
      if (files) {
        if (field === 'photos') {
          carListing.photos = Array.from(files);
        } else if (field === 'video') {
          carListing.video = files[0];
        }
      }
    };

</script>
<main>
    <h1>List Your Car for Sale</h1>
    <h2>Seller Information</h2>
    <div class="container">
        <div class="field">
          <label for="sellerName">Seller Name:</label>
          <input id="sellerName" type="text" bind:value={carListing.sellerName} required />
        </div>
        <div class="field">
          <label for="contact">Contact:</label>
          <input id="contact" type="text" bind:value={carListing.contact} required />
        </div>
    </div>
    <h2>General Information</h2>
    <div class="container">
         <!-- Vehicle Details -->
            <div class="field">
               <label for="make">Make:</label>
               <input id="make" type="text" bind:value={carListing.make} required />
            </div>
            <div class="field">
               <label for="model">Model:</label>
               <input id="model" type="text" bind:value={carListing.model} required />
            </div>
            <div class="field">
                <label for="year">Year:</label>
                <input id="year" type="number" min="1886" max={new Date().getFullYear()} bind:value={carListing.year} required />
           </div>
         <div class="field">
           <label for="type">Type:</label>
           <select id="type" bind:value={carListing.type} required>
             <option value="" disabled>Select Type</option>
             <option value="Sedan">Sedan</option>
             <option value="SUV">SUV</option>
             <option value="Hatchback">Hatchback</option>
             <option value="Truck">Truck</option>
             <option value="Convertible">Convertible</option>
           </select>
         </div>
        </div>
        <h2>Vehicle Specifications</h2>
        <div class="container">
         <div class="field">
           <label for="mileage">Mileage (in km):</label>
           <input id="mileage" type="number" min="0" bind:value={carListing.mileage} required />
         </div>
        <div class="field">
           <label for="fuelType">Fuel Type:</label>
           <select id="fuelType" bind:value={carListing.fuelType} required>
             <option value="" disabled>Select Fuel Type</option>
             <option value="Petrol">Petrol</option>
             <option value="Diesel">Diesel</option>
             <option value="Electric">Electric</option>
             <option value="Hybrid">Hybrid</option>
           </select>
        </div>
         <div class="field">
           <label for="transmission">Transmission:</label>
           <select id="transmission" bind:value={carListing.transmission} required>
             <option value="" disabled>Select Transmission</option>
             <option value="Manual">Manual</option>
             <option value="Automatic">Automatic</option>
           </select>
         </div>
         <div class="field">
           <label for="condition">Condition:</label>
           <select id="condition" bind:value={carListing.condition} required>
             <option value="" disabled>Select Condition</option>
             <option value="New">New</option>
             <option value="Used">Used</option>
           </select>
         </div>
         <div class="field">
           <label for="color">Color:</label>
           <input id="color" type="text" bind:value={carListing.color} required />
         </div>
         <div class="field">
           <label for="engineSize">Engine Size (e.g., 1500cc):</label>
           <input id="engineSize" type="text" bind:value={carListing.engineSize} required />
         </div>

        </div>
        <div class="container">

         <!-- Pricing -->
         <div class="field">
           <label for="price">Price (USD):</label>
           <input id="price" type="number" min="0" bind:value={carListing.price} required />
         </div>
         <div class="field">
           <label>
             <input type="checkbox" bind:checked={carListing.negotiable} />
             Negotiable
           </label>
         </div>

         <!-- Media -->
         <div class="field">
           <label for="photos">Photos:</label>
           <input id="photos" type="file" multiple accept="image/*" on:change={(e) => handleFileChange(e, 'photos')} required />
         </div>
         <div class="field">
           <label for="video">Video (Optional):</label>
           <input id="video" type="file" accept="video/*" on:change={(e) => handleFileChange(e, 'video')} />
         </div>

         <!-- Seller Details -->
         <!-- Submit -->
         </div>
        <button type="submit" class="btn">Submit Listing</button>
</main>

<style>
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


    .container {
        width: 95%;
        align-self: center;
        background-color: var(--secondary);
        padding: 2rem;
        margin-block: 1rem;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);

        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 1rem;

      }

      button {
          width: 100%;
          margin-bottom: 1rem;
      }

      h1 {
        font-size: 2rem;
        text-align: center;
        margin-bottom: 1.5rem;
        color: var(--accent);
      }

      h2 {
          align-self: flex-start;
      }


      .field {
        display: flex;
        flex-direction: column;
      }

      label {
        font-size: 1rem;
        margin-bottom: 0.5rem;
        color: var(--text);
      }

      input, select, textarea {
        padding: 0.8rem;
        border: none;
        border-radius: 4px;
        font-size: 1rem;
        background-color: var(--secondary-hover);
        color: var(--text);
      }

      input:focus, select:focus, textarea:focus {
        outline: 2px solid var(--primary);
      }

      button.btn {
        padding: 0.8rem 1.2rem;
        background-color: var(--primary);
        border: none;
        border-radius: 4px;
        font-size: 1.2rem;
        color: var(--text);
        cursor: pointer;
        transition: background-color 0.3s ease;
      }

      button.btn:hover {
        background-color: var(--primary-hover);
      }

      @media (max-width: 768px) {
        .container {
          padding: 1.5rem;
        }

        h1 {
          font-size: 1.8rem;
        }
      }
</style>
