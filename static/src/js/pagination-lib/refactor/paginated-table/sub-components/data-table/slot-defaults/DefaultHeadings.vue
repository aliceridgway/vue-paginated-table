<script setup>
import { computed } from "vue";
import SortIcon from "../sub-components/SortIcon.vue";

const emit = defineEmits(["allRowsSelectorUpdated", "sortToggled"]);

const props = defineProps({
  headings: {
    type: Array,
    required: true,
  },
  usersCanSelectRows: {
    type: Boolean,
    required: true,
  },
  freezeFirstColumn: {
    type: Boolean,
    required: true,
  },
  allRowsSelected: {
    type: Boolean,
    required: true,
  },
  sortableColumns: {
    type: Array,
    required: true,
  },
  sortedColumn: {
    type: String,
    required: false,
    default: null,
  },
  sortAscending: {
    type: Boolean,
    required: false,
    default: true,
  },
});

// SELECTION
const handleAllRowsSelectorChange = (event) => {
  emit("allRowsSelectorUpdated", event.target.checked);
};

// COSMETIC

const getAllRowSelectorClass = () => {
  const baseAllRowSelectorClass = "paginated_table__select-all";

  if (props.freezeFirstColumn) {
    return `${baseAllRowSelectorClass} fixed-selection-column`;
  }

  return baseAllRowSelectorClass;
};

const getHeadingClass = (key, i) => {
  const baseHeadingClass = `paginated_table__heading__${key}`;

  if (i > 0 || !props.freezeFirstColumn) {
    return baseHeadingClass;
  }

  const fixedColumnClass = props.usersCanSelectRows
    ? "fixed-column"
    : "fixed-selectable-column";

  return `${baseHeadingClass} ${fixedColumnClass}`;
};

const getSpanClass = (key) => {
  return props.sortableColumns.includes(key)
    ? "sortable-column column-heading"
    : "column-heading";
};

// SORTING
const toggleSort = (event) => {
  const key = event.target.id;

  if (!props.sortableColumns.includes(key)) {
    return;
  }
  // if the key has changed, use the current value of the prop
  const sortAscending =
    key === props.sortedColumn ? !props.sortAscending : true;

  emit("sortToggled", key, sortAscending);
};
</script>

<template>
  <thead>
    <tr>
      <th :class="getAllRowSelectorClass()" v-if="props.usersCanSelectRows">
        <input
          class="form-check-input"
          type="checkbox"
          value="all-rows-selector"
          :checked="props.allRowsSelected"
          @change="handleAllRowsSelectorChange"
        />
      </th>
      <th
        v-for="(heading, i) in headings"
        :key="heading.key"
        :class="getHeadingClass(heading.key, i)"
      >
        <span
          :class="getSpanClass(heading.key)"
          :id="heading.key"
          @click="toggleSort"
          >{{ heading.display }}</span
        >
        <SortIcon
          v-if="sortableColumns.includes(heading.key)"
          :active="heading.key === props.sortedColumn"
          :ascending="props.sortAscending"
        />
      </th>
    </tr>
  </thead>
</template>

<style>
.sortable-column {
  text-decoration: none;
}

/* CSS for elements with the class "sortable-column" when hovered */
.sortable-column:hover {
  text-decoration: underline; /* Underline text on hover */
  cursor: pointer;
}

.paginated_table__select-all {
  width: 50px;
}
.paginated_table__heading {
  min-width: fit-content;
}
</style>
