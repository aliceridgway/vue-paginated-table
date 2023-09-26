<script setup>
import { defineEmits } from "vue";
const emit = defineEmits(["resultsPerPageSelectionChanged"]);

const props = defineProps({
  resultsPerPageOptions: {
    type: Array,
    required: true,
  },
  selected: {
    type: Number,
    required: true,
  },
  label: {
    type: String,
    required: false,
    default: "Results Per Page",
  },
});

if (!props.resultsPerPageOptions.includes(props.selected)) {
  throw Error(
    `Invalid value for 'selected' ${props.selected}. resultsPerPageOptions ${props.resultsPerPageOptions} must include the selected value.`,
  );
}
</script>

<template>
  <div class="results-per-page-selector">
    <select
    id="results-per-page-select"
    class="form-select"
    :value="selected"
    :aria-label="label"
    @change="$emit('results-per-page-selection-changed', $event.target.value)"
    >
      <option
        v-for="(option, index) in resultsPerPageOptions"
        :value="option"
        :key="index"
      >
        {{ option }}
      </option>
    </select>
    <label for="results-per-page-select">
      {{ label }}
    </label>
  </div>

</template>

<style scoped>
.results-per-page-selector {
  display: flex;
  align-items: center;
}

#results-per-page-select {
  width: fit-content;
  margin-right: 0.5rem;
}
</style>