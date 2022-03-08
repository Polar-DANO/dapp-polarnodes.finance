<template>
  <div class="node-nft">
    <div class="node-nft__title">{{ name }}</div>
    <div class="node-nft__blue-text my-1">
      Earn {{ dailyEarnings }} $POLAR / day
    </div>
    <div class="divider mt-2" />

    <div class="spacer" />

    <div class="divider" />

    <div class="inline-block text-left">
      <div class="mt-2">
        <span class="node-nft__blue-text">Cost: </span>
        {{ cost }} $POLAR
      </div>
      <div class="mt-1">
        <span class="node-nft__blue-text">Claim tax: </span>
        {{ claimTax }}%
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";

@Component({
  props: {
    name: { type: String },
    dailyEarnings: { type: Number },
    cost: { type: Number },
    claimTax: { type: Number },
  },
})
export default class NodeNft extends Vue {}
</script>

<style scoped>
.spacer {
  height: 127px;
}

.divider {
  height: 1px;
  flex-grow: 0;
  background-color: rgba(255, 255, 255, 0.1);
}

.node-nft {
  min-width: 180px;
  cursor: pointer;
  text-align: center;
  font-size: 12px;
  height: 242px;
  flex-grow: 1;
  padding: 12px 0;
  border-radius: 14px;
  box-shadow: 0 0 4px 4px rgba(0, 198, 237, 0.5);
  border: solid 1px #00c6ed;
  background-color: #17171b;
  font-family: WorkSans;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #fff;
}

.node-nft__title {
  font-size: 16px;
}

.node-nft__blue-text {
  color: #00c6ed;
}
</style>
