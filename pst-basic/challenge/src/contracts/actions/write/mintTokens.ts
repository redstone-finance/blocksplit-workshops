// ~~ Write the `mintTokens` interaction for your contract ~~

import { ContractResult, PstAction, PstState } from "@/contracts/types/types";


declare const ContractError;

export const mintTokens = async (
  state: PstState,
  { caller, input: { qty } }: PstAction
): Promise<ContractResult> => {
    // error: qty less than 0
    // error: qty not a number
};
