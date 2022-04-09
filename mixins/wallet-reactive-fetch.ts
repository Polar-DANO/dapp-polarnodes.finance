import Vue from 'vue';
import Component from 'vue-class-component';

export interface IReactiveFetch {
  // eslint-disable-next-line no-unused-vars
  reactiveFetch: () => Promise<any>
}

@Component({
  watch: {
    walletAddress: {
      handler: 'reactiveFetch',
    },
  },
})
export default class WalletReactiveFetch extends Vue {
  [x: string]: any
  protected get isWalletConnected () {
    return this.$store.getters['wallet/isConnected'];
  }

  get walletAddress () {
    return this.$store.getters['wallet/address'];
  }

  async fetch () {
    if (!this.reactiveFetch) {
      throw new Error('reactiveFetch not defined');
    }

    return await this.reactiveFetch();
  }
}
