<template>
  <div class="overflow-x-auto w-full">
    <div v-if="items && items.length > 0" class="flex flex-col mb-6">
      <div class="flex justify-between bg-[#00C6ED]  rounded-t-lg p-[16px] min-w-[420px]">
        <div class="text-white text-[16px]">
          My Lucky Boxes
        </div>
        <v-btn
          class="tex text-white font-normal text-[16px] border-solid border-[white] border-[2px] hover:bg-[#00C6ED] rounded-[14px] px-[20px]"
          dark
          text
          :loading="isClaimAllBtnLoading"
          :disabled="isClaimAllBtnLoading"
          @click="onAllReveal"
        >
          Reveal All Boxes
        </v-btn>
      </div>
      <table
        class="mx-auto w-[100%] min-w-[420px] rounded-b-lg bg-[#17171B]"
      >
        <thead>
          <tr>
            <th class="w-[14%] pt-[12px] pl-[16px] text-left text-[12px]">
              <span class="text-[#00c6ed]">ID</span>
            </th>
            <th class="w-[14%] pt-[12px] pl-[16px] text-left text-[12px]">
              <span class="text-[#00c6ed]">Tier</span>
            </th>
            <th class="w-[20%] pt-[12px] pl-[16px] text-left text-[12px]" />
          </tr>
        </thead>
        <tbody class="divide-white/10 divide-y-[1px] px-[16px]" />
        <tr v-for="(lb, i) in items" :key="`${lb.type}-${i}`">
          <td
            class="py-[12px] pl-[16px] text-left text-[12px] text-white"
          >
            #{{ lb.tokenId.toNumber() }}
          </td>
          <td
            class="py-[12px] pl-[16px] text-left text-[12px] text-white"
          >
            {{ lb.type }}
          </td>
          <td class="text-right pr-4">
            <v-btn
              dark
              text
              small
              :loading="isRevealButtonLoading[i]"
              :disabled="isRevealButtonLoading[i]"
              class="text-none text-center text-white font-normal text-[16px] border-solid border-[#00C6ED] border-[2px] hover:bg-[#00C6ED] rounded-[14px] px-[20px] my-[10px] ml-[16px]"
              @click="onReveal(lb, i)"
            >
              <div>Reveal</div>
            </v-btn>
            <button
              v-if="canSell(lb)"
              class="text-center text-white font-normal text-[16px] border-solid border-[#00C6ED] border-[2px] hover:bg-[#00C6ED] rounded-[14px] px-[20px] my-[10px] ml-[16px]"
              @click="onList(lb.tokenId)"
            >
              <div>List</div>
            </button>
          </td>
        </tr>
      </table>
    </div>
    <iframe
      v-if="video"
      :src="video"
      frameborder="0"
      width="100%"
      height="100%"
      allowfullscreen
      style="width: 100vw; height: 100vh; position: fixed; top: 0; left: 0; z-index: 999"
    />
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator';
import { LuckyBox } from '~/models/luckybox';
import { LUCKYBOX_VIDEO_BY_TYPE } from '~/models/constants';

@Component({
  props: {
    items: Array as () => LuckyBox[],
  },
})
export default class NodeTable extends Vue {
  public video: string | null = null;
  public isRevealButtonLoading: boolean[] = [];

  created () {
    this.isRevealButtonLoading = this.$props.items.map(() => false);
  }

  async onReveal (luckyBox: LuckyBox, index: number) {
    const { isRevealButtonLoading } = this;
    const { tokenId, type } = luckyBox;
    let error = false;
    isRevealButtonLoading[index] = true;
    this.isRevealButtonLoading = [...isRevealButtonLoading];

    try {
      await this.$store.dispatch('luckyboxes/reveal', [tokenId]);
    } catch (_err) {
      error = true;
    }
    isRevealButtonLoading[index] = false;
    this.isRevealButtonLoading = [...isRevealButtonLoading];

    if (!error) {
      this.video = LUCKYBOX_VIDEO_BY_TYPE[type];
      setTimeout(() => {
        this.onVideoEnd();
      }, 9000);
    }
  }

  onVideoEnd () {
    this.video = null;
    this.$emit('scroll-to-table');
  }

  async onAllReveal () {
    const tokenIds:any = [];
    this.$props.items.map((item: LuckyBox) => tokenIds.push(item.tokenId));
    await this.$store.dispatch('luckyboxes/reveal', tokenIds);
  }

  onList (tokenId: LuckyBox['tokenId']) {
    this.$router.push(`/luckybox/list/${tokenId._hex}`);
  }

  canSell (item: LuckyBox) {
    return item.attribute !== '';
  }
}
</script>
