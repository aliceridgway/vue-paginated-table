<script setup>
const props = defineProps({
  headings: {
    type: Array,
    required: true,
  },
});
</script>

<template>
  <thead>
    <tr>
      <th v-for="(heading, index) in headings" :key="index">
        {{ heading.display }}
      </th>
    </tr>
  </thead>
</template>
