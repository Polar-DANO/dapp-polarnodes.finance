<template>
  <div class="bg-black">
    <v-app>
      <div class="bg-[#17171b] h-full">
        <LeftSideBar />

        <v-app-bar-nav-icon
          class="text-[#FFFFFF] md:hidden"
          @click="$root.$refs.draw.Draw()"
        />

        <v-main class="md:py-[28px] md:mr-[28px] md:ml-[0px] h-full">
          <!-- <span class="text-[16px] text-[#FF0000]"
            >If you lost your node, don't worry, use the "migrate my old nodes"
            button. For more information please join the discord:
            https://discord.com/invite/polarnodes
          </span> -->

          <div class="flex justify-end items-center">
            <v-alert
              v-if="alertBuyOk"
              class="alert-component mt-4"
              type="info"
              color="green"
              dismissible
              transition="scale-transition"
            >
              The transaction should have gone well, wait few minutes
            </v-alert>
            <v-alert
              v-if="alertWalletConnectOk"
              class="alert-component mt-4"
              type="info"
              color="green"
              dismissible
              transition="scale-transition"
            >
              The Wallet Connected
            </v-alert>
            <v-alert
              v-if="noProvider"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              You must install MetaMask
            </v-alert>
            <v-alert
              v-if="acceptMetamask"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              You must accept the connection with MetaMask
            </v-alert>
            <v-alert
              v-if="wrongNetwork"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              You must connect on the Avalanche Network
            </v-alert>
            <v-alert
              v-if="alertMustWLsale"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              You must buy with the Whitelist Sale
            </v-alert>
            <v-alert
              v-if="alertDontHaveNFT"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              You dont have the NFT Key in your wallet
            </v-alert>
            <v-alert
              v-if="alertMustSign"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              You must accept the transaction
            </v-alert>
            <v-alert
              v-if="alertAMount"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              The amount must be a number less than the Individual Allocation
            </v-alert>
            <v-alert
              v-if="alertExceedsBalance"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              Transfer amount exceeds balance
            </v-alert>
            <v-alert
              v-if="alertPurchase"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              You have already allocated this amount
            </v-alert>
            <v-alert
              v-if="alertNodesName"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              Name not available
            </v-alert>
            <v-alert
              v-if="alertnoLiquidity"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              Insufficient Pending
            </v-alert>
            <v-alert
              v-if="alertNeedBalance"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              You need more tokens to purchase
            </v-alert>

            <v-alert
              v-if="alertOverflow"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              You cannot allocate less than the previous amount
            </v-alert>
            <v-alert
              v-if="alertNodesBlacklist"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              Blacklisted address
            </v-alert>
            <v-alert
              v-if="alertresurrectionNode"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              This number must not exceed the number of nodes you have left to
              retrieve. Enter small numbers to avoid exceeding the gas limit.
            </v-alert>
            <v-alert
              v-if="alertBuyNodesChars"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              This name must be beetween 3 and 32 characters
            </v-alert>

            <v-alert
              v-if="alertAlreadyClaim"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              Tokens already claimed
            </v-alert>

            <v-alert
              v-if="alertNoOwner"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              No Node Owner
            </v-alert>

            <v-alert
              v-if="alertMaxReached"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              Global limit reached
            </v-alert>

            <v-alert
              v-if="alertUserMaxReached"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              Creation with pending limit reached for user
            </v-alert>

            <v-alert
              v-if="alertLevelUpReached"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              Level up limit reached for user
            </v-alert>

            <v-alert
              v-if="alertNoOneLevelup"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              No one can level up this type of node
            </v-alert>

            <v-alert
              v-if="alertNoTarget"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              Target doesn't exist
            </v-alert>

            <v-alert
              v-if="alertNoName"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              Name doesn't exist
            </v-alert>

            <v-alert
              v-if="alertNoLevelDown"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              Cannot level down
            </v-alert>

            <v-alert
              v-if="alertNoEnoughSent"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              Not enough sent
            </v-alert>
            <v-alert
              v-if="alertNoClaim"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              Nothing to claim
            </v-alert>
            <v-alert
              v-if="alertUserReject"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              MetaMask Tx Signature: User denied transaction signature.
            </v-alert>
            <v-alert
              v-if="alertTooManyRequest"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              Too many nodes requested
            </v-alert>
            <v-alert
              v-if="alertNotAuthorized"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              Not authorized yet
            </v-alert>

            <v-alert
              v-if="alertNotFutur"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              futur and rewardsPool cannot create node
            </v-alert>

            <v-alert
              v-if="alertMaxAlreadyReached"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              Max already reached
            </v-alert>

            <v-alert
              v-if="alertOtherError"
              class="alert-component mt-4"
              type="info"
              color="red"
              dismissible
              transition="scale-transition"
            >
              An error occured
            </v-alert>
            <div class="hidden md:flex">
              <ConnectionBtn />
            </div>
          </div>
          <transition name="scale-transition" mode="out-in">
            <Nuxt />
          </transition>
        </v-main>
      </div>
    </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'
