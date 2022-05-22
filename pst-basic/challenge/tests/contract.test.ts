import fs from 'fs';
import ArLocal from 'arlocal';
import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import path from 'path';
import { addFunds, mineBlock } from '../utils/_helpers';
import { PstContract, PstState, SmartWeave } from 'redstone-smartweave';

describe('Testing the Profit Sharing Token', () => {
  // ~~ Declare all variables ~~
  let contractSrc: string;

  let wallet: JWKInterface;
  let walletAddress: string;

  let initialState: PstState;

  let arweave: Arweave;
  let arlocal: ArLocal;
  let smartweave: SmartWeave;
  let pst: PstContract;
  beforeAll(async () => {
    // ~~ Set up ArLocal and instantiate Arweave ~~
    // ~~ Initialize 'LoggerFactory' ~~
    // ~~ Set up SmartWeave ~~
    // ~~ Generate wallet and add funds ~~
    // ~~ Read contract source and initial state files ~~
    // ~~ Update initial state ~~
    // ~~ Deploy contract ~~
    // ~~ Connect to the pst contract ~~
    // ~~ Mine block ~~
  });

  afterAll(async () => {
    // ~~ Stop ArLocal ~~
  });

  it('should read pst state and balance data', async () => {});

  it('should properly mint tokens', async () => {});

  it('should properly transfer tokens', async () => {});
});
