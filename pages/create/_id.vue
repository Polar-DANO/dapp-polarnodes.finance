<template>
  <div
    class="node-card flex flex-col mx-auto md:mx-[64px] mt-[30px] md:mt-[123px]"
  >
    <div class="node-card__header">
      Create {{ nodeNftName }} Mountain NFT 🗻️
    </div>
    <div class="mt-8 mb-16 mx-16">
      <div class="node-card__subtitle">
        Create a Mountain NFT with $POLAR tokens to earn lifetime high-yield
        token rewards!
      </div>
      <VRow justify="space-between" class="mt-8">
        <VCol col="12" sm="12" md="6">
          <img
            src="https://images.pexels.com/photos/5011647/pexels-photo-5011647.jpeg"
            class="node-image"
          />
        </VCol>
        <VCol col="12" sm="12" md="6">
          <div class="text-center">
            <div class="node-card__outlined pa-5">Earn 0.45 $POLAR per day</div>
            <div class="node-card__content inline-block my-5">
              <VRow
                v-for="db in dataBlocks"
                :key="db.key"
                justify="center"
                class="my-1 ml-0 node-card__data-block"
              >
                <VCol md="auto" class="py-2 px-6 node-card__data-block__blue">
                  {{ db.key }}
                </VCol>
                <VCol class="pa-1 text-center"
                  >{{ db.value }} {{ db.unit }}</VCol
                >
              </VRow>

              <div class="mt-6 mb-1 d-flex justify-center items-center">
                <VBtn small rounded color="#00c6ed" dark @click="onRemove">
                  -
                </VBtn>
                <div class="mx-auto">{{ quantity }}</div>
                <VBtn small rounded color="#00c6ed" dark @click="onAdd">
                  +
                </VBtn>
              </div>
            </div>
            <VBtn class="node-card__outlined node-card__button pa-2" dark text>
              Create
            </VBtn>
          </div>
        </VCol>
      </VRow>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from "nuxt-property-decorator";
import { NodeNftNames } from "~/models/types";

const URL_TO_NAME = {
  fuji: NodeNftNames.Fuji,
  "mont-blanc": NodeNftNames.MontBlanc,
  kilimanjaro: NodeNftNames.Kilimanjaro,
  ushuaia: NodeNftNames.Ushuaia,
  everest: NodeNftNames.Everest,
};

@Component({})
export default class Create extends Vue {
  public nodeNftName: NodeNftNames;
  public quantity = 1;
  public dataBlocks = [
    { key: "Cost:", value: 30, unit: "$POLAR" },
    { key: "ROI / day:", value: 1.5, unit: "%" },
    { key: "Claim Tax:", value: 1, unit: "%" },
  ];

  private created() {
    const nodeNftName = URL_TO_NAME[this.$route.params.id];

    if (nodeNftName) {
      this.nodeNftName = nodeNftName;
    } else {
      this.$router.push("/nodes");
    }
  }

  public onRemove() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }

  public onAdd() {
    this.quantity++;
  }
}
</script>

<style scoped>
.node-image {
  width: 100%;
  border-radius: 14px;
}

.node-card {
  width: 90%;
  max-width: 980px;
  border-radius: 14px;
  border: solid 2px #00c6ed;
  background-color: #17171b;
  font-stretch: normal;
  font-style: normal;
  line-height: normal;
  letter-spacing: normal;
  text-align: left;
  color: #fff;
}

.node-card__header {
  height: 60px;
  border-radius: 10px 10px 0px 0px;
  padding: 16px;
  background-color: #00c6ed;
  font-family: WorkSans;
  font-size: 24px;
  font-weight: 600;
}

.node-card__subtitle {
  font-family: WorkSans;
  font-size: 16px;
  font-weight: 500;
}

.node-card__button {
  text-transform: none !important;
}
.node-card__outlined {
  width: 100%;
  border-radius: 14px;
  border: solid 2px #00c6ed;
  font-size: 16px;
  font-weight: 600;
  background-color: rgba(0, 198, 237, 0);
}

.node-card__content {
  width: 200px;
}

.node-card__data-block {
  width: 100%;
  height: 32px;
  border-radius: 14px;
  border: solid 2px #00c6ed;
  background-color: rgba(0, 198, 237, 0);
}

.node-card__data-block__blue {
  background-color: #00c6ed;
  height: 30px;
  font-size: 14px;
  border-radius: 10px 0px 0px 10px;
}
</style>
