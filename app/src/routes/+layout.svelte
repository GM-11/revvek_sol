<script lang="ts">
    import { onMount } from "svelte";
    import {
        WalletProvider,
    } from "@svelte-on-solana/wallet-adapter-ui";
    import Navbar from "$lib/components/ui/Navbar.svelte";
    import "@coral-xyz/anchor";

    import idl from "$lib/idl/revvek.json";

    import AnchorConnectionProvider from "$lib/components/wallet/AnchorConnectionProvider.svelte";


    const localStorageKey = "walletAdapter";
    const network = "https://rpc.testnet.soo.network/rpc"; // localhost or mainnet

    let wallets: any[];

    onMount(async () => {
        const {
            NightlyWalletAdapter
        } = await import("@solana/wallet-adapter-wallets");

        const walletsMap = [
            new NightlyWalletAdapter()
        ];

        wallets = walletsMap;
    });
</script>

<WalletProvider {localStorageKey} {wallets} autoConnect />
<AnchorConnectionProvider {network} {idl} />
<!-- <ConnectionProvider {network} /> -->

<Navbar />
<slot />

<style>
    @import url("https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap");

    :root {
        --background: #121212;
        --primary: #ff3131;
        --secondary: #1a1a1a;
        --accent: #b68f40;
        --text: #eaeaea;
        --primary-hover: #ad0c0c;
        --secondary-hover: #0a0909;
    }



    :global(body, h1, h2, h3, h4, h5, h6, p) {
        margin: 0;
        padding: 0;
        font-family: "Inter", sans-serif;
    }
</style>
