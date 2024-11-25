<script lang="ts">
  import {workspaceStore} from '$lib/stores/workspace-store';
  import { onMount } from 'svelte';

  let listings: any[] = [];
  onMount(async () => {
   listings =  await $workspaceStore.program.account.listing.all();
   console.log("listings")
   console.log(listings);
  });


</script>


<main>

    <h1>Vehicles</h1>

    {#if listings.length === 0}
        <p>No listings found</p>
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
</style>
