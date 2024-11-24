<script lang="ts">
  import Icon from '@iconify/svelte';
</script>


<main>
    <div class="bg">
        <h1>Buy and sell your vehicles with ease</h1>
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
<div class="features">
        <div class="feature-item">
            <Icon icon="lucide:shield" width="64" height="64"  style="color: #ff3131" />
            <br>
            <h2>Verified Documents</h2>
            <br>
            <p>Complete and full verification of documents</p>
        </div>
        <div class="feature-item">
            <Icon icon="lucide:fuel" width="64" height="64"  style="color: #B68F40" />
            <br>
            <h2>Full History</h2>
            <br>
            <p>Full access to vehicle history</p>
        </div>
        <div class="feature-item">
            <Icon icon="lucide:clock" width="64" height="64"  style="color: #ff3131" />
            <br>
            <h2>Quick Process</h2>
            <br>
            <p>Seamless and fast transfer of ownership</p>
        </div>

        <!-- <div class="feature-item">
            <Icon icon="lucide:fuel" width="64" height="64"  style="color: #B68F40" />
            <br>
            <h2>Security</h2>
            <br>
            <p>Every vehicle undergoes a thorough inspection</p>
        </div> -->
</div>

<style>

    main {
        background-image: url("https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?auto=format&fit=crop&w=1200&q=80");
        background-size: cover;
    }

    h1 {
        font-size: 3rem;
        font-weight: 600;
    }


    .features {
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: space-evenly;
        background-color: var(--secondary);
        padding: 1rem;
        height: 15rem;
    }
    .feature-item {
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        align-items: center;
        justify-content: center;
    }

    .feature-item h2 {
        font-size: 1.5rem;
        font-weight: 600;
        color: var(--text);
        width: 70%;
    }

    .feature-item p {
        font-size: 1rem;
        font-weight: 300;
        color: #999696;
        width: 70%;
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