import LeftSideBar from '~/components/LeftSideBar.vue'

@Component({
  components: { LeftSideBar },
  transition: 'scale-transition'
})
export default class Default extends Vue {
  public wrongNetwork = false
  public alertMustWLsale = false
  public alertMustSign = false
  public alertAMount = false
  public alertExceedsBalance = false
  public alertNeedBalance = false
  public alertBuyOk = false
  public alertPurchase = false
  public alertOverflow = false
  public alertAlreadyClaim = false
  public alertDontHaveNFT = false
  public alertBuyNodesChars = false
  public alertNodesBlacklist = false
  public alertNodesName = false
  public alertnoLiquidity = false
  public alertresurrectionNode = false
  public alertWalletConnectOk = false
  public alertNoOwner = false
  public alertNoTarget = false
  public alertNoName = false
  public alertNoLevelDown = false
  public alertNoEnoughSent = false
  public alertNoClaim = false
  public alertUserReject = false
  public alertTooManyRequest = false
  public noProvider = false
  public acceptMetamask = false
  public alertMaxReached = false
  public alertUserMaxReached = false
  public alertLevelUpReached = false
  public alertNoOneLevelup = false
  public alertNotAuthorized = false
  public alertMaxAlreadyReached = false
  public alertNotFutur = false
  public alertOtherError = false

  created () {
    (this.$root.$refs.alert as Default) = this
  }

  public async BuyOk (): Promise<void> {
    await this.sleep(6000)
    this.alertBuyOk = true
    await this.sleep(4000)
    this.alertBuyOk = false
  }

  public async WalletConnectOk (): Promise<void> {
    this.alertWalletConnectOk = true
    await this.sleep(3000)
    this.alertWalletConnectOk = false
  }

  public async NoProvider (): Promise<void> {
    this.noProvider = true
    await this.sleep(10000)
    this.noProvider = false
  }

  public async WrongNetwork (): Promise<void> {
    this.wrongNetwork = true
    await this.sleep(1500)
    this.wrongNetwork = false
  }

