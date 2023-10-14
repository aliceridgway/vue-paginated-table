<script setup>
// VUE
import { ref, onMounted, computed, watch } from "vue";

// DEFAULT COMPONENTS
import DefaultRow from "./defaults/DefaultRow.vue";
import DefaultError from "./defaults/DefaultError.vue";
import DefaultHeadings from "./defaults/DefaultHeadings.vue";
import DefaultResultSummary from "./defaults/DefaultResultSummary.vue";
import DefaultResultsPerPageSelector from "./defaults/DefaultResultsPerPageSelector.vue";
import DefaultProgressBar from "./defaults/DefaultProgressBar.vue";
import DefaultPageSelector from "./defaults/DefaultPageSelector.vue";
import DefaultLoading from "./defaults/DefaultLoading.vue";

// UTILITY COMPONENTS
import Overlay from "./sub-components/Overlay.vue";
import Placeholder from "./sub-components/Placeholder.vue";

// HELPERS
import fetchRows from "./pagination/rows";
import pages from "./pagination/pages";
import rowSelection from "./pagination/rowSelection";

// PROPS
import { paginatedTableProps } from "./props";

const props = defineProps(paginatedTableProps);

// DISPLAY
const errorExists = ref(false);
const showLoadingOverlay = ref(false);
const showProgressBar = ref(false);

const showResultSummary = computed(() =>
  errorExists.value ? false : total.value > 0,
);

// ROWS
const rows = ref([]);
const offset = ref(0);
const total = ref(0);

// RESULTS PER PAGE
const requestedLimit = ref(undefined);

const limit = computed(() =>
  requestedLimit.value ? requestedLimit.value : props.resultsPerPageOptions[0],
);
const updateLimit = (newLimit) => {
  requestedLimit.value = newLimit;
};

watch(limit, async () => {
  updateTable();
});

// PAGES
const requestedPage = ref(1);

const currentPage = computed(() =>
  pages.getCurrentPage(offset.value, limit.value),
);

const totalPages = computed(() =>
  pages.getTotalPages(total.value, limit.value),
);

const updatePage = (newPage) => {
  requestedPage.value = newPage;
  selectedRows.value = [];
};

watch(requestedPage, async () => {
  showLoadingOverlay.value = true;

  setTimeout(updateTable, 1000);
});

// ROW SELECTION
const selectedRows = ref([]);

const allRowsSelected = computed(
  () =>
    rows.value.length > 0 && rows.value.length === selectedRows.value.length,
);

const handleRowSelectionEvent = (rowIdentifier, isSelected) => {
  selectedRows.value = rowSelection.toggleRowSelection(
    rowIdentifier,
    isSelected,
    selectedRows.value,
  );
};

const handleAllRowsSelectorUpdate = (allRowsSelected) => {
  selectedRows.value = allRowsSelected ? rows.value.map((row) => row.id) : [];
};

// FILTERING

const params = computed(() =>
  props.searchParams ? props.searchParams : new URLSearchParams(),
);
const visibleColumns = computed(() =>
  props.headings.filter((heading) => !props.hiddenColumns.includes(heading)),
);

// SORTING

const sortedColumn = ref(null);
const sortAscending = ref(true);

const sortParamsString = computed(() => {
  const direction = sortAscending.value ? "asc" : "desc";
  return `sort=${sortedColumn.value}.${direction}`;
});

const updateSortedColumn = (columnKey, ascending) => {
  console.log(columnKey, ascending);
  sortedColumn.value = columnKey;
  sortAscending.value = ascending;
};

watch(sortParamsString, async () => {
  showLoadingOverlay.value = true;

  setTimeout(updateTable, 1000);
});

// TABLE UPDATES
onMounted(async () => {
  updateTable();
});

const updateTable = async () => {
  showLoadingOverlay.value = true;

  let _rows;
  let _total;
  let _errorExists;

  const nextOffset = pages.getNextOffset(requestedPage.value, limit.value);

  [_total, _rows, _errorExists] = await fetchRows(
    props.sourceURL,
    visibleColumns.value,
    limit.value,
    nextOffset,
    props.totalGetter,
    props.rowsGetter,
    props.rowsPreProcessor,
    props.rowIdentificationKey,
  );

  offset.value = nextOffset;
  rows.value = _rows;
  total.value = _total;
  errorExists.value = _errorExists;

  showLoadingOverlay.value = false;
  showProgressBar.value = false;
};
</script>

