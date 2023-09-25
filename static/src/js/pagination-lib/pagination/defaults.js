export function defaultTotalGetter(response) {
  // Returns the total number of results.
  const key = "count";
  if (!(key in response)) {
    throw Error(
      `Could not find the total number of results from the response. Expecting response to contain ${key} key. You will need to define a custom totalGetter and pass it into the PaginatedTable component as a prop.`,
    );
  }
  return response[key];
}

export function defaultRowsGetter(response) {
  // returns an array of rows from the AJAX response
  const key = "data";
  if (!(key in response)) {
    throw Error(
      `Could not find the rows in the response. Expecting response to contain ${key} key. You will need to define a custom rowsGetter and pass it into the PaginatedTable component as a prop.`,
    );
  }
  return response[key];
}

export function defaultHttpCodeGetter(response) {
  // returns the status code from the response
  const key = "status";
  if (!(key in response)) {
    throw Error(
      `Could not find HTTP status code in the response. Expecting response to contain ${key} key. You will need to define a custom httpCodeGetter and pass it into the PaginatedTable component as a prop.`,
    );
  }
  return response[key];
}

export function defaultRowsPreprocessor(rowObjects) {
  return rowObjects;
}