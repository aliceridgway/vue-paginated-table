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
const end = computed(() => start.value + parseInt(props.limit));
</script>

<template>
  <p class="result-summary">
    Showing {{ start }} to {{ end }} of {{ total }} results
  </p>
</template>

<style scoped>
.result-summary {
  margin: 0;
}
</style>
