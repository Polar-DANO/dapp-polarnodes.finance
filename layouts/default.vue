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
          <span class="text-[16px] text-[#FF0000]"
            >
            The migration from Polar v3 is complete.
            If you lost your node, don't worry, use the option "My NFTs" in the menu "Migrate Node".
            For more information please join the discord:
            https://discord.com/invite/polarnodes
          </span>

          <v-alert
            v-if="displayError"
            v-model="displayError"
            class="alert-component mt-4"
            type="error"
            dismissible
            transition="scale-transition"
          >
            {{ error }}
          </v-alert>
          <div class="hidden md:flex">
            <ConnectionBtn />
          </div>
          <transition name="scale-transition" mode="out-in">
            <Nuxt />
          </transition>
        </v-main>
      </div>
      </v-main>
    </v-app>
  </div>
  </v-app>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import LeftSideBar from '~/components/LeftSideBar.vue';

const IF_INCLUDE_ERROR_MSG = {
  'User denied transaction signature': 'You must accept the transaction',
  'Global limit reached': 'Global limit reached',
  'Creation with pending limit reached for user': 'Creation with pending limit reached for user',
  'Balance too low for creation': 'Balance too low for creation',
  'Not enough pending': 'You don\'t have enough pending rewards to create a new node',
  'contract call run out of gas': 'Contract call run out of gas, the transaction was reverted',
};

@Component({
  components: { LeftSideBar },
  transition: 'scale-transition',
})
export default class Default extends Vue {
  private error: string | false = false;

  get displayError () {
    return this.error !== false;
  }

  set displayError (display: boolean) {
    if (!display) {
      this.error = false;
    }
  }

  errorCaptured (error: any) {
    console.error(error);
    if (error?.code === -32603 && error?.data?.message) {
      this.error = error.data.message;
    } else {
      this.error = error?.message ?? error;
    }

    const replaced = Object.entries(IF_INCLUDE_ERROR_MSG).find(([key]) => (this.error as string).toLowerCase().includes(key.toLowerCase()));
    if (replaced) {
      this.error = replaced[1];
    }

    return false;
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
