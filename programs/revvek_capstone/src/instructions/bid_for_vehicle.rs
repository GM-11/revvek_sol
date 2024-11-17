use anchor_lang::prelude::*;

#[derive(Accounts)]
pub struct BidForVehicle<'info> {
    #[account(mut)]
    pub bidder: Signer<'info>,
}

impl<'info> BidForVehicle<'info> {
    pub fn bid(&mut self) -> Result<()> {
        todo!()
    }
}
