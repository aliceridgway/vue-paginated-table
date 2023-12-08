import { defineStore } from "pinia";

export const usePaginatedTableStore = defineStore('paginatedTable', {
    state: () => ({
        requestedPage: 1,
        selectedResultsPerPage: null,
        requestedSortColumn: null,
        requestedSortDirectionIsAscending: true,
    }),
    actions: {
        nextPage() {
            this.requestedPage += 1
        },
        previousPage() {
            this.requestedPage -= 1
        },
        changePage(page) {
            this.requestedPage = 1
        },
        changeResultsPerPage(resultsPerPage) {
            this.selectedResultsPerPage = resultsPerPage
        },
        changeSortDirection(isAscending) {
            this.requestedSortDirectionIsAscending = isAscending
        },
        sortTable(sortColumnKey) {
            this.requestedSortColumn = sortColumnKey
        }
    }
})