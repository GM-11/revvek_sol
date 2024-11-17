pub mod constants;
pub mod error;
pub mod instructions;
pub mod state;

use anchor_lang::prelude::*;

pub use constants::*;
pub use instructions::*;
pub use state::*;

declare_id!("Drh7RDvzgHewJt66SSkRfec3fL6FMm2WSVs8uJzVeJDK");

#[program]
pub mod revvek_capstone {
    use super::*;
}
