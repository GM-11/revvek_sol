use anchor_lang::prelude::*;

use crate::{listing::Listing, LISTING_SEED};

#[derive(Accounts)]
#[instruction(base_price: u64)]
pub struct NewListing<'info> {
    #[account(mut)]
    pub initial_owner: Signer<'info>,

    #[account(
            init,
            payer = initial_owner,
            space = 8 + Listing::INIT_SPACE,
            seeds = [
                LISTING_SEED.as_ref(),
                initial_owner.key().as_ref(),
                base_price.to_le_bytes().as_ref()],
            bump
        )]
    pub listing_account: Account<'info, Listing>,

    pub system_program: Program<'info, System>,
}

impl<'info> NewListing<'info> {
    pub fn create_listing(&mut self) -> Result<()> {
        todo!()
    }

    pub fn mint_to_vault(&mut self) -> Result<()> {
        todo!()
    }
}
