pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("Drh7RDvzgHewJt66SSkRfec3fL6FMm2WSVs8uJzVeJDK");

#[program]
pub mod revvek_capstone {
    use super::*;

    pub fn new_listing(
        ctx: Context<NewListing>,
        base_price: u64,
        nft_name: String,
        nft_symbol: String,
        nft_uri: String,
    ) -> Result<()> {
        ctx.accounts.create_listing(base_price, &ctx.bumps)?;
        ctx.accounts.mint_to_vault(nft_name, nft_symbol, nft_uri)
    }
}
