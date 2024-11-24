<script lang="ts">
    import { workspaceStore } from "$lib/stores/workspace-store";
    import * as anchor from "@coral-xyz/anchor";
    import { mplID } from "$lib/utils/constants";
    import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from "@solana/spl-token";
    import { getListingAccount, getVault, getMetadataAccount, getMasterEditionAccount } from "$lib/utils/pda";


    let price = 0;
    let name = "";
    let symbol = "";
    let uri = "";

    async function list() {

      const nftMint = anchor.web3.Keypair.generate();
        const listingAccount = await getListingAccount($workspaceStore.baseAccount.publicKey, nftMint.publicKey);
        const nftVault = await getVault(nftMint.publicKey, listingAccount);

        const metadata = await getMetadataAccount(nftMint.publicKey);
        const masterEdition = await getMasterEditionAccount(nftMint.publicKey);

        const tx =  await $workspaceStore.program.methods
          .newListing(new anchor.BN(price), name, symbol, uri)
          .accountsPartial({
            initialOwner: $workspaceStore.baseAccount.publicKey,
            nftMint: nftMint.publicKey,
            metadata,
            masterEdition,
            listingAccount,
            nftVault,
            rent: anchor.web3.SYSVAR_RENT_PUBKEY,
            systemProgram: anchor.web3.SystemProgram.programId,
            metadataProgram: mplID,
            tokenProgram: TOKEN_PROGRAM_ID,
            associatedTokenProgram: ASSOCIATED_TOKEN_PROGRAM_ID,
          })
          .signers([nftMint]).rpc();
    }
</script>
<main>
<button on:click={() => {
  console.log("a;lksdfj")
  list();
}}>List</button>
</main>

<style>
    main {
        padding-top: 10rem;
    }
</style>
