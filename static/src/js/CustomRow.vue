<script setup>
import { ref, computed, defineEmits, onMounted } from "vue";

const emit = defineEmits(["row-selection-toggled"]);

const props = defineProps({
  row: {
    type: Object,
    required: true,
  },
  selectedRows: {
    type: Array,
    required: false,
    default: [],
  },
});

const rowIdentifier = computed(() => props.row.id);
const rowIsSelected = computed(() =>
  props.selectedRows.includes(rowIdentifier.value),
);

const rowCSSClass = computed(() =>
  rowIsSelected.value
    ? "paginated-table__row table-active paginated-table__row--selected"
    : "paginated-table__row",
);

const handleCheckboxToggle = (event) => {
  emit("row-selection-toggled", rowIdentifier.value, event.target.checked);
};
</script>

<template>
  <tr :class="rowCSSClass">
    <td>
      <input
        class="form-check-input"
        type="checkbox"
        :value="rowIdentifier"
        :checked="rowIsSelected"
        :id="`row-${rowIdentifier}`"
        @change="handleCheckboxToggle"
      />
    </td>
    <td v-for="(cell, i) in row.values" :key="i">
      <a v-if="cell.key == 'url'" class="button" :href="cell.value"
        >View on Wikipedia</a
      >
      <span v-else>{{ cell.value }}</span>
    </td>
  </tr>
</template>
