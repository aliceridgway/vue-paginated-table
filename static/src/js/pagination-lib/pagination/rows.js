export default async function fetchRows(
  baseURL,
  headings,
  limit,
  offset,
  totalGetter,
  rowsGetter,
  rowsProcessor,
  rowIdentificationKey,
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
    const formattedRows = formatRows(processedRows, rowIdentificationKey);
    const filteredRows = filterRows(formattedRows, headings);
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

function sortSingleRow(row, keys) {
  // for a single row of data, return an Array of values ordered by their keys.

  const rowKeys = row.values.map((cell) => cell.key);

  const sortedValues = keys.map((key) => {
    if (rowKeys.includes(key)) {
      return row.values.filter(cell => cell.key == key)[0];
    } else {
      return {
        key,
        value: "",
      };
    }
  });

  row.values = sortedValues
  return row
}

function formatRows(rows, rowIdentificationKey) {
  return rows.map((row) => formatSingleRow(row, rowIdentificationKey));
}

function formatSingleRow(rowObject, rowIdentificationKey) {
  const keys = Object.keys(rowObject);

  const values = keys.map((key) => ({
    key,
    value: rowObject[key],
  }));

  return {
    id: rowObject[rowIdentificationKey],
    values: values
  }
}

function filterRows(rows, headings) {
  const heading_keys = headings.map((headingObj) => headingObj.key);
  return rows.map((row) => filterSingleRow(row, heading_keys));
}

function filterSingleRow(row, headings) {
  const rowCopy = {...row};
  const filteredValues = rowCopy.values.filter((field) => headings.includes(field.key));
  rowCopy.values = filteredValues
  return rowCopy
}
