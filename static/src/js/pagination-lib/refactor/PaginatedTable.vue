<script setup>

// Presentational component
// Does not contain any pagination logic

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
    }
})

const events = defineEmits({
    pageRequested: {
        args: [pageNumber]
    },
    sortRequested: {
        args: [headingKey, sortAscending]
    },
    resultsPerPageSelectionUpdated: {
        args: [newResultsPerPageSelection]
    }
})

</script>

<template>
    <table :class="props.tableElementCSSClass">
        <thead>
            <th v-for="heading in props.headings" :key="heading.key">
                {{ heading.display }}
            </th>
        </thead>
        <tbody>
            <tr v-for="row in rows" :key="row.id">
                <td v-for="(value, i) in row" :key="i">
                    {{ value }}
                </td>
            </tr>
        </tbody>
    </table>
    
</template>