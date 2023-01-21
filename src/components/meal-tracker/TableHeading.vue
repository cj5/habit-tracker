<template>
  <tr class="table-heading">
    <td class="flex-jcsb-aic">
      Food
      <span class="portion" v-if="props.servings">(Servings)</span>
    </td>
    <td><span class="no-wrap">P (g)</span></td>
    <td><span class="no-wrap">C (g)</span></td>
    <td><span class="no-wrap">F (g)</span></td>
    <td>Cals</td>
  </tr>
</template>

<script setup>
const props = defineProps({
  servings: Boolean,
});
</script>
