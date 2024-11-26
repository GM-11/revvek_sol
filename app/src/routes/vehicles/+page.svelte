<script lang="ts">
  import { workspaceStore } from "$lib/stores/workspace-store";
  import { onMount } from "svelte";
  import { parseListings } from "$lib/utils/parsing";
  import { type Listing } from "$lib/utils/types";

  let listings: Listing[] = [];

  let loading = true;
  onMount(async () => {
    const l = await $workspaceStore.program.account.listing.all();
    listings = await parseListings(l);
    loading = false;
  });
</script>

<main>
  <h1>Vehicles</h1>

  {#if loading}
    <p>Loading...</p>
  {:else if listings.length === 0}
    <p>No listings found.</p>
  {:else}
    <div class="listings">
      {#each listings as listing}
        <a
          href={`listing/${listing.nftMint.toString()}--${listing.listingUriHash}--${listing.publicKey}`}
          class="listing"
        >
          <div class="listing-image">
            <img src={listing.imageUri} alt={listing.name} />
          </div>
          <div class="listing-header-details">
            <h2>{listing.make} {listing.model}</h2>
            <p>{listing.price} USD</p>
          </div>
        </a>
      {/each}
    </div>
  {/if}
</main>

<style>
  main {
    padding-top: 10%;
    min-height: 100vh;
    padding-inline: 9%;
    background-color: var(--background);
    color: var(--text);
  }

  .listings {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-top: 1rem;
  }
  .listing {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    padding: 1rem;
    text-decoration: none;
    color: var(--text);
    border: 1px solid var(--accent);
    background-color: var(--secondary);
    border-radius: 0.5rem;
    cursor: pointer;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    transition: 0.15s;
  }
  .listing:hover {
    scale: 1.01;
    transition: 0.15s;
  }
  .listing-image {
    width: 100%;
    height: 15rem;
    margin-bottom: 0.5rem;
    overflow: hidden;
    border-radius: 0.5rem;
  }
  .listing-image img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
  .listing-header-details {
    display: flex;
    flex-direction: row;
    width: 100%;
    justify-content: space-between;
    align-items: flex-end;
  }
</style>
