use anchor_lang::prelude::*;

use crate::listing::Listing;

#[derive(Accounts)]
#[instruction(base_price: u64)]
pub struct AcceptBid<'info> {
    #[account(mut)]
    pub initial_owner: Signer<'info>,
}

impl<'info> AcceptBid<'info> {
    pub fn transfer_staked_amount(&mut self) -> Result<()> {
        todo!()
    }

    pub fn tranfer_nft(&mut self) -> Result<()> {
        todo!()
    }

    pub fn close_accounts(&mut self) -> Result<()> {
        todo!()
    }
}
