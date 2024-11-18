pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use instructions::*;
pub use state::*;

declare_id!("7n3fAHRanf5Fxmqj3x2V9sxmDT4zsew5yNyaCq3FES61");

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

    pub fn bid_for_vehicle(ctx: Context<BidForVehicle>, bid_amount: u64) -> Result<()> {
        ctx.accounts.bid(bid_amount, &ctx.bumps)
    }

    pub fn accept_bid(ctx: Context<AcceptBid>) -> Result<()> {
        ctx.accounts.transfer_staked_amount()?;
        ctx.accounts.tranfer_nft()?;
        ctx.accounts.close_accounts()
    }

    pub fn relist(ctx: Context<Relist>) -> Result<()> {
        ctx.accounts.relist(&ctx.bumps)?;
        ctx.accounts.transfer_nft()
    }
}