<template>
  <div class="paginated-table shadow p-3 mb-5 bg-body rounded">
    <div class="paginated-table__header">
      <slot
        name="results-per-page"
        :resultsPerPageOptions="props.resultsPerPageOptions"
        :limit="limit"
        :updateLimit="updateLimit"
      >
        <DefaultResultsPerPageSelector
          :resultsPerPageOptions="props.resultsPerPageOptions"
          :selected="limit"
          @results-per-page-selection-changed="updateLimit"
        />
      </slot>
    </div>

    <Placeholder class="paginated-table__progress-bar-placeholder">
      <div v-show="showProgressBar">
        <slot name="progress-bar">
          <DefaultProgressBar />
        </slot>
      </div>
    </Placeholder>

    <div class="paginated-table__wrapper">
      <table :class="props.tableClass">
        <slot
          name="headings"
          :visibleColumns="visibleColumns"
          :sortableColumns="props.sortableColumns"
          :hiddenColumns="props.hiddenColumns"
          :usersCanSelectRows="props.usersCanSelectRows"
          :allRowsSelected="allRowsSelected"
          :freezeFirstColumn="props.freezeFirstColumn"
          :handleAllRowsSelectorUpdate="handleAllRowsSelectorUpdate"
        >
          <DefaultHeadings
            :headings="visibleColumns"
            :sortableColumns="props.sortableColumns"
            :usersCanSelectRows="usersCanSelectRows"
            :freezeFirstColumn="props.freezeFirstColumn"
            :allRowsSelected="allRowsSelected"
            :sortedColumn="sortedColumn"
            :sortAscending="sortAscending"
            @all-rows-selector-updated="handleAllRowsSelectorUpdate"
            @sort-toggled="updateSortedColumn"
          />
        </slot>

        <tbody class="paginated-table__body">
          <slot
            name="rows"
            :rows="rows"
            :selectedRows="selectedRows"
            :handleRowSelectionEvent="handleRowSelectionEvent"
            :freezeFirstColumn="props.freezeFirstColumn"
          >
            <DefaultRow
              v-for="row in rows"
              :row="row"
              :key="row.id"
              :selectedRows="selectedRows"
              :freezeFirstColumn="props.freezeFirstColumn"
              :usersCanSelectRows="props.usersCanSelectRows"
              @row-selection-toggled="handleRowSelectionEvent"
            />
          </slot>
          <Overlay v-if="showLoadingOverlay">
            <slot name="loading">
              <DefaultLoading />
            </slot>
          </Overlay>
          <Overlay v-show="errorExists">
            <slot name="error" :errorMessage="props.defaultErrorMessage">
              <DefaultError :error-message="props.defaultErrorMessage" />
            </slot>
          </Overlay>
        </tbody>
      </table>
    </div>

    <div class="paginated-table__footer">
      <Placeholder>
        <div v-if="showResultSummary">
          <slot
            name="result-summary"
            :limit="limit"
            :offset="offset"
            :total="total"
          >
            <DefaultResultSummary
              :limit="limit"
              :offset="offset"
              :total="total"
            />
          </slot>
        </div>
      </Placeholder>

      <slot
        name="page-selector"
        :currentPage="currentPage"
        :totalPages="totalPages"
        :updatePage="updatePage"
      >
        <DefaultPageSelector
          :currentPage="currentPage"
          :totalPages="totalPages"
          @page-number-changed="updatePage"
        />
      </slot>
    </div>
  </div>
</template>

<style>
.paginated-table {
  height: fit-content;
  min-width: 100%;
  padding: 1.5rem;
  border-radius: 10px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.paginated-table__wrapper {
  position: relative;
  overflow-y: scroll;
  overflow-x: scroll;
  padding-bottom: 1rem;
}

.paginated-table__body {
  position: relative;
}

.paginated-table__wrapper table {
  min-height: 150px;
  table-layout: fixed;
  overflow: scroll;
  width: 100%;
}

.paginated-table__header {
  background: white;
  width: 100%;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.paginated-table__body {
  min-height: 300px;
}

.paginated-table__row {
  position: relative;
}

.paginated-table__progress-bar-placeholder {
  height: 16px;
}

.paginated-table__footer {
  background: white;
  width: 100%;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.fixed-selection-column {
  left: 0;
  position: sticky;
  z-index: 99;
  width: 50px;
}

.fixed-column {
  position: sticky;
  left: 50px;
  z-index: 99;
}
</style>
