<script setup>
import { computed, ref } from "vue";

const emit = defineEmits(["allRowsSelectorUpdated"]);

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
});

const handleAllRowsSelectorChange = (event) => {
  emit("allRowsSelectorUpdated", event.target.checked);
};
</script>

<template>
  <thead>
    <tr>
      <th>
        <input
          class="form-check-input"
          type="checkbox"
          value="all-rows-selector"
          :checked="props.allRowsSelected"
          @change="handleAllRowsSelectorChange"
        />
      </th>
      <th v-for="(heading, index) in headings" :key="index">
        {{ heading.display }}
      </th>
    </tr>
  </thead>
</template>
