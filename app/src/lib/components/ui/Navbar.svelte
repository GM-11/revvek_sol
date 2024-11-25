<script>
    import { WalletMultiButton } from "@svelte-on-solana/wallet-adapter-ui";

    </script>

<div>
    <nav>
        <a href="/">
            <h1>Revvek</h1>
        </a>
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
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.3);

    }
    a {
        text-decoration: none;
        color: var(--primary);
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
