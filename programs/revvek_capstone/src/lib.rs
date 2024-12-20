pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use instructions::*;
pub use state::*;

declare_id!("9CR2SnBXi84kXwtLHqetdttE8LmrULTRZbDTVkqqiys7");

#[program]
pub mod revvek_capstone {
    use super::*;

    pub fn new_listing(
        ctx: Context<NewListing>,
        base_price: u64,
        listing_uri_hash: String,
        nft_name: String,
        nft_symbol: String,
        nft_uri: String,
    ) -> Result<()> {
        ctx.accounts
            .create_listing(base_price, listing_uri_hash, &ctx.bumps)?;
        ctx.accounts.mint_to_vault(nft_name, nft_symbol, nft_uri)
    }

    pub fn bid_for_vehicle(ctx: Context<BidForVehicle>, bid_amount: u64) -> Result<()> {
        ctx.accounts.bid(bid_amount, &ctx.bumps)
    }

    pub fn accept_bid(ctx: Context<AcceptBid>) -> Result<()> {
        ctx.accounts.tranfer_nft()?;
        ctx.accounts.transfer_staked_amount()
    }

    pub fn relist(ctx: Context<Relist>, listing_uri_hash: String) -> Result<()> {
        ctx.accounts.relist(listing_uri_hash, &ctx.bumps)?;
        ctx.accounts.transfer_nft()
    }
}
