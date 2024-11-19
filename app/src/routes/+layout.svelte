<script lang="ts">
    import { onMount } from "svelte";
    import { clusterApiUrl } from "@solana/web3.js";
    import {
        WalletProvider,
        WalletMultiButton,
        ConnectionProvider,
    } from "@svelte-on-solana/wallet-adapter-ui";

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
<slot />
<WalletMultiButton />


<style>
    :global(body){
        margin: 0;
        padding: 0;
    }
</style>
