<script setup>
import { computed, defineEmits } from "vue";

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
  usersCanSelectRows: {
    type: Boolean,
    required: true,
  },
  freezeFirstColumn: {
    type: Boolean,
    required: true,
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

const getCellClass = (index) => {
  if (index > 0) {
    return;
  }

  if (!props.freezeFirstColumn) {
    return;
  }

  return props.usersCanSelectRows ? "fixed-column" : "fixed-selection-column";
};
</script>

<template>
  <tr :class="rowCSSClass">
    <td v-if="props.usersCanSelectRows" class="fixed-selection-column">
      <input
        class="form-check-input"
        type="checkbox"
        :value="rowIdentifier"
        :checked="rowIsSelected"
        :id="`row-${rowIdentifier}`"
        @change="handleCheckboxToggle"
      />
    </td>
    <td v-for="(cell, i) in row.values" :key="i" :class="getCellClass(i)">
      {{ cell.value }}
    </td>
  </tr>
</template>
