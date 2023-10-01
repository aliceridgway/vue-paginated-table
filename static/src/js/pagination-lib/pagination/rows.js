export default async function getRows(
  baseURL,
  headings,
  limit,
  offset,
  totalGetter,
  rowsGetter,
  rowsProcessor,
  rowIdentificationKey
) {
  console.log("ahoy");
  const url = `${baseURL}?limit=${limit}&offset=${offset}`;

  let totalRows = 0;
  let sortedRows = [];
  let error = false;

  try {
    const data = await getSourceData(url);
    totalRows = parseInt(totalGetter(data));
    const rowObjects = rowsGetter(data);
    const processedRows = rowsProcessor(rowObjects);
    const formattedRows = formatRows(processedRows, rowIdentificationKey)
    const filteredRows = filterRows(formattedRows, headings)
    sortedRows = sortRowData(filteredRows, headings);
  } catch (e) {
    error = true;
  }

  return [totalRows, sortedRows, error];
}

async function getSourceData(url) {
  const response = await fetch(url, {
    method: "GET",
  });
  const data = await response.json();
  return data;
}

function sortRowData(rows, headings) {
  // For each row, order the data by the ordering defined in the headings array
  // discard data that won't appear in the table.

  const heading_keys = headings.map((headingObj) => headingObj.key);

  const sortedRows = rows.map((row) => sortSingleRow(row, heading_keys));

  return sortedRows;
}

function sortSingleRow(row, keys, rowIdentificationKey) {
  // for a single row of data, return an Array of values ordered by their keys.

  const rowKeys = row.map(cell => cell.key)

  return keys.map((key) => {
    if (rowKeys.includes(key)){
      return row.filter(cell => cell.key == key)[0]
    } else {
      return {
        id: rowIdentificationKey,
        key,
        value: ""
      }
    }
  });
}

function formatRows(rows, rowIdentificationKey) {
  return rows.map(row => formatSingleRow(row, rowIdentificationKey))
}

function formatSingleRow(rowObject, rowIdentificationKey) {
  const identifier = rowObject[rowIdentificationKey];
  const keys = Object.keys(rowObject);

  return keys.map(key => ({
    id: identifier,
    key,
    value: rowObject[key]
  }));
}

function filterRows(rows, headings) {
  const heading_keys = headings.map((headingObj) => headingObj.key);
  return rows.map(row => filterSingleRow(row, heading_keys))
}

function filterSingleRow(row, headings) {
  return row.filter(field => headings.includes(field.key))
}
