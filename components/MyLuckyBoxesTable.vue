<template>
  <div class="overflow-x-auto w-full mb-6">
    <div class="flex flex-col">
      <div class="flex justify-between bg-[#00C6ED]  rounded-t-lg p-[16px] min-w-[420px]">
        <div class="text-white text-[16px]">
          My Lucky Boxes
        </div>
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
          <td>
            <button
              class="text-center text-white font-normal text-[16px] border-solid border-[#00C6ED] border-[2px] hover:bg-[#00C6ED] rounded-[14px] px-[20px] my-[10px] ml-[16px]"
              @click="()=>{}"
            >
              <div>Reveal</div>
            </button>
            <button
              class="text-center text-white font-normal text-[16px] border-solid border-[#00C6ED] border-[2px] hover:bg-[#00C6ED] rounded-[14px] px-[20px] my-[10px] ml-[16px]"
              @click="()=>{}"
            >
              <div>List on Marketplace</div>
            </button>
          </td>
        </tr>
      </table>
    </div>
  </div>
</template>
<script lang="ts">
import { Component, Vue } from 'nuxt-property-decorator'

@Component({
  props: {
    items: Array
  }
})
export default class NodeTable extends Vue {
}
</script>
