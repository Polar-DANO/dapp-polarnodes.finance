import Vue from 'vue'
import Component from 'vue-class-component'

export interface IReactiveFetch {
  // eslint-disable-next-line no-unused-vars
  reactiveFetch: () => Promise<void>
}

@Component({
  watch: {
    isWalletConnected: {
      handler: 'reactiveFetch'
    }
  }
})
export default class WalletReactiveFetch extends Vue {
  [x: string]: any
  protected get isWalletConnected () {
    return this.$store.getters['wallet/isConnected']
  }

  async fetch () {
    if (!this.reactiveFetch) {
      throw new Error('reactiveFetch not defined')
    }

    await this.reactiveFetch()
  }
}
