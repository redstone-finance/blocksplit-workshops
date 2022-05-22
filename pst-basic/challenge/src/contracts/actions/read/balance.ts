// ~~ Write the `balance` interaction for your contract ~~

import { ContractResult, PstAction, PstState } from '@/contracts/types/types';

declare const ContractError;

export const balance = async (state: PstState, { input: { target } }: PstAction): Promise<ContractResult> => {
    // error: target not specified

    // error: target not in balance list
};
