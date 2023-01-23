<template>
  <p v-if="text" class="alert flex aifs">
    <ExclamationCircleIcon style="width: 20px" />
    <span class="ml-1" v-html="text"></span>
  </p>
</template>

<script setup>
import { ExclamationCircleIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  text: String,
});
</script>
