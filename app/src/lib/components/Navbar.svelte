<script>
    import { WalletMultiButton } from "@svelte-on-solana/wallet-adapter-ui";

    </script>

<div>
    <nav>
        <h1>Revvek</h1>

        <WalletMultiButton />
    </nav>
</div>
<style>
    nav {
        display: flex;
        justify-content: space-between;
        align-items: center;
        color: var(--primary);
        background-color: var(--secondary);
        position: absolute;
        border-radius: 0.5rem;
        padding: 1rem;
        width: 80vw;
    }


    div {
        width: 100%;
        height: 4rem;
        background-color: transparent;
        position: absolute;
        padding-top: 1rem;
        display: flex;
        justify-content: center;
    }

</style>
