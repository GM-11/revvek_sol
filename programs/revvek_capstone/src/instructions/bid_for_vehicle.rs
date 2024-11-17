use anchor_lang::{prelude::*, solana_program::native_token::LAMPORTS_PER_SOL};

use crate::{bid::Bid, error::CustomErrors, listing::Listing};

#[derive(Accounts)]
pub struct BidForVehicle<'info> {
    #[account(mut)]
    pub bidder: Signer<'info>,

    #[account(
        init,
        payer = bidder,
        space = 8 + Bid::INIT_SPACE,
        seeds = [b"bid".as_ref(), listing_account.key().as_ref(), bidder.key().as_ref()],
        bump
    )]
    pub bid_account: Account<'info, Bid>,

    #[account(mut)]
    pub listing_account: Account<'info, Listing>,

    pub system_program: Program<'info, System>,
}

impl<'info> BidForVehicle<'info> {
    pub fn bid(&mut self, bid_amount: u64, bumps: &BidForVehicleBumps) -> Result<()> {
        require!(
            bid_amount >= self.listing_account.base_price,
            CustomErrors::InvalidBidAmount
        );

        self.bid_account.set_inner(Bid {
            nft_mint: self.listing_account.nft_mint,
            bidder: self.bidder.key(),
            base_price: self.listing_account.base_price,
            bump: bumps.bid_account,
        });

        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = anchor_lang::system_program::Transfer {
            from: self.bidder.to_account_info(),
            to: self.bid_account.to_account_info(),
        };
        let cpi_ctx = CpiContext::new(cpi_program, cpi_accounts);

        anchor_lang::system_program::transfer(cpi_ctx, bid_amount * LAMPORTS_PER_SOL)
    }
}
