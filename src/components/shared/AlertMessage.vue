<template>
  <div v-if="text" class="alert flex aifs">
    <ExclamationCircleIcon style="width: 20px" />
    <p class="ml-1" v-html="text"></p>
  </div>
</template>

<script setup>
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  text: String,
});
</script>
