<template>
  <div class="flex justify-center fixed bg-[#000000da] top-0 right-0 bottom-0 left-0 py-[9%]">
    <div class="bg-[#17171B] text-center rounded-[20px] p-[20px] h-max">
      <div class="flex flex-wrap">
        <div class="flex flex-col rounded-[20px] border-solid border-[#00C6ED] border-[4px] p-[20px] w-[100%] md:max-w-[300px] mt-[10px] md:mt-[0px]">
          <img class="ml-[5px] rounded-t-[30px]  rounded-b-[15px]" :src="require('../assets/img/nft/3.jpg')" alt=""/>
          <div class="flex flex-wrap mt-[10px] items-center px-[30px]" @click="$emit(cardModal)">
            <div class="w-[41px] h-[41px] rounded-[50%] border-solid border-[#00C6ED] border-[2px] text-[#00C6ED] text-center font-bold p-[6px]">9</div>
            <span class="text-[16px] font-bold ml-[5px] text-[#00C6ED]">POLAR</span>
            <span class="text-[16px] font-bold ml-[5px] text-[#00C6ED]">#3556</span>
          </div>
          <div class="grid md:grid-cols-3 gap-4 mt-[30px] ">
            <span class="rounded-[16px] border-[#00C6ED] border-[1px] text-[14px] text-[white]">COLOR</span>
            <span class="rounded-[16px] border-[#00C6ED] border-[1px] text-[14px] text-[white]">EYES</span>
            <span class="rounded-[16px] border-[#00C6ED] border-[1px] text-[14px] text-[white]">HEAD</span>
            <span class="rounded-[16px] border-[#00C6ED] border-[1px] text-[14px] text-[white]">BODY</span>
            <span class="rounded-[16px] border-[#00C6ED] border-[1px] text-[14px] text-[white]">MOUTH</span>
          </div>
        </div>
        <div class="flex flex-col px-[10px] ml-[20px] h-[50%] gap-3">
          <span class="text-[16px] text-[#00C6ED] font-bold text-left mt-[10px] md:mt-[0px]">ATTRIBUTES</span>
          <div class="flex ml-[10px] gap-4 mt-[10px]">
            <span class="text-[16px] text-[#00C6ED] font-bold">TIER</span>
            <span class="text-[16px] text-[white] font-bold">COMMON</span>
          </div>
          <div class="flex ml-[10px] gap-4">
            <span class="text-[16px] text-[#00C6ED] font-bold">COLOR</span>
            <span class="text-[16px] text-[white] font-bold">CREEN AND YELLOW</span>
          </div>
          <div class="flex ml-[10px] gap-4">
            <span class="text-[16px] text-[#00C6ED] font-bold">EYES</span>
            <span class="text-[16px] text-[white] font-bold">ORIGINAL</span>
          </div>
          <div class="flex ml-[10px] gap-4">
            <span class="text-[16px] text-[#00C6ED] font-bold">HEAD</span>
            <span class="text-[16px] text-[white] font-bold">TIARA</span>
          </div>
          <div class="flex ml-[10px] gap-4">
            <span class="text-[16px] text-[#00C6ED] font-bold">BODY</span>
            <span class="text-[16px] text-[white] font-bold">JEAN SHIRT</span>
          </div>
          <div class="flex ml-[10px] gap-4 ">
            <span class="text-[16px] text-[#00C6ED] font-bold">MOUTH</span>
            <span class="text-[16px] text-[white] font-bold">OPEN</span>
          </div>
          <div class="border-solid border-[#00C6ED] border-[1px] my-[20px]"></div>
          <span class="text-[16px] text-[white] text-left mb-[10px] font-bold">BUY THIS POLAR</span>
          <div class="flex items-center ml-[10px]">
            <img class="mx-[5px] rounded-t-[30px] w-[25px] h-[25px] rounded-b-[15px]" :src="require('../assets/img/logo.svg')" alt=""/>
            <span class="text-[16px] text-[#00C6ED] font-bold mr-[10px]">2.4 POLAR</span>
            <button  class="text-center text-[white] font-normal text-[16px] border-solid border-[#00C6ED] border-[1px] hover:bg-[#00C6ED] rounded-[14px] my-[10px] px-[5px]">
              BUY POLAR       
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="cursor-pointer ml-[-34px]">
      <v-btn class="right-2" icon @click="$emit('closeModal')">
        <v-icon class="text-white">mdi-close</v-icon>
      </v-btn>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'nuxt-property-decorator'

@Component({
  props:{
    dataDetail:Array
  }
})
export default class CardDetailModal extends Vue {

  private cardData=[]

  private created() {
    console.log(this.$props.dataDetail,"22222222")
    this.cardData = this.$props.dataDetail;
  }
}
</script>