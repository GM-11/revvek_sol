<script lang="ts">
    import { onMount } from "svelte";
    import { clusterApiUrl } from "@solana/web3.js";
    import {
        WalletProvider,
        ConnectionProvider,
    } from "@svelte-on-solana/wallet-adapter-ui";
    import Navbar from "$lib/components/Navbar.svelte";

    const localStorageKey = "walletAdapter";
    const network = clusterApiUrl("devnet"); // localhost or mainnet

    let wallets: any[];

    onMount(async () => {
        const {
            PhantomWalletAdapter,

            SolflareWalletAdapter,
            TorusWalletAdapter,
        } = await import("@solana/wallet-adapter-wallets");

        const walletsMap = [
            new PhantomWalletAdapter(),
            new SolflareWalletAdapter(),
            new TorusWalletAdapter(),
        ];

        wallets = walletsMap;
    });
</script>

<WalletProvider {localStorageKey} {wallets} autoConnect />
<ConnectionProvider {network} />
<Navbar/>
<slot />

<style>

    @import url('https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap');

    :root {
      --background: #121212;
      --primary: #FF3131;
      --secondary: #1a1a1a;
      --accent: #B68F40;
      --text: #EAEAEA;
      --primary-hover: #ad0c0c;
      --secondary-hover: #0a0909;
    }

    :global(body, h1, h2, h3, h4, h5, h6, p){
        margin: 0;
        padding: 0;
        font-family: "Inter", sans-serif;
    }

    /* :global(main) {
        min-height: 80vh;
        background: var(--background);
        color: var(--text);
    } */


</style>
