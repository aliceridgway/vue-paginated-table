<script setup>
const props = defineProps({
  headings: {
    type: Array,
    required: true,
  },
  rows: {
    type: Array,
    required: true,
  },
  tableClass: {
    type: String,
    required: false,
    default: "",
  },
});
</script>

<template>
  <table :class="props.tableClass">
    <thead>
      <tr>
        <th v-for="(heading, index) in headings" :key="index">
          {{ heading.display }}
        </th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="(row, index) in rows" :key="index">
        <td v-for="(cell, i) in row" :key="i">
          {{ cell }}
        </td>
      </tr>
    </tbody>
  </table>
</template>
