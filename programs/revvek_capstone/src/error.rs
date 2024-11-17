use anchor_lang::prelude::*;

#[error_code]
pub enum CustomErrors {
    #[msg("Base Price must be greater than 0")]
    InvalidBasePrice,

    #[msg("Bid Amount must be greater or equal to the base price")]
    InvalidBidAmount,
}
