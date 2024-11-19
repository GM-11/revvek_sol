<script lang="ts">
    import { walletStore } from "@svelte-on-solana/wallet-adapter-core";
    import {
        WalletProvider,
        WalletMultiButton,
        ConnectionProvider,
    } from "@svelte-on-solana/wallet-adapter-ui";
    import { clusterApiUrl } from "@solana/web3.js";
    import {
        PhantomWalletAdapter,
        SolflareWalletAdapter,
    } from "@solana/wallet-adapter-wallets";

    const localStorageKey = "walletAdapter";
    const network = clusterApiUrl("devnet"); // localhost or mainnet

    let wallets = [new PhantomWalletAdapter(), new SolflareWalletAdapter()];
</script>

<WalletProvider {localStorageKey} {wallets} autoConnect />
<ConnectionProvider {network} />

{#if $walletStore?.connected}
    <div>My wallet is connected</div>
{/if}
