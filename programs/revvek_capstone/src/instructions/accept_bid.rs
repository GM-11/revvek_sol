use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    token::{close_account, CloseAccount, Token},
    token_interface::{transfer_checked, Mint, TokenAccount, TransferChecked},
};

use crate::{bid::Bid, listing::Listing};

#[derive(Accounts)]
pub struct AcceptBid<'info> {
    #[account(mut)]
    pub initial_owner: Signer<'info>,

    #[account(mut)]
    pub listing_account: Box<Account<'info, Listing>>,

    #[account(mut)]
    pub bidding_account: Box<Account<'info, Bid>>,

    #[account(
        mut,
        associated_token::mint = nft_mint,
        associated_token::authority = initial_owner
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
    pub bidder_ata: InterfaceAccount<'info, TokenAccount>,

    pub system_program: Program<'info, System>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub token_program: Program<'info, Token>,

    #[account(
        mut,
        has_one = nft_mint
    )]
    pub bidder: Account<'info, Bid>,
}

impl<'info> AcceptBid<'info> {
    pub fn transfer_staked_amount(&mut self) -> Result<()> {
        let staked_amount = self.bidding_account.to_account_info().lamports();
        let cpi_program = self.system_program.to_account_info();

        let cpi_accounts = anchor_lang::system_program::Transfer {
            from: self.bidding_account.to_account_info(),
            to: self.initial_owner.to_account_info(),
        };

        let seeds = &[
            b"bid".as_ref(),
            &self.listing_account.key().to_bytes()[..],
            &self.bidding_account.bidder.key().to_bytes()[..],
            &[self.bidding_account.bump],
        ];
        let signer_seeds = &[&seeds[..]];

        let cpi_ctx = CpiContext::new_with_signer(cpi_program, cpi_accounts, signer_seeds);

        anchor_lang::system_program::transfer(cpi_ctx, staked_amount)
    }

    pub fn tranfer_nft(&mut self) -> Result<()> {
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

    pub fn close_accounts(&mut self) -> Result<()> {
        let bidding_seeds = &[
            b"bid".as_ref(),
            &self.listing_account.key().to_bytes()[..],
            &self.bidding_account.bidder.key().to_bytes()[..],
            &[self.bidding_account.bump],
        ];
        let bidding_signer_seeds = &[&bidding_seeds[..]];

        let cpi_program = self.token_program.to_account_info();

        let close_accounts_listing = CloseAccount {
            account: self.listing_account.to_account_info(),
            destination: self.initial_owner.to_account_info(),
            authority: self.initial_owner.to_account_info(),
        };

        let close_accounts_bidding = CloseAccount {
            account: self.bidding_account.to_account_info(),
            destination: self.bidder.to_account_info(),
            authority: self.bidder.to_account_info(),
        };

        let listing_close_cpi_ctx = CpiContext::new(cpi_program.clone(), close_accounts_listing);

        let bidding_close_cpi_ctx =
            CpiContext::new_with_signer(cpi_program, close_accounts_bidding, bidding_signer_seeds);

        close_account(listing_close_cpi_ctx)?;
        close_account(bidding_close_cpi_ctx)
    }
}
