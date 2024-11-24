// import { Program, web3 } from "@coral-xyz/anchor";
// import { clusterApiUrl, Connection, PublicKey } from "@solana/web3.js";
// import idl from "./idl.json";
// // import { RevvekCapstone } from "./type";
// // const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

import { web3 } from "@coral-xyz/anchor";

export const mplID = new web3.PublicKey(
  "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
);

// export const program = new Program(JSON.parse(JSON.stringify(idl)));

// export type RevvekCapstone = {
//   address: "7n3fAHRanf5Fxmqj3x2V9sxmDT4zsew5yNyaCq3FES61";
//   metadata: {
//     name: "revvekCapstone";
//     version: "0.1.0";
//     spec: "0.1.0";
//     description: "Created with Anchor";
//   };
//   instructions: [
//     {
//       name: "acceptBid";
//       discriminator: [196, 191, 1, 229, 144, 172, 122, 227];
//       accounts: [
//         {
//           name: "initialOwner";
//           writable: true;
//           signer: true;
//         },
//         {
//           name: "listingAccount";
//           writable: true;
//         },
//         {
//           name: "bidAccount";
//           writable: true;
//         },
//         {
//           name: "bidder";
//           writable: true;
//         },
//         {
//           name: "nftVault";
//           writable: true;
//           pda: {
//             seeds: [
//               {
//                 kind: "account";
//                 path: "listingAccount";
//               },
//               {
//                 kind: "const";
//                 value: [
//                   6,
//                   221,
//                   246,
//                   225,
//                   215,
//                   101,
//                   161,
//                   147,
//                   217,
//                   203,
//                   225,
//                   70,
//                   206,
//                   235,
//                   121,
//                   172,
//                   28,
//                   180,
//                   133,
//                   237,
//                   95,
//                   91,
//                   55,
//                   145,
//                   58,
//                   140,
//                   245,
//                   133,
//                   126,
//                   255,
//                   0,
//                   169
//                 ];
//               },
//               {
//                 kind: "account";
//                 path: "nftMint";
//               }
//             ];
//             program: {
//               kind: "const";
//               value: [
//                 140,
//                 151,
//                 37,
//                 143,
//                 78,
//                 36,
//                 137,
//                 241,
//                 187,
//                 61,
//                 16,
//                 41,
//                 20,
//                 142,
//                 13,
//                 131,
//                 11,
//                 90,
//                 19,
//                 153,
//                 218,
//                 255,
//                 16,
//                 132,
//                 4,
//                 142,
//                 123,
//                 216,
//                 219,
//                 233,
//                 248,
//                 89
//               ];
//             };
//           };
//         },
//         {
//           name: "nftMint";
//           writable: true;
//           relations: ["bidAccount"];
//         },
//         {
//           name: "bidderAta";
//           writable: true;
//           pda: {
//             seeds: [
//               {
//                 kind: "account";
//                 path: "bidder";
//               },
//               {
//                 kind: "const";
//                 value: [
//                   6,
//                   221,
//                   246,
//                   225,
//                   215,
//                   101,
//                   161,
//                   147,
//                   217,
//                   203,
//                   225,
//                   70,
//                   206,
//                   235,
//                   121,
//                   172,
//                   28,
//                   180,
//                   133,
//                   237,
//                   95,
//                   91,
//                   55,
//                   145,
//                   58,
//                   140,
//                   245,
//                   133,
//                   126,
//                   255,
//                   0,
//                   169
//                 ];
//               },
//               {
//                 kind: "account";
//                 path: "nftMint";
//               }
//             ];
//             program: {
//               kind: "const";
//               value: [
//                 140,
//                 151,
//                 37,
//                 143,
//                 78,
//                 36,
//                 137,
//                 241,
//                 187,
//                 61,
//                 16,
//                 41,
//                 20,
//                 142,
//                 13,
//                 131,
//                 11,
//                 90,
//                 19,
//                 153,
//                 218,
//                 255,
//                 16,
//                 132,
//                 4,
//                 142,
//                 123,
//                 216,
//                 219,
//                 233,
//                 248,
//                 89
//               ];
//             };
//           };
//         },
//         {
//           name: "systemProgram";
//           address: "11111111111111111111111111111111";
//         },
//         {
//           name: "associatedTokenProgram";
//           address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
//         },
//         {
//           name: "tokenProgram";
//           address: "TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA";
//         }
//       ];
//       args: [];
//     },
//     {
//       name: "bidForVehicle";
//       discriminator: [18, 165, 229, 13, 177, 218, 243, 125];
//       accounts: [
//         {
//           name: "bidder";
//           writable: true;
//           signer: true;
//         },
//         {
//           name: "bidAccount";
//           writable: true;
//           pda: {
//             seeds: [
//               {
//                 kind: "const";
//                 value: [98, 105, 100];
//               },
//               {
//                 kind: "account";
//                 path: "listingAccount";
//               },
//               {
//                 kind: "account";
//                 path: "bidder";
//               }
//             ];
//           };
//         },
//         {
//           name: "listingAccount";
//           writable: true;
//         },
//         {
//           name: "systemProgram";
//           address: "11111111111111111111111111111111";
//         }
//       ];
//       args: [
//         {
//           name: "bidAmount";
//           type: "u64";
//         }
//       ];
//     },
//     {
//       name: "newListing";
//       discriminator: [39, 51, 193, 78, 212, 140, 53, 22];
//       accounts: [
//         {
//           name: "initialOwner";
//           writable: true;
//           signer: true;
//         },
//         {
//           name: "listingAccount";
//           writable: true;
//           pda: {
//             seeds: [
//               {
//                 kind: "const";
//                 value: [108, 105, 115, 116, 105, 110, 103];
//               },
//               {
//                 kind: "account";
//                 path: "initialOwner";
//               },
//               {
//                 kind: "account";
//                 path: "nftMint";
//               }
//             ];
//           };
//         },
//         {
//           name: "nftMint";
//           writable: true;
//           signer: true;
//         },
//         {
//           name: "nftVault";
//           writable: true;
//           pda: {
//             seeds: [
//               {
//                 kind: "account";
//                 path: "listingAccount";
//               },
//               {
//                 kind: "const";
//                 value: [
//                   6,
//                   221,
//                   246,
//                   225,
//                   215,
//                   101,
//                   161,
//                   147,
//                   217,
//                   203,
//                   225,
//                   70,
//                   206,
//                   235,
//                   121,
//                   172,
//                   28,
//                   180,
//                   133,
//                   237,
//                   95,
//                   91,
//                   55,
//                   145,
//                   58,
//                   140,
//                   245,
//                   133,
//                   126,
//                   255,
//                   0,
//                   169
//                 ];
//               },
//               {
//                 kind: "account";
//                 path: "nftMint";
//               }
//             ];
//             program: {
//               kind: "const";
//               value: [
//                 140,
//                 151,
//                 37,
//                 143,
//                 78,
//                 36,
//                 137,
//                 241,
//                 187,
//                 61,
//                 16,
//                 41,
//                 20,
//                 142,
//                 13,
//                 131,
//                 11,
//                 90,
//                 19,
//                 153,
//                 218,
//                 255,
//                 16,
//                 132,
//                 4,
//                 142,
//                 123,
//                 216,
//                 219,
//                 233,
//                 248,
//                 89
//               ];
//             };
//           };
//         },
//         {
//           name: "metadata";
//           writable: true;
//         },
//         {
//           name: "masterEdition";
//           writable: true;
//         },
//         {
//           name: "metadataProgram";
//           address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
//         },
//         {
//           name: "associatedTokenProgram";
//           address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
//         },
//         {
//           name: "systemProgram";
//           address: "11111111111111111111111111111111";
//         },
//         {
//           name: "rent";
//           address: "SysvarRent111111111111111111111111111111111";
//         },
//         {
//           name: "tokenProgram";
//         }
//       ];
//       args: [
//         {
//           name: "basePrice";
//           type: "u64";
//         },
//         {
//           name: "nftName";
//           type: "string";
//         },
//         {
//           name: "nftSymbol";
//           type: "string";
//         },
//         {
//           name: "nftUri";
//           type: "string";
//         }
//       ];
//     },
//     {
//       name: "relist";
//       discriminator: [67, 122, 80, 87, 12, 20, 216, 169];
//       accounts: [
//         {
//           name: "initialOwner";
//           writable: true;
//           signer: true;
//         },
//         {
//           name: "initialOwnerAta";
//           writable: true;
//           pda: {
//             seeds: [
//               {
//                 kind: "account";
//                 path: "initialOwner";
//               },
//               {
//                 kind: "const";
//                 value: [
//                   6,
//                   221,
//                   246,
//                   225,
//                   215,
//                   101,
//                   161,
//                   147,
//                   217,
//                   203,
//                   225,
//                   70,
//                   206,
//                   235,
//                   121,
//                   172,
//                   28,
//                   180,
//                   133,
//                   237,
//                   95,
//                   91,
//                   55,
//                   145,
//                   58,
//                   140,
//                   245,
//                   133,
//                   126,
//                   255,
//                   0,
//                   169
//                 ];
//               },
//               {
//                 kind: "account";
//                 path: "nftMint";
//               }
//             ];
//             program: {
//               kind: "const";
//               value: [
//                 140,
//                 151,
//                 37,
//                 143,
//                 78,
//                 36,
//                 137,
//                 241,
//                 187,
//                 61,
//                 16,
//                 41,
//                 20,
//                 142,
//                 13,
//                 131,
//                 11,
//                 90,
//                 19,
//                 153,
//                 218,
//                 255,
//                 16,
//                 132,
//                 4,
//                 142,
//                 123,
//                 216,
//                 219,
//                 233,
//                 248,
//                 89
//               ];
//             };
//           };
//         },
//         {
//           name: "listingAccount";
//           writable: true;
//           pda: {
//             seeds: [
//               {
//                 kind: "const";
//                 value: [108, 105, 115, 116, 105, 110, 103];
//               },
//               {
//                 kind: "account";
//                 path: "initialOwner";
//               },
//               {
//                 kind: "account";
//                 path: "nftMint";
//               }
//             ];
//           };
//         },
//         {
//           name: "metadata";
//           writable: true;
//           pda: {
//             seeds: [
//               {
//                 kind: "const";
//                 value: [109, 101, 116, 97, 100, 97, 116, 97];
//               },
//               {
//                 kind: "account";
//                 path: "metadataProgram";
//               },
//               {
//                 kind: "account";
//                 path: "nftMint";
//               }
//             ];
//           };
//         },
//         {
//           name: "masterEdition";
//           writable: true;
//           pda: {
//             seeds: [
//               {
//                 kind: "const";
//                 value: [109, 101, 116, 97, 100, 97, 116, 97];
//               },
//               {
//                 kind: "account";
//                 path: "metadataProgram";
//               },
//               {
//                 kind: "account";
//                 path: "nftMint";
//               },
//               {
//                 kind: "const";
//                 value: [101, 100, 105, 116, 105, 111, 110];
//               }
//             ];
//           };
//         },
//         {
//           name: "nftVault";
//           writable: true;
//           pda: {
//             seeds: [
//               {
//                 kind: "account";
//                 path: "listingAccount";
//               },
//               {
//                 kind: "const";
//                 value: [
//                   6,
//                   221,
//                   246,
//                   225,
//                   215,
//                   101,
//                   161,
//                   147,
//                   217,
//                   203,
//                   225,
//                   70,
//                   206,
//                   235,
//                   121,
//                   172,
//                   28,
//                   180,
//                   133,
//                   237,
//                   95,
//                   91,
//                   55,
//                   145,
//                   58,
//                   140,
//                   245,
//                   133,
//                   126,
//                   255,
//                   0,
//                   169
//                 ];
//               },
//               {
//                 kind: "account";
//                 path: "nftMint";
//               }
//             ];
//             program: {
//               kind: "const";
//               value: [
//                 140,
//                 151,
//                 37,
//                 143,
//                 78,
//                 36,
//                 137,
//                 241,
//                 187,
//                 61,
//                 16,
//                 41,
//                 20,
//                 142,
//                 13,
//                 131,
//                 11,
//                 90,
//                 19,
//                 153,
//                 218,
//                 255,
//                 16,
//                 132,
//                 4,
//                 142,
//                 123,
//                 216,
//                 219,
//                 233,
//                 248,
//                 89
//               ];
//             };
//           };
//         },
//         {
//           name: "nftMint";
//         },
//         {
//           name: "metadataProgram";
//           address: "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s";
//         },
//         {
//           name: "associatedTokenProgram";
//           address: "ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL";
//         },
//         {
//           name: "systemProgram";
//           address: "11111111111111111111111111111111";
//         },
//         {
//           name: "rent";
//           address: "SysvarRent111111111111111111111111111111111";
//         },
//         {
//           name: "tokenProgram";
//         }
//       ];
//       args: [];
//     }
//   ];
//   accounts: [
//     {
//       name: "bid";
//       discriminator: [143, 246, 48, 245, 42, 145, 180, 88];
//     },
//     {
//       name: "listing";
//       discriminator: [218, 32, 50, 73, 43, 134, 26, 58];
//     }
//   ];
//   errors: [
//     {
//       code: 6000;
//       name: "invalidBasePrice";
//       msg: "Base Price must be greater than 0";
//     },
//     {
//       code: 6001;
//       name: "invalidBidAmount";
//       msg: "Bid Amount must be greater or equal to the base price";
//     }
//   ];
//   types: [
//     {
//       name: "bid";
//       type: {
//         kind: "struct";
//         fields: [
//           {
//             name: "nftMint";
//             type: "pubkey";
//           },
//           {
//             name: "bidder";
//             type: "pubkey";
//           },
//           {
//             name: "basePrice";
//             type: "u64";
//           },
//           {
//             name: "bump";
//             type: "u8";
//           }
//         ];
//       };
//     },
//     {
//       name: "listing";
//       type: {
//         kind: "struct";
//         fields: [
//           {
//             name: "nftMint";
//             type: "pubkey";
//           },
//           {
//             name: "initialOwner";
//             type: "pubkey";
//           },
//           {
//             name: "basePrice";
//             type: "u64";
//           },
//           {
//             name: "bump";
//             type: "u8";
//           }
//         ];
//       };
//     }
//   ];
// };
