<template>
  <tr class="table-heading">
    <th>
      <div class="flex jcsb aic">
        <span>Food</span>
        <span class="portion italic gray" v-if="props.servings">(Servings)</span>
      </div>
    </th>
    <th><span class="no-wrap">P (g)</span></th>
    <th><span class="no-wrap">C (g)</span></th>
    <th><span class="no-wrap">F (g)</span></th>
    <th>Cals</th>
  </tr>
</template>

<script setup>
const props = defineProps({
  servings: Boolean,
});
</script>
