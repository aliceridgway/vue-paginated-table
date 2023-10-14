import {
  defaultTotalGetter,
  defaultRowsGetter,
  defaultRowsPreprocessor,
} from "./pagination/defaults";

export const paginatedTableProps = {
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

  // SORTABLE COLUMNS (optional): a list of heading keys that the user can select to sort the table.
  sortableColumns: {
    type: Array,
    required: false,
    default: [],
  },

  // USERS CAN SELECT ROWS (optional): defines if users can select rows for bulk actions.
  // Component will emit the selectedRowsUpdated event when the user's selection changes.
  usersCanSelectRows: {
    type: Boolean,
    required: false,
    default: false,
  },

  // FREEZE FIRST COLUMN (optional): if true, the first column's position will be fixed
  // when scrolling horizontally. The first column excludes the selection column if enabled.
  freezeFirstColumn: {
    type: Boolean,
    required: false,
    default: true,
  },

  // SEARCH PARAMS: a URLSearchParams object, to filter the results. This is to allow
  // search bars and filters to be defined separately.
  searchParams: {
    type: URLSearchParams,
    required: false,
    default: null,
  },

  hiddenColumns: {
    type: Array,
    required: false,
    default: [],
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
};
