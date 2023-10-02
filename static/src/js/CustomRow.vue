<script setup>
import { ref, computed, defineEmits, onMounted } from "vue";

const emit = defineEmits(["row-selection-toggled"]);

const props = defineProps({
  row: {
    type: Array,
    required: true,
  },
});

const isSelected = ref(false);
const rowIdentifier = computed(() => props.row[0].id);
const rowCSSClass = computed(() =>
  isSelected.value
    ? "paginated-table__row table-active paginated-table__row--selected"
    : "paginated-table__row",
);

const handleCheckboxToggle = (event) => {
  emit("row-selection-toggled", rowIdentifier.value, isSelected.value);
};

// onMounted(() => console.log("Custom row mounted."))
</script>

<template>
  <tr :class="rowCSSClass">
    <td>
      <input
        class="form-check-input"
        type="checkbox"
        :value="rowIdentifier"
        v-model="isSelected"
        :id="`row-${rowIdentifier}`"
        @change="handleCheckboxToggle"
      />
    </td>
    <td v-for="(cell, i) in row" :key="i">
      <a v-if="cell.key == 'url'" class="button" :href="cell.value"
        >View on Wikipedia</a
      >
      <span v-else>{{ cell.value }}</span>
    </td>
  </tr>
</template>
