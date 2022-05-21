const fs = require("fs");
const path = require("path");
const Arweave = require("arweave");
const { SmartWeaveNodeFactory, LoggerFactory } = require("redstone-smartweave");

(async () => {
  // Set up Arweave client
  const arweave = Arweave.init({
    host: "testnet.redstone.tools",
    port: 443,
    protocol: "https",
  });
  const wallet = await arweave.wallets.generate();
  const walletAddress = await arweave.wallets.getAddress(wallet);
  await arweave.api.get(`/mint/${walletAddress}/1000000000000000`);

  const stateFromFile = JSON.parse(
    fs.readFileSync(
      path.join(__dirname, "../contracts/pst/initial-state.json"),
      "utf8"
    )
  );

  const initialState = {
    ...stateFromFile,
    ...{
      owner: walletAddress,
      balances: {
        ...stateFromFile.balances,
        [walletAddress]: 555669,
      },
    },
  };
  const mine = () => arweave.api.get("mine");

  // Set up SmartWeave client
  LoggerFactory.INST.logLevel("error");
  const smartweave = SmartWeaveNodeFactory.memCached(arweave);

  // Deploying contract
  const contractSrc = fs.readFileSync(
    path.join(__dirname, "../contracts/pst/contract.js"),
    "utf8"
  );

  const contractTxId = await smartweave.createContract.deploy({
    wallet,
    initState: JSON.stringify(initialState),
    src: contractSrc,
  });
  await mine();
  console.log(contractTxId);
})();
