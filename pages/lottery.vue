<template>
  <div class="flex flex-col md:mx-[164px] mx-[10%] mt-[30px] md:mt-[84px] text-white">
    <div class="text-[24px] text-white">
      Lottery 🃏
    </div>
    <v-data-table
      dark
      disable-sort
      :loading="draws.length === 0"
      :headers="tableHeader"
      :items="draws"
      :items-per-page="5"
      class="elevation-1 mt-8"
    >
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.id="{ item }">
        #{{ item.id }}
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.options="{ item }">
        <div>
          <v-chip v-if="item.withTokens" x-small label color="primary" class="ma-1">
            Tokens
          </v-chip>
          <v-chip v-if="item.withPending" x-small label color="secondary" class="ma-1">
            Pending
          </v-chip>
          <v-chip v-if="item.withBurning" x-small label color="error" class="ma-1">
            Burning
          </v-chip>
        </div>
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.price="{ item }">
        {{ item.price }} $POLAR
      </template>
      <!-- eslint-disable-next-line vue/valid-v-slot -->
      <template #item.executed="{ item }">
        <v-btn
          :disabled="item.executed"
          class="text-none"
          color="primary"
          small
          @click="onOpenDialog(item)"
        >
          Play
        </v-btn>
      </template>
    </v-data-table>

    <PlayLotteryDialog
      v-if="isDialogOpen"
      :draw="currentDraw"
      @play="onPlay"
      @close="onCloseDialog"
    />
  </div>
</template>

<script lang="ts">
import { Component } from 'nuxt-property-decorator';
import { Contract, utils } from 'ethers';
import WalletReactiveFetch, { IReactiveFetch } from '~/mixins/wallet-reactive-fetch';

export type Draw = {
  id: number;
  description: string;
  price: number;
  winnersNb: number;
  participantsNb: number;
  myTickets: number;
  value: number;
  iStart: number;
  to: string;
  executed: boolean;
  withTokens: boolean;
  withPending: boolean;
  withBurning: boolean;
  participants: string[];
  winners: string[];
};

export enum BuyOption {
  Tokens = 'tokens',
  Pending = 'pending',
  Burning = 'burning'
}

@Component({})
export default class Market extends WalletReactiveFetch implements IReactiveFetch {
  public tableHeader = [
    { width: '50px', text: 'ID', value: 'id' },
    { width: '200px', text: 'Prize', value: 'description' },
    { width: '100px', text: 'Participants Nb', value: 'participantsNb' },
    { width: '100px', text: 'My Tickets Nb', value: 'myTickets' },
    { width: '100px', text: 'Price', value: 'price' },
    { width: '100px', text: 'Remaining Winners', value: 'winnersNb' },
    { width: '100px', text: 'Buy with', value: 'options' },
    { width: '100px', value: 'executed' },
  ];

  public draws: Draw[] = [];
  public currentDraw: Draw | null = null;
  public isDialogOpen: boolean = false;

  private lottery: Contract;
  private interval: any;

  constructor () {
    super();
    const { $contracts } = this;

    this.lottery = $contracts!.lottery;
  }

  async mounted () {
    const { lottery, translateDraw } = this;
    const drawsSize = await lottery.getDrawsSize();

    for (let i = drawsSize.toNumber() - 1; i >= 0; i--) {
      const rawDraw = await lottery.draws(i);
      const draw = await translateDraw(i, rawDraw);

      this.draws.push(draw);
    }

    this.interval = setInterval(this.reloadLottery, 1000);
  }

  destroyed () {
    clearInterval(this.interval);
  }

  onOpenDialog (draw: Draw) {
    this.isDialogOpen = true;
    this.currentDraw = draw;
  }

  onCloseDialog () {
    this.isDialogOpen = false;
    this.currentDraw = null;
  }

