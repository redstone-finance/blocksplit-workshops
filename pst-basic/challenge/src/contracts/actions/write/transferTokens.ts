// ~~ Write the `transferTokens` interaction for your contract ~~

import { ContractResult, PstAction, PstState } from "@/contracts/types/types";


declare const ContractError;

export const transferTokens = async (
  state: PstState,
  { caller, input: { target, qty } }: PstAction
): Promise<ContractResult> => {
}

