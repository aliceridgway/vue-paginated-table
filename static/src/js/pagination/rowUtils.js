import { getSourceData } from "./ajax";

async function getRows(
  baseURL,
  headings,
  limit,
  totalGetter,
  rowsGetter,
  rowsProcessor,
) {
  console.log("ahoy");
  const url = `${baseURL}?limit=${limit}`;
  const data = await getSourceData(url);
  const totalRows = parseInt(totalGetter(data));
  const rowObjects = rowsGetter(data);
  const processedRows = rowsProcessor(rowObjects);
  const sortedRows = sortRowData(processedRows, headings);

  return [totalRows, sortedRows];
}

function sortRowData(rows, headings) {
  // For each row, order the data by the ordering defined in the headings array
  // discard data that won't appear in the table.

  const heading_keys = headings.map((headingObj) => headingObj.key);

  const sortedRows = rows.map((row) => sortSingleRow(row, heading_keys));

  return sortedRows;
}

function sortSingleRow(row, keys) {
  // for a single row of data, return an Array of values ordered by their keys.
  return keys.map((key) => {
    return key in row ? row[key] : "";
  });
}

function defaultRowsPreprocessor(rowObjects) {
  return rowObjects;
}

export default {
  getRows,
  defaultRowsPreprocessor,
  sortRowData,
};
