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
import { Component, Vue } from 'nuxt-property-decorator'
import LeftSideBar from '~/components/LeftSideBar.vue'

const IF_INCLUDE_ERROR_MSG = {
  'User denied transaction signature': 'You must accept the transaction',
  'Global limit reached': 'Global limit reached',
  'Creation with pending limit reached for user': 'Creation with pending limit reached for user',
  'Balance too low for creation': 'Balance too low for creation',
  'Not enough pending': 'You don\'t have enough pending rewards to create a new node'
}

@Component({
  components: { LeftSideBar },
  transition: 'scale-transition'
})
export default class Default extends Vue {
  private error: string | false = false

  get displayError () {
    return this.error !== false
  }

  set displayError (display: boolean) {
    if (!display) {
      this.error = false
    }
  }

  errorCaptured (error) {
    if (error?.code === -32603) {
      this.error = error.data.message
    } else {
      this.error = error?.message ?? error
    }

    const replaced = Object.entries(IF_INCLUDE_ERROR_MSG).find(([key]) => this.error.includes(key))

    if (replaced) {
      this.error = replaced[1]
    }

    return false
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
