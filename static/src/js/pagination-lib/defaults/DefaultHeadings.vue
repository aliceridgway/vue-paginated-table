<script setup>
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
  allRowsSelected: {
    type: Boolean,
    required: true,
  },
  sortableColumns: {
    type: Array,
    required: true
  },
  sortedColumn: {
    type: String,
    required: false,
    default: null
  },
  sortAscending: {
    type: Boolean,
    required: false,
    default: true
  }
});

const handleAllRowsSelectorChange = (event) => {
  emit("allRowsSelectorUpdated", event.target.checked);
};

const getCSSClass = (key) => {
  return props.sortableColumns.includes(key) ? "sortable-column column-heading" : "column-heading"
}

const toggleSort = (event) => {

  const key = event.target.id

  if (!(props.sortableColumns.includes(key))){
    return
  }
  // if the key has changed, use the current value of the prop
  const sortAscending = key === props.sortedColumn ? !props.sortAscending : true

  emit("sortToggled", key, sortAscending)
}

</script>

<template>
  <thead>
    <tr>
      <th v-if="props.usersCanSelectRows">
        <input
          class="form-check-input"
          type="checkbox"
          value="all-rows-selector"
          :checked="props.allRowsSelected"
          @change="handleAllRowsSelectorChange"
        />
      </th>
      <th
       v-for="heading in headings" 
       :key="heading.key"
       class="paginated_table__heading"
      >
        <span :class="getCSSClass(heading.key)" :id="heading.key" @click="toggleSort" >{{ heading.display }}</span>
        <SortIcon 
          v-if="sortableColumns.includes(heading.key)" 
          :active="heading.key===props.sortedColumn"
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
</style>