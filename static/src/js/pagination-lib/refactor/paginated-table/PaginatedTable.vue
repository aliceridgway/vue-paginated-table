<script setup>
import { computed, onMounted } from 'vue';
import fetchRows from './default-props/fetchRows';
import formatRows from './default-props/formatRows';

import DataTable from './sub-components/data-table/DataTable.vue';

import { usePaginatedTableStore } from './stores/PaginatedTableStore';

const store = usePaginatedTableStore()

const props = defineProps({
    baseEndpointURL: {
        type: String,
        required: true,
    },
    columns: {
        type: Array,
        required: true
    },
    hiddenColumns: {
        type: Array,
        required: false,
        default: []
    },
    sortableColumns: {
        type: Array,
        required: false,
        default: []
    },
    // A function that fetches row data as JSON from the endpoint URL. Supply a function that fits the API schema and chosen pagination strategy.
    rowsGetter: {
        type: Function,
        required: false,
        default: fetchRows
    },
    // A function that formats rows before rendering. 9 times out of 10, you won't need to supply this.
    rowsFormatter: {
        type: Function,
        required: false,
        default: formatRows
    },
    filters: {
        type: URLSearchParams,
        required: false,
        default: new URLSearchParams()
    },
    resultsPerPageOptions: {
        type: Array,
        required: false,
        default: [10, 25, 50]
    },
    tableElementCSSClass: {
        type: String,
        required: false,
        default: ""
    }
})

// INITIAL STATES
const rows = ref([])
const totalRows = ref(0);

const currentPage = ref(1);
const selectedResultsPerPage = ref(null);
const sortDirectionIsAscending = ref(null);
const sortColumn = ref(null);

const isLoading = ref(false);
const errorMessage = ref(null);

const visibleColumns = computed(() => {
    props.columns.filter(column => !hiddenColumns.includes(column.key))
})

// TABLE UPDATES

onMounted(async () => {
  updateTable();
});

store.$subscribe((mutation, state) => {
    updateTable()
})

const updateTable = async () => {
    isLoading.value = true

    const requestedResultsPerPage = store.requestedResultsPerPage.value ? store.requestedResultsPerPage.value : props.resultsPerPageOptions[0]

    try {
        const [rowsAsJson, _totalRows, newPage] = await props.rowsGetter(
            store.requestedPage.value, 
            requestedResultsPerPage, 
            props.baseEndpointURL, 
            props.filters,
            store.requestedSortColumn.value,
            store.requestedSortDirectionIsAscending.value
        )   
    } catch (error){
        errorMessage.value = error;
        isLoading.value = false;
    }

    const formattedRows = props.rowsFormatter(rowsAsJson);

    rows.value = formattedRows;
    currentPage.value = newPage;
    totalRows.value = _totalRows;

    sortColumn.value = store.requestedSortColumn;
    sortDirectionIsAscending.value = store.requestedSortDirectionIsAscending;
    selectedResultsPerPage.value = requestedResultsPerPage;

    errorMessage.value = null;
    isLoading.value = false;
}

</script>

<template>
    <DataTable :headings="visibleColumns" :rows="rows" :errorMessage="errorMessage"></DataTable>
</template>