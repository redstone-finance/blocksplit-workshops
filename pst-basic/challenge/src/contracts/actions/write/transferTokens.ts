// ~~ Write the `transferTokens` interaction for your contract ~~

import { ContractResult, PstAction, PstState } from "@/contracts/types/types";


declare const ContractError;

export const transferTokens = async (
  state: PstState,
  { caller, input: { target, qty } }: PstAction
): Promise<ContractResult> => {
  // error: qty not a number

  // error: target is not specified

  // error: caller is the target or qty is less or equal than 0

  // error: caller balance is not defined

  // error: caller balance not high enough to send tokens
}

