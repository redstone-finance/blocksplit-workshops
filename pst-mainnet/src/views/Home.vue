<template>
  <div class="enterprise flex-column flex-md-row">
    <b-modal
      id="modal-1"
      title="No wallet detected"
      size="lg"
      hide-footer
      hide-header-close
      no-close-on-backdrop
    >
      To use this app you need to have your wallet installed. Check out
      <a href="https://www.arconnect.io/" target="_blank">ArConnect.</a>
    </b-modal>
    <img
      class="enterprise-img d-none d-md-block"
      src="../assets/enterprise.png"
    />

    <router-link to="transfer">Enter the Enterprise</router-link>
    <img
      class="enterprise-img d-block d-md-none pt-3 pt-md-0"
      src="../assets/enterprise.png"
    />
  </div>
</template>

<script>
export default {
  async mounted() {
    setTimeout(async () => {
      await this.connectToArconnect();
    }, 1000);
  },
  methods: {
    async connectToArconnect() {
      if (!window.arweaveWallet) {
        this.$bvModal.show("modal-1");
        return;
      }
      try {
        window.arweaveWallet.connect([
          "ACCESS_ADDRESS",
          "ACCESS_ALL_ADDRESSES",
          "SIGN_TRANSACTION",
        ]);
      } catch (e) {
        console.log(e);
      }
    },
  },
};
</script>
<style lang="scss">
.enterprise {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 20px;
}

.enterprise-img {
  height: 100px;
  width: auto;
}

.modal-body {
  padding: 2rem !important;
}
</style>