  async translateDraw (id: number, raw: any): Promise<Draw> {
    const { getParticipantsSize, getMyTicketsSize } = this;

    return {
      id,
      description: raw.description,
      price: parseFloat(utils.formatEther(raw.price)),
      winnersNb: raw.winnersNb.toNumber(),
      participantsNb: await getParticipantsSize(id),
      myTickets: await getMyTicketsSize(id),
      executed: raw.executed,
      value: raw.value.toNumber(),
      iStart: raw.iStart.toNumber(),
      to: raw.to,
      withTokens: raw.withTokens,
      withPending: raw.withPending,
      withBurning: raw.withBurning,
      participants: raw.participants,
      winners: raw.winners,
    };
  };

  async getParticipantsSize (id: number): Promise<number> {
    const { lottery } = this;

    const rawNumber = await lottery.getParticipantsSize(id);
    return rawNumber.toNumber();
  }

  async getMyTicketsSize (id: number): Promise<number> {
    const { lottery, walletAddress } = this;

    const rawNumber = await lottery.userNbTickets(id, walletAddress);
    return rawNumber.toNumber();
  }

  buyTicketsWithTokens (
    id: number,
    tokenAddress: string,
    inputUserWallet: string | null,
    ticketAmountToBuy: number,
    userCode: string | null
  ) {
    const { lottery, walletAddress } = this;

    lottery.buyTicketsWithTokens(
      id,
      tokenAddress,
      inputUserWallet || walletAddress,
      ticketAmountToBuy,
      userCode
    );
  }

  buyTicketsWithPending (
    id: number,
    tokenOut: string,
    nameFrom: string[],
    tokenIdsToClaim: number[][],
    ticketAmountToBuy: number
  ) {
    const { lottery } = this;

    lottery.buyTicketsWithPending(
      id,
      tokenOut,
      nameFrom,
      tokenIdsToClaim,
      ticketAmountToBuy
    );
  }

  buyTicketsWithBurning (
    id: number,
    tokenOut: string,
    nameFrom: string[],
    tokenIdsToClaim: number[][],
    ticketAmountToBuy: number
  ) {
    const { lottery } = this;

    lottery.buyTicketsWithBurning(
      id,
      tokenOut,
      nameFrom,
      tokenIdsToClaim,
      ticketAmountToBuy
    );
  }

  async reloadLottery () {
    const { lottery, translateDraw } = this;
    const drawsSize = await lottery.getDrawsSize();
    const draws: Draw[] = [];

    for (let i = drawsSize.toNumber() - 1; i >= 0; i--) {
      const rawDraw = await lottery.draws(i);
      const draw = await translateDraw(i, rawDraw);

      draws.push(draw);
    }

    this.draws = draws;
  }

  async onPlay (
    buyOption: BuyOption,
    ticketsNb: number,
    options: Record<string, string & string[] & number[][]>
  ) {
    const { currentDraw, walletAddress } = this;

    if (!currentDraw) {
      return;
    }
    switch (buyOption) {
      case BuyOption.Tokens:
        await this.buyTicketsWithTokens(
          currentDraw.id,
          options.tokenContractAddress,
          options.inputUserWallet || walletAddress,
          ticketsNb,
          options.userCode || ""
        );
        break;
      case BuyOption.Pending:
        await this.buyTicketsWithPending(
          currentDraw.id,
          options.tokenOut,
          options.nameFrom,
          options.tokenIdsToClaim,
          ticketsNb
        );
        break;
      case BuyOption.Burning:
        await this.buyTicketsWithBurning(
          currentDraw.id,
          options.tokenOut,
          options.nameFrom,
          options.tokenIdsToClaim,
          ticketsNb
        );
        break;
    }
    this.onCloseDialog();
  }

  async reactiveFetch () {
    if (this.isLoggedIn) {
      await this.$store.dispatch('tokens/fetchGotToken');
      await this.$store.dispatch('nft/myNFTsByCreationDateDesc');
      await {
          myNFTs: await (async () => {
            await this.$store.dispatch('nodes/loadNodeTypes');
            await this.$store.dispatch('nft/loadMyNFTs');
          })(),
        };
     
    }
  }

  get walletAddress () {
    return this.$store.getters['wallet/address'];
  }
}
</script>