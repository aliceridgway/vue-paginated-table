<script setup>
import { computed } from 'vue';
import fetchRows from './fetchRows';
import formatRows from './formatRows';

import PaginatedTable from './PaginatedTable.vue';

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
    rowGetter: {
        type: Function,
        required: false,
        default: fetchRows
    },
    // A function that formats rows before rendering. 9 times out of 10, you won't need to supply this.
    rowFormatter: {
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

const rows = ref([])
const isLoading = false
const page = ref(1)
const selectedResultsPerPage = ref(null)

const resultsPerPage = computed(() => selectedResultsPerPage.value ? selectedResultsPerPage.value : props.resultsPerPageOptions[0]);

const updateTable = async () => {
    isLoading.value = true
    let rowCount
    let rowData
    [rowData, rowCount] = await fetchRows(page.value, resultsPerPage.value, props.baseEndpointURL, props.filters)
    const formattedRows = formatRows(rowsAsJson)
    rows.value = formattedRows

}
const visibleColumns = computed(() => {
    props.columns.filter(column => !hiddenColumns.includes(column.key))
})


</script>

<template>
    <PaginatedTable :headings="visibleColumns" :rows="rows"></PaginatedTable>
</template>