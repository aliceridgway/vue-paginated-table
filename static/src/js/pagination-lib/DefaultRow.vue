<script setup>
const props = defineProps({
  row: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <tr>
    <td v-for="(cell, i) in row" :key="i">
      {{ cell }}
    </td>
  </tr>
</template>
