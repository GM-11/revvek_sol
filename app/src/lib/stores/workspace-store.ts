import { writable } from "svelte/store";
import type { Program, Provider, web3 } from "@coral-xyz/anchor";
import type { Connection, Keypair } from "@solana/web3.js";
import { type RevvekCapstone } from "$lib/idl/revvek";

export type WorkSpace = {
  baseAccount?: Keypair;
  connection: Connection;
  provider?: Provider;
  program?: Program<RevvekCapstone>;
  systemProgram?: typeof web3.SystemProgram;
  network: string;
};

export const workspaceStore = writable<WorkSpace>(undefined);