  public sleep (ms: any): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(resolve, ms)
    })
  }

  public async MustWLsale (): Promise<void> {
    this.alertMustWLsale = true
    await this.sleep(1500)
    this.alertMustWLsale = false
  }

  public async BuyNodesChars (): Promise<void> {
    this.alertBuyNodesChars = true
    await this.sleep(1500)
    this.alertBuyNodesChars = false
  }

  public async NodesBlacklist (): Promise<void> {
    this.alertNodesBlacklist = true
    await this.sleep(1500)
    this.alertNodesBlacklist = false
  }

  public async NodesName (): Promise<void> {
    this.alertNodesName = true
    await this.sleep(1500)
    this.alertNodesName = false
  }

  public async resurrectionNode (): Promise<void> {
    this.alertresurrectionNode = true
    await this.sleep(10000)
    this.alertresurrectionNode = false
  }

  public async DontHaveNFT (): Promise<void> {
    this.alertDontHaveNFT = true
    await this.sleep(1500)
    this.alertDontHaveNFT = false
  }

  public async AlertAmount (): Promise<void> {
    this.alertAMount = true
    await this.sleep(1500)
    this.alertAMount = false
  }

  public async MustSign (): Promise<void> {
    this.alertMustSign = true
    await this.sleep(1500)
    this.alertMustSign = false
  }

  public async ExceedsBalance (): Promise<void> {
    this.alertExceedsBalance = true
    await this.sleep(1500)
    this.alertExceedsBalance = false
  }

  public async NeedBalance (): Promise<void> {
    this.alertNeedBalance = true
    await this.sleep(6000)
    this.alertNeedBalance = false
  }

  public async noLiquidity (): Promise<void> {
    this.alertnoLiquidity = true
    await this.sleep(3000)
    this.alertnoLiquidity = false
  }

  public async Purchase (): Promise<void> {
    this.alertPurchase = true
    await this.sleep(4000)
    this.alertPurchase = false
  }

  public async Overflow (): Promise<void> {
    this.alertOverflow = true
    await this.sleep(4000)
    this.alertOverflow = false
  }

  public async AlreadyClaim (): Promise<void> {
    this.alertAlreadyClaim = true
    await this.sleep(1500)
    this.alertAlreadyClaim = false
  }

  public async MaxReached (): Promise<void> {
    this.alertMaxReached = true
    await this.sleep(3000)
    this.alertMaxReached = false
  }

  public async UserMaxReached (): Promise<void> {
    this.alertUserMaxReached = true
    await this.sleep(3000)
    this.alertUserMaxReached = false
  }

  public async MaxLimitLevelUp (): Promise<void> {
    this.alertLevelUpReached = true
    await this.sleep(3000)
    this.alertLevelUpReached = false
  }

  public async NoOneLevelUp (): Promise<void> {
    this.alertNoOneLevelup = true
    await this.sleep(3000)
    this.alertNoOneLevelup = false
  }

  public async NoOwner (): Promise<void> {
    this.alertNoOwner = true
    await this.sleep(3000)
    this.alertNoOwner = false
  }

  public async NoTarget (): Promise<void> {
    this.alertNoOwner = true
    await this.sleep(3000)
    this.alertNoOwner = false
  }

  public async NoName (): Promise<void> {
    this.alertNoTarget = true
    await this.sleep(3000)
    this.alertNoTarget = false
  }

  public async NoLevelDown (): Promise<void> {
    this.alertNoLevelDown = true
    await this.sleep(3000)
    this.alertNoLevelDown = false
  }

  public async NoEnoughSent (): Promise<void> {
    this.alertNoEnoughSent = true
    await this.sleep(3000)
    this.alertNoEnoughSent = false
  }

  public async NoClaim (): Promise<void> {
    this.alertNoClaim = true
    await this.sleep(3000)
    this.alertNoClaim = false
  }

  public async UserReject (): Promise<void> {
    this.alertUserReject = true
    await this.sleep(3000)
    this.alertUserReject = false
  }

  public async TooManyRequest (): Promise<void> {
    this.alertTooManyRequest = true
    await this.sleep(3000)
    this.alertTooManyRequest = false
  }

  public async AcceptMetamask (): Promise<void> {
    this.acceptMetamask = true
    await this.sleep(3000)
    this.acceptMetamask = false
  }

  public async NotAuthorized (): Promise<void> {
    this.alertNotAuthorized = true
    await this.sleep(3000)
    this.alertNotAuthorized = false
  }

  public async MaxAlreadyReached (): Promise<void> {
    this.alertMaxAlreadyReached = true
    await this.sleep(3000)
    this.alertMaxAlreadyReached = false
  }

  public async NotFutur (): Promise<void> {
    this.alertNotFutur = true
    await this.sleep(3000)
    this.alertNotFutur = false
  }

  public async OtherError (): Promise<void> {
    this.alertOtherError = true
    await this.sleep(3000)
    this.alertOtherError = false
  }
}
</script>

<style scoped>
.alert-component {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  margin: auto;
  width: 320px;
  z-index: 10;
}
</style>
