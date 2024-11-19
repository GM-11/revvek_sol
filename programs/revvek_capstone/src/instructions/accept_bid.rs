use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::Token,
    token_interface::{transfer_checked, Mint, TokenAccount, TransferChecked},
};

use crate::{bid::Bid, listing::Listing};

#[derive(Accounts)]
pub struct AcceptBid<'info> {
    #[account(mut)]
    pub initial_owner: Signer<'info>,

    #[account(mut, close = initial_owner)]
    pub listing_account: Box<Account<'info, Listing>>,

    #[account(
        mut,
        has_one = nft_mint
    )]
    pub bid_account: Box<Account<'info, Bid>>,

    #[account(mut)]
    pub bidder: SystemAccount<'info>,

    #[account(
        mut,
        associated_token::mint = nft_mint,
        associated_token::authority = listing_account
    )]
    pub nft_vault: InterfaceAccount<'info, TokenAccount>,

    #[account(
        mut,
        constraint = nft_mint.key() == listing_account.nft_mint.key()
    )]
    pub nft_mint: Box<InterfaceAccount<'info, Mint>>,

    #[account(
        init_if_needed,
        payer = initial_owner,
        associated_token::mint = nft_mint,
        associated_token::authority = bidder,
    )]
    pub bidder_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,
}

impl<'info> AcceptBid<'info> {
    pub fn transfer_staked_amount(&mut self) -> Result<()> {
        msg!("transferring staked amount");
        let staked_amount = self.bid_account.to_account_info().lamports();

        **self
            .bid_account
            .to_account_info()
            .try_borrow_mut_lamports()? -= staked_amount;
        **self
            .initial_owner
            .to_account_info()
            .try_borrow_mut_lamports()? += staked_amount;

        Ok(())
    }

    pub fn tranfer_nft(&mut self) -> Result<()> {
        msg!("transferring nft");
        let cpi_program = self.token_program.to_account_info();

        let cpi_accounts = TransferChecked {
            from: self.nft_vault.to_account_info(),
            mint: self.nft_mint.to_account_info(),
            to: self.bidder_ata.to_account_info(),
            authority: self.listing_account.to_account_info(),
        };

        let seeds = &[
            b"listing".as_ref(),
            &self.initial_owner.key().to_bytes()[..],
            &self.nft_mint.key().to_bytes()[..],
            &[self.listing_account.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        transfer_checked(cpi_ctx, 1, self.nft_mint.decimals)
    }

    // pub fn close_accounts(&mut self) -> Result<()> {
    //     msg!("closing accounts");
    //     let cpi_program = self.system_program.to_account_info();

    //     let close_accounts_listing = CloseAccount {
    //         account: self.listing_account.to_account_info(),
    //         destination: self.initial_owner.to_account_info(),
    //         authority: self.initial_owner.to_account_info(),
    //     };

    //     let listing_close_cpi_ctx = CpiContext::new(cpi_program.clone(), close_accounts_listing);

    //     close_account(listing_close_cpi_ctx)
    // }
}
