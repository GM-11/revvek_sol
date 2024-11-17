use anchor_lang::prelude::*;
use anchor_spl::{
    associated_token::AssociatedToken,
    metadata::{
        create_master_edition_v3, create_metadata_accounts_v3,
        mpl_token_metadata::types::{Creator, DataV2},
        CreateMasterEditionV3, CreateMetadataAccountsV3, MasterEditionAccount, Metadata,
        MetadataAccount,
    },
    token_2022::{mint_to, MintTo},
    token_interface::{Mint, TokenAccount, TokenInterface},
};

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

    #[account(
        init,
        payer = initial_owner,
        mint::decimals = 0,
        mint::authority = initial_owner
    )]
    pub nft_mint: InterfaceAccount<'info, Mint>,

    #[account(
        init_if_needed,
        payer = initial_owner,
        associated_token::mint = nft_mint,
        associated_token::authority = listing_account,
    )]
    pub nft_vault: InterfaceAccount<'info, TokenAccount>,

    #[account(
        seeds = [
            b"metadata",
            metadata_program.key().as_ref(),
            nft_mint.key().as_ref(),
        ],
        seeds::program = metadata_program.key(),
        bump,
    )]
    pub metadata: Account<'info, MetadataAccount>,
    #[account(
        seeds = [
            b"metadata",
            metadata_program.key().as_ref(),
            nft_mint.key().as_ref(),
            b"edition"
        ],
        seeds::program = metadata_program.key(),
        bump,
    )]
    pub master_edition: Account<'info, MasterEditionAccount>,

    pub metadata_program: Program<'info, Metadata>,
    pub associated_token_program: Program<'info, AssociatedToken>,
    pub system_program: Program<'info, System>,
    pub rent: Sysvar<'info, Rent>,
    pub token_program: Interface<'info, TokenInterface>,
}

impl<'info> NewListing<'info> {
    pub fn create_listing(&mut self, base_price: u64, bumps: &NewListingBumps) -> Result<()> {
        self.listing_account.set_inner(Listing {
            nft_mint: self.nft_mint.key(),
            initial_owner: self.initial_owner.key(),
            base_price,
            bump: bumps.listing_account,
        });

        Ok(())
    }

    pub fn mint_to_vault(
        &mut self,
        nft_name: String,
        nft_symbol: String,
        nft_uri: String,
    ) -> Result<()> {
        let mint_cpi_program = self.token_program.to_account_info();
        let mint_accounts = MintTo {
            mint: self.nft_mint.to_account_info(),
            to: self.nft_vault.to_account_info(),
            authority: self.initial_owner.to_account_info(),
        };
        mint_to(CpiContext::new(mint_cpi_program, mint_accounts), 1)?;

        let metadata_cpi_program = self.metadata_program.to_account_info();
        let metadata_accounts = CreateMetadataAccountsV3 {
            metadata: self.metadata.to_account_info(),
            mint: self.nft_mint.to_account_info(),
            mint_authority: self.initial_owner.to_account_info(),
            payer: self.initial_owner.to_account_info(),
            update_authority: self.initial_owner.to_account_info(),
            system_program: self.system_program.to_account_info(),
            rent: self.rent.to_account_info(),
        };

        let data = DataV2 {
            name: nft_name,
            symbol: nft_symbol,
            uri: nft_uri,
            seller_fee_basis_points: 0,
            creators: Some(vec![Creator {
                address: self.initial_owner.key(),
                verified: true,
                share: 100,
            }]),
            collection: None,
            uses: None,
        };

        create_metadata_accounts_v3(
            CpiContext::new(metadata_cpi_program, metadata_accounts),
            data,
            false,
            true,
            None,
        )?;
        let master_edition_cpi_program = self.metadata_program.to_account_info();
        let master_edition_accounts = CreateMasterEditionV3 {
            edition: self.master_edition.to_account_info(),
            mint: self.nft_mint.to_account_info(),
            update_authority: self.initial_owner.to_account_info(),
            mint_authority: self.initial_owner.to_account_info(),
            payer: self.initial_owner.to_account_info(),
            metadata: self.metadata.to_account_info(),
            token_program: self.token_program.to_account_info(),
            system_program: self.system_program.to_account_info(),
            rent: self.rent.to_account_info(),
        };

        create_master_edition_v3(
            CpiContext::new(master_edition_cpi_program, master_edition_accounts),
            None,
        )?;
        msg!("NFT minted successfully.");

        Ok(())
    }
}
