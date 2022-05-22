import Arweave from 'arweave';
import { JWKInterface } from 'arweave/node/lib/wallet';
import { PstState } from '../contracts/types/types';
import { LoggerFactory, PstContract, SmartWeave, SmartWeaveNodeFactory } from 'redstone-smartweave';
import fs from 'fs';
import path from 'path';

let contractSrc: string;

let wallet: JWKInterface;
let walletAddress: string;

let initialState: PstState;

let arweave: Arweave;
let smartweave: SmartWeave;

(async () => {
  // ~~ Initialize Arweave ~~
  // ~~ Initialize `LoggerFactory` ~~
  // ~~ Initialize SmartWeave ~~
  // ~~ Generate wallet and add some funds ~~
  // ~~ Read contract source and initial state files ~~
  // ~~ Override contract's owner address with the generated wallet address ~~
  // ~~ Deploy contract ~~
  // ~~ Log contract id to the console ~~
})();
