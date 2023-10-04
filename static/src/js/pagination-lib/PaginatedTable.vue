<script setup>
// VUE
import { ref, onMounted, computed, watch } from "vue";

// COMPONENTS
import DefaultRow from "./sub-components/DefaultRow.vue";
import Error from "./sub-components/Error.vue";
import Headings from "./sub-components/Headings.vue";
import Loading from "./sub-components/Loading.vue";
import Overlay from "./sub-components/Overlay.vue";
import PageSelector from "./sub-components/PageSelector.vue";
import Placeholder from "./sub-components/Placeholder.vue";
import ProgressBar from "./sub-components/ProgressBar.vue";
import ResultSummary from "./sub-components/ResultSummary.vue";
import ResultsPerPageSelector from "./sub-components/ResultsPerPageSelector.vue";

import {
  defaultTotalGetter,
  defaultRowsGetter,
  defaultRowsPreprocessor,
} from "./pagination/defaults";

import fetchRows from "./pagination/rows";
import pages from "./pagination/pages";
import rowSelection from "./pagination/rowSelection";

// PROPS

const props = defineProps({
  // HEADINGS: an array of objects.
  // e.g. [{
  //     "key": "first_name"
  //     "display": "Name"
  // }]
  headings: {
    type: Array,
    required: true,
  },

  // SOURCE URL: the URL of the endpoint that will return rows for the table
  sourceURL: {
    type: String,
    required: true,
  },

  // ROW IDENTIFICATION KEY: e.g. 'id' or 'api_uuid'. The key whose value will be unique to each row.
  rowIdentificationKey: {
    type: String,
    required: true,
  },

  // USERS CAN SELECT ROWS (optional): defines if users can select rows for bulk actions.
  // Component will emit the selectedRowsUpdated event when the user's selection changes.
  usersCanSelectRows: {
    type: Boolean,
    required: false,
    default: false,
  },

  // TOTAL GETTER (optional): a function to get the total number of results from the response
  totalGetter: {
    type: Function,
    required: false,
    default: defaultTotalGetter,
  },

  // ROWS GETTER (optional): a function that returns the list of rows from the response
  rowsGetter: {
    type: Function,
    required: false,
    default: defaultRowsGetter,
  },

  // ROWS PRE-PROCESSOR (optional): a function that will process row data before rendering them.
  // e.g. you want to format a date field before rendering
  rowsPreProcessor: {
    type: Function,
    required: false,
    default: defaultRowsPreprocessor,
  },

  // TABLE CLASS (optional): style the table with one or more classes that will be applied to the table element.
  tableClass: {
    type: String,
    required: false,
    default: "table",
  },

  // RESULTS PER PAGE OPTIONS (optional): Array of integers
  resultsPerPageOptions: {
    type: Array,
    required: false,
    default: [10, 25, 50],
  },

  // DEFAULT ERROR MESSAGE (optional)
  defaultErrorMessage: {
    type: String,
    required: false,
    default: "Error loading table. \nPlease contact support.",
  },
});

// Initial States
const errorExists = ref(false);
const offset = ref(0);
const rows = ref([]);
const total = ref(0);
const requestedPage = ref(1);
const requestedLimit = ref(undefined);
const selectedRows = ref([]);
const showLoadingOverlay = ref(false);
const showProgressBar = ref(false);

// Computed
const allRowsSelected = computed(
  () =>
    rows.value.length > 0 && rows.value.length === selectedRows.value.length,
);
const currentPage = computed(() =>
  pages.getCurrentPage(offset.value, limit.value),
);
const limit = computed(() =>
  requestedLimit.value ? requestedLimit.value : props.resultsPerPageOptions[0],
);
const showResultSummary = computed(() =>
  errorExists.value ? false : total.value > 0,
);
const totalPages = computed(() =>
  pages.getTotalPages(total.value, limit.value),
);

// Methods
const handleRowSelectionEvent = (rowIdentifier, isSelected) => {
  selectedRows.value = rowSelection.toggleRowSelection(
    rowIdentifier,
    isSelected,
    selectedRows.value,
  );
};

const handleAllRowsSelectorUpdate = (allRowsSelected) => {
  // Selects or deselects all rows.
  selectedRows.value = allRowsSelected
    ? rows.value.map((row) => row.id)
    : [];
};

const updateLimit = (newLimit) => {
  requestedLimit.value = newLimit;
};

const updatePage = (newPage) => {
  requestedPage.value = newPage;
  selectedRows.value = [];
};

const updateTable = async () => {
  showLoadingOverlay.value = true;

  let _rows;
  let _total;
  let _errorExists;

  const nextOffset = pages.getNextOffset(requestedPage.value, limit.value);

  [_total, _rows, _errorExists] = await fetchRows(
    props.sourceURL,
    props.headings,
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

onMounted(async () => {
  updateTable();
});

watch(limit, async () => {
  updateTable();
});

watch(requestedPage, async () => {
  showLoadingOverlay.value = true;

  setTimeout(updateTable, 1000);
});
</script>

<template>
  <div class="paginated-table shadow p-3 mb-5 bg-body rounded">
    <div class="paginated-table__header">
      <ResultsPerPageSelector
        :resultsPerPageOptions="props.resultsPerPageOptions"
        :selected="limit"
        @results-per-page-selection-changed="updateLimit"
      />
    </div>

    <Placeholder class="paginated-table__progress-bar-placeholder">
      <ProgressBar v-show="showProgressBar" />
    </Placeholder>

    <div class="paginated-table__wrapper">
      <table :class="props.tableClass">

        <Headings
          :headings="props.headings"
          :usersCanSelectRows="usersCanSelectRows"
          :allRowsSelected="allRowsSelected"
          @all-rows-selector-updated="handleAllRowsSelectorUpdate"
        />

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
      </table>
    </div>

    <div class="paginated-table__footer">
      <Placeholder>
        <ResultSummary
          v-if="showResultSummary"
          :limit="limit"
          :offset="offset"
          :total="total"
        />
      </Placeholder>

      <PageSelector
        :currentPage="currentPage"
        :totalPages="totalPages"
        @page-number-changed="updatePage"
      />
    </div>
  </div>
</template>

<style>
.paginated-table {
  height: fit-content;
  width: 100%;
  background: white;
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
</style>
