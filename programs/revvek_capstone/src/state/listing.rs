use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Listing {
    pub nft_mint: Pubkey,
    pub initial_owner: Pubkey,
    pub base_price: u64,
    #[max_len(46)]
    pub listing_uri_hash: String,
    pub bump: u8,
}
