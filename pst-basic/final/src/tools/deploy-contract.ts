import fs from 'fs';
import path from 'path';
import Arweave from 'arweave';
import { ArWallet, SmartWeaveNodeFactory } from 'redstone-smartweave';
import jwk from '../../.secrets/jwk.json';
import { PstState } from '@/contracts/types/types';

let contractSrc: string;

(async () => {
  // Loading contract source and initial state from files
  contractSrc = fs.readFileSync(path.join(__dirname, '../../dist/contract.js'), 'utf8');
  const stateFromFile: PstState = JSON.parse(
    fs.readFileSync(path.join(__dirname, '../../dist/contracts/initial-state.json'), 'utf8')
  );

  // Arweave and SmartWeave initialization
  const arweave = Arweave.init({
    host: 'arweave.net',
    port: 443,
    protocol: 'https',
  });
  const smartweave = SmartWeaveNodeFactory.memCached(arweave);

  // Deploying contract
  console.log('Deployment started');
  const contractTxId = await smartweave.createContract.deploy(
    {
      wallet: jwk as ArWallet,
      initState: JSON.stringify(stateFromFile),
      src: contractSrc,
    },
    true
  );

  console.log('Deployment completed: ' + contractTxId);

  const contract = smartweave.pst(contractTxId).connect(jwk);
  const mintId = await contract.bundleInteraction({
    function: 'mint',
    qty: 100,
  });

  console.log('Mint completed', mintId);
})();
