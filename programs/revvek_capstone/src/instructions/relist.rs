use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{MasterEditionAccount, Metadata, MetadataAccount},
    token_2022::{transfer_checked, TransferChecked},
    token_interface::{Mint, TokenAccount, TokenInterface},
};

use crate::listing::Listing;

#[derive(Accounts)]
pub struct Relist<'info> {
    #[account(mut)]
    pub initial_owner: Signer<'info>,

    #[account(
        mut,
        associated_token::mint = nft_mint,
        associated_token::authority = initial_owner,
    )]
    pub initial_owner_ata: Box<InterfaceAccount<'info, TokenAccount>>,

    #[account(
        init_if_needed,
        payer = initial_owner,
        space = 8 + Listing::INIT_SPACE,
        seeds = [
            b"listing".as_ref(),
            initial_owner.key().as_ref(),
            nft_mint.key().as_ref()],
        bump,
    )]
    pub listing_account: Box<Account<'info, Listing>>,

    #[account(
        mut,
        seeds = [
            b"metadata".as_ref(),
            metadata_program.key().as_ref(),
            nft_mint.key().as_ref(),
        ],
        bump,
    )]
    pub metadata: Box<Account<'info, MetadataAccount>>,

    #[account(
        mut,
        seeds = [
            b"metadata".as_ref(),
            metadata_program.key().as_ref(),
            nft_mint.key().as_ref(),
            b"edition"
        ],
        bump,
    )]
    pub master_edition: Box<Account<'info, MasterEditionAccount>>,

    #[account(
        mut,
        associated_token::mint = nft_mint,
        associated_token::authority = listing_account,
    )]
    pub nft_vault: Box<InterfaceAccount<'info, TokenAccount>>,

    pub nft_mint: Box<InterfaceAccount<'info, Mint>>,

    pub metadata_program: Program<'info, Metadata>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Interface<'info, TokenInterface>,
}

impl<'info> Relist<'info> {
    pub fn relist(&mut self, listing_uri_hash: String, bumps: &RelistBumps) -> Result<()> {
        self.listing_account.set_inner(Listing {
            nft_mint: self.nft_mint.key(),
            listing_uri_hash,
            initial_owner: self.initial_owner.key(),
            base_price: self.listing_account.base_price,
            bump: bumps.listing_account,
        });

        Ok(())
    }

    pub fn transfer_nft(&mut self) -> Result<()> {
        let cpi_program = self.token_program.to_account_info();
        let cpi_accounts = TransferChecked {
            from: self.initial_owner_ata.to_account_info(),
            mint: self.nft_mint.to_account_info(),
            to: self.nft_vault.to_account_info(),
            authority: self.listing_account.to_account_info(),
        };
        transfer_checked(CpiContext::new(cpi_program, cpi_accounts), 1, 0)
    }
}
