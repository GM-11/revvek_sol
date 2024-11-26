<script lang="ts">
    import { workspaceStore } from "$lib/stores/workspace-store";
    import { walletStore } from "@svelte-on-solana/wallet-adapter-core";
    import * as anchor from "@coral-xyz/anchor";
    import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
    import { getListingAccount, getVault, getMetadataAccount, getMasterEditionAccount, mplID } from "$lib/utils/pda";
    import { type CarListing } from "$lib/utils/types";
    import Base64 from 'base64-js';
    import { convertCarListingtoMetadata, CURRENT_SOL_PRICE } from "$lib/utils/helpers";


    let imageFile: File;

    let loading = false;

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
       sellerGovtID: '',
       accidentHistory: '',
       serviceRecords: '',
       insuranceDetails: '',
       location: '',
       price: 0,
       negotiable: false,
       photos: [],
       sellerName: '',
       contact: '',
       reasonForSale: '',
       vin: '',
       video: null,
       warranty: ''
     };

    async function uploadToIPFS() {

      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("data", JSON.stringify(carListing));

      const response = await fetch("/api/uploadToIPFS/", {
        method: "POST",
        body: formData,
      });

      const {name, symbol, metadataUrl} = await response.json();

      return {
        name, symbol, uri: metadataUrl
      }
    }

    async function list() {
      loading = true;
      const {name, symbol, uri} = await uploadToIPFS();

        const nftMint = anchor.web3.Keypair.generate();
        const listingAccount = await getListingAccount($walletStore.publicKey, nftMint.publicKey);
        const nftVault = await getVault(nftMint.publicKey, listingAccount);

        const metadata = await getMetadataAccount(nftMint.publicKey);
        const masterEdition = await getMasterEditionAccount(nftMint.publicKey);

        const tx =  await $workspaceStore.program.methods
          .newListing(new anchor.BN(carListing.price / CURRENT_SOL_PRICE), name, symbol, uri)
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

        loading = false;
    }

    const handleSubmit = (e: Event) => {
       e.preventDefault();

       list();
     };

    const handleFileChange = async (event: Event, field: 'photos' | 'video') => {
      // loading = true;
      const input = event.target as HTMLInputElement;
      const file = input.files[0];
      imageFile = file;

      if (file) {
        if (field === 'photos') {
          const imageUrl = URL.createObjectURL(file);
          carListing.photos = [...carListing.photos, imageUrl];
          try {
            loading = true;
            let imageBase64 = await fetch(imageUrl)
                  .then(r => r.arrayBuffer())
                  .then(a => Base64.fromByteArray(new Uint8Array(a)));

            const result = await fetch("/api/vehicleData/", {
              method: "POST",
              headers: {
                "content-type": "application/json",
              },
              body: JSON.stringify({
                imageBase64
              })
            })

            const response = JSON.parse(await result.json()) as {
              make: string; model: string; type: string; color: string;
              transmission: string; mileage: number; fuelType: string;
              engineSize: string; price: number
            };


            carListing.make = response.make;
            carListing.model = response.model;
            carListing.type = response.type;
            carListing.color = response.color;
            carListing.transmission = response.transmission;
            carListing.mileage = response.mileage;
            carListing.fuelType = response.fuelType;
            carListing.engineSize = response.engineSize;
            carListing.price = response.price;
          } catch (error) {
            console.error('Error analyzing image:', error);
          } finally {
            loading = false;
          }
        } else if (field === 'video') {
          carListing.video = file[0];
        }
      }

    };
CURRENT_SOL_PRICE
</script>
<main>


    {#if loading}
      <div class="overlay">
          <h1> Loading... </h1>
      </div>
    {/if}


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
        <div class="field">
          <label for="contact">Valid Government ID:</label>
          <input id="contact" type="text" bind:value={carListing.sellerGovtID} required />
        </div>
    </div>
    <h2>Photos and Videos</h2>
    <div class="container">
        <div class="field" >
          <label for="photos">Photos</label>
          <input id="photos" type="file" multiple accept="image/*" on:change={(e) => handleFileChange(e, 'photos')} required />

          {#if carListing.photos.length > 0}
            <div style="display: flex; flex-wrap: wrap; gap: 1rem; margin-top: 1rem;">
              {#each carListing.photos as photo}
                <img src={photo} alt="Selected car" style="object-fit: cover; border-radius: 4px;"/>
              {/each}
            </div>
          {/if}
        </div>
        <div class="field">
          <label for="video">Video</label>
          <input id="video" type="file" accept="video/*" on:change={(e) => handleFileChange(e, 'video')} />
        </div>
    </div>
    <h2>General Information</h2>
    <div class="container">
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
             <option value="Coupe">
           </select>
         </div>


                  <div class="field">
                    <label for="accidentHistory">Accident History:</label>
                    <input id="accidentHistory" bind:value={carListing.accidentHistory} required/>
                  </div>

                  <div class="field">
                    <label for="serviceRecords">Service Records:</label>
                    <input id="serviceRecords" bind:value={carListing.serviceRecords} required>
                  </div>
                  <div class="field">
                    <label for="insuranceDetails">Insurance Details:</label>
                    <input id="insuranceDetails" bind:value={carListing.insuranceDetails} required>
                  </div>
                  <div class="field">
                    <label for="location">Location:</label>
                    <input id="location" type="text" bind:value={carListing.location} required />
                  </div>

                  <div class="field">
                    <label for="reasonForSale">Reason for Sale:</label>
                    <input id="reasonForSale" bind:value={carListing.reasonForSale} required />
                  </div>
                  <div class="field">
                    <label for="vin">VIN:</label>
                    <input id="vin" type="text" bind:value={carListing.vin} required />
                  </div>
                  <div class="field">
                    <label for="warranty">Warranty Information:</label>
                    <input id="warranty" bind:value={carListing.warranty} required />
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
        <h2>Price</h2>
        <div class="container">
         <div class="field">
           <label for="price">Price (USD):</label>
           <input id="price" type="number" min="0" bind:value={carListing.price} required />
           <label>
             <input type="checkbox" bind:checked={carListing.negotiable} />
             Negotiable
           </label>
         </div>


         </div>
        <button on:click={handleSubmit} class="btn">Submit Listing</button>
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


      .overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
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
