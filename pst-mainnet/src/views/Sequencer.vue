<template>
  <div class="col-12 col-xl-9 sequencer" :key="userAddress">
    <b-modal id="modal-1" title="No wallet detected" size="lg" hide-footer hide-header-close no-close-on-backdrop>
      To use this app you need to have your wallet installed. Check out
      <a href="https://www.arconnect.io/" target="_blank">ArConnect.</a>
    </b-modal>
    <div>
      <h1 class="text-center">Contract</h1>
      <div class="text-center mb-4">
        <a
          target="_blank"
          :href="`https://scanner.redstone.tools/#/app/contract/${contractId}`"
          class="d-none d-sm-block"
          >{{ contractId }}</a
        >
        <a
          target="_blank"
          :href="`https://scanner.redstone.tools/#/app/contract/${contractId}`"
          class="d-sm-none d-block"
          >{{ contractId | tx }}</a
        >
      </div>
      <div class="d-flex flex-column flex-md-row justify-content-center col-12 mb-3">
        <div class="d-md-flex align-self-center">
          Your address:
          <span class="font-weight-bold d-md-block d-none">{{ userAddress }}</span>
          <span class="font-weight-bold d-block d-md-none">{{ userAddress | tx }}</span>
        </div>
      </div>
      <div class="d-flex flex-column flex-md-row justify-content-center col-12 mb-3">
        <input type="number" placeholder="Quantity" ref="balanceMint" />
        <b-button class="ml-3" variant="outline-primary" @click="mint">Mint</b-button>
        <img
          v-b-tooltip.hover
          title="In order to perform correct transfer address need to own any tokens. You can mint up to 10000000 warps."
          src="../assets/question-tooltip.svg"
          class="tooltip-icon"
        />
      </div>
      <b-tabs content-class="mt-3" class="contract-tabs" :lazy="true">
        <b-tab title="Transfer" active>
          <ul>
            <div class="d-flex border-bottom mb-3">
              <div class="p-2 col-6 font-weight-bold bluetext">Recipient Address</div>
              <div class="p-2 col-2 font-weight-bold bluetext">Balance</div>
            </div>
            <div v-show="!loaded" class="loader">
              <pacman-loader :loading="!loaded" :color="color"></pacman-loader>
            </div>
            <li
              v-for="(balance, index) in balances"
              :key="balance.address"
              class="d-flex flex-wrap flex-md-nowrap py-2"
              v-bind:class="{ owner: balance.active }"
            >
              <div class="p-2 col-6 align-self-center">
                <span class="d-md-block d-none">{{ balance.address }}</span>
                <span class="d-block d-md-none">{{ balance.address | tx }}</span>
              </div>
              <div class="p-2 col-2 font-weight-bold d-flex align-self-center">
                <div>
                  {{ balance.balance }}
                </div>
                <div v-show="balance.text" class="ml-2 align-self-center greentext">
                  {{ balance.text }}
                </div>
                <div v-show="balance.error" class="ml-2 align-self-center redtext">
                  {{ balance.error }}
                </div>
              </div>
              <div class="p-2 p-md-0 align-self-center">
                <b-input-group>
                  <b-form-input
                    v-model="balance.value"
                    :disabled="balance.address == userAddress"
                    type="number"
                    min="1"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button class="ml-2 blue" @click="transfer(balance.address, balance.value, index)"
                      >Transfer</b-button
                    >
                  </b-input-group-append>
                </b-input-group>
              </div>
            </li>
          </ul>
        </b-tab>
        <b-tab title="State" lazy>
          <div class="row d-flex justify-content-center">
            <json-viewer class="col-8" :value="state" :expand-depth="4" sort></json-viewer></div
        ></b-tab>
      </b-tabs>
    </div>
  </div>
</template>

<script>
import Arweave from 'arweave';
import { SmartWeaveWebFactory } from 'redstone-smartweave';

import JsonViewer from 'vue-json-viewer';
import deployedContracts from '../deployed-contracts.json';
import constants from '../constants.json';
import Vue from 'vue';
import PacmanLoader from 'vue-spinner/src/PacmanLoader.vue';
import axios from 'axios';

