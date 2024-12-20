use anchor_lang::prelude::*;

#[account]
#[derive(InitSpace)]
pub struct Bid {
    pub nft_mint: Pubkey,
    pub bidder: Pubkey,
    pub base_price: u64,
    pub listing_account: Pubkey,
    pub bump: u8,
}
