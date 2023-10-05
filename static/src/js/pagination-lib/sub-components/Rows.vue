<script setup>
import DefaultRow from "./DefaultRow.vue";
import Overlay from "./Overlay.vue";
import Loading from "./Loading.vue";
import Error from "./Error.vue";

const emit = defineEmits(["rowSelectionsUpdated"]);

const props = defineProps({
  rows: {
    type: Array,
    required: true,
  },
  selectedRows: {
    type: Array,
    required: true,
  },
});

const handleRowSelectionEvent = (rowIdentifier, isSelected) =>
  emit("rowSelectionsUpdated", rowIdentifier, isSelected);
</script>

<template>
  <tbody class="paginated-table__body">
    <slot
      name="rows"
      :rows="rows"
      :selectedRows="selectedRows"
      :handleRowSelectionEvent="handleRowSelectionEvent"
    >
      <DefaultRow
        v-for="row in rows"
        :row="row"
        :key="row.id"
        :selected-rows="selectedRows"
        @row-selection-toggled="handleRowSelectionEvent"
      />
    </slot>

    <Overlay v-if="showLoadingOverlay">
        <slot name="loading">
            <Loading />
        </slot>
    </Overlay>
    <Overlay v-show="errorExists">
    <slot name="error" :errorMessage="props.defaultErrorMessage">
        <Error :error-message="props.defaultErrorMessage" />
    </slot>
    </Overlay>
  </tbody>
</template>
