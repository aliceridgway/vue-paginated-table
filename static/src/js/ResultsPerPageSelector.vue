<script setup>

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
  <select
    id="results-per-page-select"
    class="form-select"
    :value="selected"
    :aria-label="label"
    @change="$emit('results-per-page-selection-changed')"
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
</template>
