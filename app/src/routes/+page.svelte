<script lang="ts">
    import { walletStore } from "@svelte-on-solana/wallet-adapter-core";
</script>


<main>
    <div class="bg">
        <h1>Transfer ownership of your vehicle</h1>
        <br/>
        <br/>
        <h2> Discover premium pre-owned vehicles from trusted sellers. Every car is thoroughly inspected and verified</h2>
        <br/>
        <br/>
        <section>
            <a href="/vehicles" class="search">Search Vehicles</a>
            <a href="/sell" class="sell">Sell your Vehicle</a>
        </section>
    </div>
</main>

<style>

    main {
        background-image: url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80");
        background-size: cover;
    }

    h1 {
        font-size: 3rem;
        font-weight: 600;
    }

    .search {
        background-color: var(--primary);
        transition: 0.1s;
    }
    .search:hover {
        background-color: var(--primary-hover);
        transition: 0.1s;
    }

    .sell {
        background-color: var(--secondary);
        transition: 0.1s;
    }
    .sell:hover {
        background-color: var(--secondary-hover);
        transition: 0.1s;
    }

    a {
        padding: 1rem 2rem;
        border-radius: 0.75rem;
        border: none;
        color: var(--text);
        font-family: "Inter" , sans-serif;
        font-weight: 5300;
        cursor: pointer;
        text-decoration: none;
        font-size: 1rem;
    }

    h2 {
        font-size: 1.5rem;
        font-weight: 400;
        width: 70%;
    }

    section {
        padding-bottom: 5rem;
    }

    .bg{
        padding-inline: 7rem;
        color: var(--text);
        background-color: rgba(0, 0, 0, 0.5);
        min-height: 100vh;
        display: flex;
        flex-direction: column;
        justify-content: flex-end;
    }
</style>