export default {
  data() {
    return {
      arweave: null,
      contract: null,
      balances: [],
      state: null,
      contractId: deployedContracts.warp,
      userAddress: null,
      loaded: false,
      color: '#5982f1',
      smartweave: null,
    };
  },
  components: { JsonViewer, PacmanLoader },
  async mounted() {
    setTimeout(async () => {
      await this.connectToArconnect();
    }, 1000);
    this.arweave = Arweave.init({
      host: 'arweave.net',
      port: 443,
      protocol: 'https',
    });
    this.smartweave = SmartWeaveWebFactory.memCachedBased(this.arweave).build();
  },
  methods: {
    async connectToArconnect() {
      if (!window.arweaveWallet) {
        this.$bvModal.show('modal-1');
        return;
      }
      await window.arweaveWallet.connect(['ACCESS_ADDRESS', 'ACCESS_ALL_ADDRESSES', 'SIGN_TRANSACTION']);
      this.contract = await this.smartweave.contract(deployedContracts.warp).connect('use_wallet');
      window.addEventListener('walletSwitch', async () => {
        await this.loadBalances();
      });
      await this.loadBalances();
    },
    async transfer(address, qty, idx) {
      let userIdx = this.balances.findIndex((b) => b.address == this.userAddress);
      if (!this.balances[userIdx]) {
        this.$toasted.error('Your balance is not enough to transfer tokens. Please mint some warps first.', {
          duration: 3000,
        });
        return;
      }
      this.$toasted.show('Processing...');
      let oldBalance = this.balances[idx].balance;

      let oldBalanceUser = this.balances[userIdx].balance;
      const bundled = await this.contract.connect('use_wallet').bundleInteraction({
        function: 'transfer',
        target: address,
        qty: parseInt(qty),
      });
      const { data } = await axios.get(`${constants.cache}/cache/state/${deployedContracts.warp}`);
      let newResult = data;
      this.state = newResult;
      if (newResult) {
        this.$toasted.clear();
        this.$toasted.global.success('Processed!');
        this.$toasted.global.close(
          `<div>Interaction id: <a href="https://scanner.redstone.tools/#/app/interaction/${bundled.originalTxId}" target="_blank">${bundled.originalTxId}</a></div>`
        );
      }
      Vue.set(this.balances, idx, {
        address: address,
        balance: newResult.state.balances[address],
        text: null,
        error: null,
      });
      Vue.set(this.balances, userIdx, {
        address: this.userAddress,
        balance: newResult.state.balances[this.userAddress],
        active: true,
        text: null,
        error: null,
      });
      this.balances[userIdx].error = `-${oldBalanceUser - this.balances[userIdx].balance}`;
      setTimeout(() => {
        this.balances[userIdx].error = null;
      }, 2000);
      this.balances[idx].text = `+${this.balances[idx].balance - oldBalance}`;
      setTimeout(() => (this.balances[idx].text = null), 2000);
    },
    async loadBalances() {
      const { data } = await axios.get(`${constants.cache}/cache/state/${deployedContracts.warp}`);
      this.state = data;
      const userAddress = await this.arweave.wallets.jwkToAddress();
      this.userAddress = userAddress;

      const arr = Object.keys(this.state.state.balances).map((key) => [key, this.state.state.balances[key]]);
      const find = arr.find((a) => a[0] == this.userAddress);
      if (find) {
        const user = arr.indexOf(find);
        arr.splice(user, 1);
        arr.unshift(find);
      }

      arr.forEach((b, index) => {
        Vue.set(this.balances, index, {
          address: b[0],
          balance: b[1],
          error: false,
          text: false,
          active: find ? b[0] == this.userAddress : null,
        });
      });
      this.loaded = true;
    },
    async mint() {
      if (!this.$refs.balanceMint.value) {
        return;
      }
      this.$toasted.show('Processing...');
      const bundled = await this.contract.connect('use_wallet').bundleInteraction({
        function: 'mint',
        qty: parseInt(this.$refs.balanceMint.value),
      });
      const { data } = await axios.get(`${constants.cache}/cache/state/${deployedContracts.warp}`);
      const newResult = data;
      if (newResult) {
        this.$toasted.clear();
        this.$toasted.global.success('Processed!');
        this.$toasted.global.close(
          `<div>Interaction id: <a href="https://scanner.redstone.tools/#/app/interaction/${bundled.originalTxId}" target="_blank">${bundled.originalTxId}</a></div>`
        );
      }
      const arr = Object.keys(newResult.state.balances).map((key) => [key, newResult.state.balances[key]]);
      const find = arr.find((a) => a[0] == this.userAddress);
      const user = arr.indexOf(find);
      arr.splice(user, 1);
      arr.unshift(find);
      arr.forEach((b, index) => {
        Vue.set(this.balances, index, {
          address: b[0],
          balance: b[1],
          error: false,
          text: false,
          active: b[0] == this.userAddress,
        });
      });
    },
  },
};
</script>

<style lang="scss">
.blue {
  background-color: #5982f1 !important;
}

