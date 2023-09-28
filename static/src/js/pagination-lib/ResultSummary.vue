<script setup>
import { computed } from "vue";

const props = defineProps({
  offset: {
    type: Number,
    required: true,
  },
  limit: {
    type: Number,
    required: true,
  },
  total: {
    type: Number,
    required: true,
  },
});

const start = computed(() => props.offset + 1);
const end = computed(() => Math.min((start.value + parseInt(props.limit)), props.total));
</script>

<template>
  <p v-if="props.total > 0" class="result-summary">
    Showing {{ start }} to {{ end }} of {{ total }} results
  </p>
  <p v-if="props.total == 0">No results found.</p>
</template>

<style scoped>
.result-summary {
  margin: 0;
}
</style>
