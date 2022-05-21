import Arweave from 'arweave';
import {
  LoggerFactory,
  SmartWeaveWebFactory,
  RedstoneGatewayInteractionsLoader,
  RedstoneGatewayContractDefinitionLoader,
  MemCache,
} from 'redstone-smartweave';
import deployedContracts from './deployed-contracts.json';

// const CACHE_API_URL = 'https://dnmt9ldcqj0gz.cloudfront.net/cache'
// const CACHE_API_URL = 'http://localhost:3000/cache'
// const CACHE_API_URL = 'https://duei9u4otl5h4.cloudfront.net/cache'
// const CACHE_API_URL = 'http://smartweave-cache-express-dev.eu-north-1.elasticbeanstalk.com/cache'
// const CACHE_API_URL = "https://smart-cache.herokuapp.com/cache";

// Set up Arweave client
export const arweave = Arweave.init({
  host: 'arweave.net',
  port: 443,
  protocol: 'https',
});

// Set up SmartWeave client
LoggerFactory.INST.logLevel('debug');

// const contractInteractionsLoader = new CacheableContractInteractionsLoader(
//   new ContractInteractionsLoader(arweave),
//   new RemoteBlockHeightCache("INTERACTIONS", CACHE_API_URL)
// );
// const cacheableStateEvaluator = new CacheableStateEvaluator(
//   arweave,
//   new RemoteBlockHeightCache("STATE", CACHE_API_URL)
// );

const smartweave = SmartWeaveWebFactory.memCachedBased(arweave).build();

export default contract;