.bluetext {
  color: #5982f1 !important;
}
.contract-tabs > .tabs > div:first-of-type {
  height: 44px;
}
.contract-tabs {
  .tab-pane:nth-of-type(2) {
    padding-left: 0;
    padding-right: 0;

    @media (min-width: breakpoint-min(md)) {
      padding-left: 2rem;
      padding-right: 2rem;
    }
  }

  &.nav-tabs > .nav-item {
    flex: 0 0 124px !important;
  }
}
.sequencer {
  padding: 10px;
  margin: 0 auto;
  margin-top: 50px;
}

.nav-tabs {
  flex-wrap: nowrap;
  white-space: nowrap;
  overflow-y: clip;
  overflow-x: scroll;
  background-color: transparent;
}

.nav-item {
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
}

.nav-tabs > .nav-item {
  margin-bottom: 0px;
  flex: 1;
}

.nav-tabs > .nav-item .nav-link.active,
.nav-tabs > .nav-item .nav-link.active:hover,
.nav-tabs > .nav-item .nav-link.active:focus {
  background-color: #fcfcfc;
  color: #233562;
}
p {
  width: 500px;
  max-width: 90vw;
  margin: auto;
  margin-top: 30px;
  text-align: left;
}

.nav-tabs > .nav-item > .nav-link:not(.active) {
  padding: 10px 14px;
  /* height: 36px; */
  background-color: #fafafa;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
  /* position: relative; */
  -webkit-box-shadow: inset 0px -6px 2px -4px #e8e8e8, 5px -5px 6px -2px #e8e8e8;
  box-shadow: inset 0px -6px 2px -4px #e8e8e8, 5px -5px 6px -2px #e8e8e8;
  &:after {
    content: ' ';
    height: 23px;
    border-right: 1px solid #d9d9d9;
    border-top-width: 0;
    position: absolute;
    left: -1px;
    bottom: 7px;
  }
}

.showArrows .nav-tabs {
  margin-left: 30px;
  max-width: calc(100% - 58px);
}

.tabs:not(.showArrows) {
  li:first-of-type > .nav-link {
    border-top-left-radius: 5px;
  }

  li:last-of-type > .nav-link {
    border-top-right-radius: 5px;
  }
}
.nav-tabs {
  &.nav-item + .nav-item {
    margin-left: 0;
  }

  border-bottom: none !important;
  background-color: #f7f7f7;
  border-top-left-radius: 0.5rem;
  border-top-right-radius: 0.5rem;

  > .nav-item {
    margin-bottom: -2px;

    > .nav-link {
      padding: 12px 18px;
      border: none;

      .label {
        margin-bottom: -2px;
      }

      &:hover {
        background-color: transparent;
        color: #424242;
      }
    }

    .nav-link.open {
      &,
      &:hover,
      &:focus {
        background-color: #fff;
        color: #7d7d7d;
      }
    }

    .nav-link.active {
      &,
      &:hover,
      &:focus {
        background-color: white;
        color: #7d7d7d;
        border: none;

        box-shadow: 1px 1px 2px #ccc;
      }
    }
  }
}

.hide-element {
  display: none;
}

.show-element {
  display: block;
}

.visible {
  visibility: visible;
  opacity: 1;
  transition: opacity 0.5s linear;
  font-size: 15px;
  color: #5982f1;
  align-self: center;
}

.hidden {
  visibility: hidden;
  opacity: 0;
  transition: visibility 0s 0.5s, opacity 0.5s linear;
}

.owner {
  background-color: #e8f4f8;
}

.tooltip-icon {
  width: 25px;
  height: 25px;
  transform: scale(0.6);
  margin-top: -2px;
  filter: invert(66%) sepia(0%) saturate(275%) hue-rotate(191deg) brightness(95%) contrast(97%);
  align-self: center;
}
.toasting {
  background-color: #5982f1;
}

.btn-outline-primary {
  border-color: #5982f1 !important;
  color: #5982f1 !important;

  &:hover {
    color: #fff !important;
    background-color: #5982f1 !important;
    border-color: #5982f1 !important;
  }
}

.toasted.toasted-primary {
  transform: translateY(-55px) !important;
  a {
    color: white;
  }
  .action.ripple {
    color: white !important;
  }
}

.toasted.toasted-primary.default {
  transform: translateY(-60px) !important;
  background-color: #e8f4f8;
  color: black;
  font-weight: 500;

  &.toasting {
    background-color: #5dbb63;
    color: white;
    .action.ripple {
      color: white !important;
    }
  }
  .action.ripple {
    color: white !important;
  }
}

.greentext {
  color: #5dbb63;
}

.redtext {
  color: red;
}

.loader {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 30vh;
}
</style>
