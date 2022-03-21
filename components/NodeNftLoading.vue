<template>
  <div class="node-nft">
    <v-skeleton-loader type="article, list-item-two-line" dark />
  </div>
</template>

<style scoped>
@media screen and (min-width: 1024px) {
  .node-nft {
    flex-grow: 0;
  }
}

@media screen and (max-width: 1023px) {
  .node-nft {
    flex-grow: 1;
  }
}

@media screen and (max-width: 425px) {
  .node-nft {
    margin-bottom: 8px;
  }
}

.node-nft {
  min-width: 160px;
  cursor: pointer;
  text-align: center;
  font-size: 12px;
  height: 242px;
  padding: 12px 0;
  border-radius: 14px;
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
</style>
