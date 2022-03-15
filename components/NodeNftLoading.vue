<template>
  <div class="node-nft" @click="onSelectNode">
    <v-skeleton-loader
      type="article, list-item-two-line"
      dark
    ></v-skeleton-loader>
  </div>
</template>

<style scoped>
.node-nft {
  min-width: 180px;
  cursor: pointer;
  text-align: center;
  font-size: 12px;
  height: 242px;
  flex-grow: 1;
  padding: 12px 0;
  border-radius: 14px;
  border: solid 1px #00c6ed;
  background-color: #1E1E1E;
  font-family: WorkSans;
  font-weight: 500;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  color: #fff;
}
</style>
