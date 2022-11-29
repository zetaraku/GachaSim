<template>
  <div class="max-w-4xl text-gray-900 divide-y divide-gray-200 px-8 mx-auto">
    <div class="max-w-xl md:max-w-4xl py-12">
      <h2 class="text-2xl font-bold">GachaSim / 抽卡模擬器</h2>
      <p class="text-lg text-gray-500 mt-2">珍惜荷包，理性抽卡。</p>
      <div class="grid grid-cols-1 md:grid-cols-2 items-start gap-6 mt-8">
        <div>
          <label>單抽機率 (%)</label>
          <input type="number" min="0" max="100" step="0.01" v-model.number="p100">
        </div>
        <div>
          <label>中位數 (次) / 平均數 (次)</label>
          <input type="text" :value="`${nMedian.toFixed(2)} / ${nAverage.toFixed(2)}`" disabled>
        </div>
        <div>
          <label>連抽次數 (次)</label>
          <input type="number" min="0" step="1" v-model.number="n">
        </div>
        <div>
          <label>連抽確率 (%)</label>
          <input type="text" :value="(pSumTo(n) * 100).toFixed(2)" disabled>
        </div>
        <div>
          <label>試抽 (直到抽中)</label>
          <button
            class="text-white" :class="!isDrawing ? 'bg-blue-600' : 'bg-red-500'"
            @click="tryDraw" :disabled="isDrawing"
          >
            <span v-if="!isDrawing">開始</span>
            <span v-else>抽取中...</span>
          </button>
        </div>
        <div>
          <label>花費次數 (次)</label>
          <input type="text" :value="nTrial" disabled>
        </div>
      </div>
    </div>
    <div class="font-bold py-6">
      <p>
        <a href="https://github.com/zetaraku/GachaSim">GachaSim</a>
        is made by
        <a href="https://github.com/zetaraku" class="ml-0.5 mr-1">
          <img class="inline w-4 h-4" alt="GitHub Logo" src="/github.svg">
          zetaraku
        </a>
      </p>
      <p>
        Licensed under the
        <a href="https://en.wikipedia.org/wiki/MIT_License">MIT License</a>.
      </p>
    </div>
  </div>
</template>

<script>
import * as Vue from 'vue';
import { useGtag } from 'vue-gtag-next';

export default {
  setup() {
    let gtag = useGtag();

    let p100 = Vue.ref(5.00);
    let n = Vue.ref(10);
    let isDrawing = Vue.ref(false);
    let nTrial = Vue.ref(0);

    let pSumTo = (n) => 1 - (1 - p.value) ** n;
    let nQuantileOf = (q) => Math.log(1 - q) / Math.log(1 - p.value);
    let estimatedDraw = () => Math.ceil(nQuantileOf(1 - Math.random()));

    let p = Vue.computed(() => p100.value / 100);
    let nMedian = Vue.computed(() => nQuantileOf(0.5));
    let nAverage = Vue.computed(() => 1 / p.value);

    let tryDraw = async () => {
      gtag.event('tryDrawClicked');
      isDrawing.value = true;
      nTrial.value = 0;
      for (let i = 1; true; i++) {
        await new Promise((resolve) => setTimeout(resolve, 10));
        nTrial.value = i;
        if (Math.random() < p.value) break;
      }
      isDrawing.value = false;
    };

    return {
      p100, n, isDrawing, nTrial,
      pSumTo, nQuantileOf,
      p, nMedian, nAverage,
      tryDraw,
    }
  }
}
</script>

<style lang="postcss" scoped>
a {
  @apply text-blue-600 hover:text-blue-700;
}
label {
  @apply text-gray-700;
}
input, button {
  @apply block w-full mt-1;
}
input[disabled] {
  @apply bg-gray-300;
}
button {
  height: 41.8px;
}
</style>
