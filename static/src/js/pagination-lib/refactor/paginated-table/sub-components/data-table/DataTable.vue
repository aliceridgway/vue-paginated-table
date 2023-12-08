<script setup>

// Presentational component
// Does not contain any pagination logic

import DefaultHeadings from './slot-defaults/DefaultHeadings.vue';
import DefaultRow from './slot-defaults/DefaultRow.vue';

const props = defineProps({
    headings: {
        type: Array,
        required: true
    },
    rows: {
        type: Array,
        required: true    
    },
    isLoading: {
        type: Boolean,
        required: false
    },
    tableElementCSSClass: {
        type: String,
        required: false,
        default: ""
    },
    // PAGES
    currentPage: {
        type: Number,
        required: true
    },
    totalPages: {
        type: Number,
        required: true
    },
    // SORTING
    sortableColumns: {
        type: Array,
        required: true
    },
    sortedColumn: {
        type: String,
        required: false,
        default: null
    },
    sortedColumnAscending: {
        type: Boolean,
        required: false,
        default: null
    },
    // RESULTS PER PAGE
    selectedResultsPerPage: {
        type: Number,
        required: true
    },
    resultsPerPageOptions: {
        type: Array,
        required: true
    },
    // ROW SELECTION
    allRowsSelected: {
        type: Boolean,
        required: false,
        default: false
    },
    usersCanSelectRows: {
        type: Boolean,
        required: false,
        default: false
    },
    // FREEZABLE COLUMNS
    freezeFirstColumn: {
        type: Boolean,
        required: false,
        default: false
    },
    // ERROR HANDLING
    errorMessage: {
        type: String,
        required: false,
        default: null
    }
})

</script>

<template>
    <table :class="props.tableElementCSSClass">
        <slot 
            name="headings"
            :headings="headings" 
            :sortable-columns="sortableColumns" 
            :sorted-column="sortedColumn" 
            :sort-ascending="sortedColumnAscending"
            :users-can-select-rows="usersCanSelectRows"
            :freeze-first-column="freezeFirstColumn"
        >
            <DefaultHeadings 
                :headings="headings" 
                :sortable-columns="sortableColumns" 
                :sorted-column="sortedColumn" 
                :sort-ascending="sortedColumnAscending"
                :users-can-select-rows="usersCanSelectRows"
                :freeze-first-column="freezeFirstColumn"
            />
        </slot>

        <tbody>
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

        </tbody>
    </table>
    
</template>