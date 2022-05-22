// ~~ Put all the interactions from '../actions/` together to write the final handle function which will be exported
// from the contract source. ~~

import { balance } from './actions/read/balance';
import { mintTokens } from './actions/write/mintTokens';
import { transferTokens } from './actions/write/transferTokens';
import { ContractResult, PstAction, PstResult, PstState } from './types/types';

declare const ContractError;

export async function handle(state: PstState, action: PstAction): Promise<ContractResult> {}
