# Paginated Table

This paginated table works by fetching JSON data over AJAX request to the supplied endpoint URL.

## Props
### Headings (required)
You must supply an array of objects to the headings prop.

Each heading object must have keys for `key` and `display`.

The key corresponds to a field in the JSON response.

The "display" key determines what text will be rendered in the table header.

Headings must be supplied in the order they will appear in the table from left to right.

**Example**
```
const headings = [
  {
    key: "givenName",
    display: "First Name",
  },
  {
    key: "familyName",
    display: "Surname",
  },
  {
    key: "dateOfBirth",
    display: "Date of Birth",
  },
  {
    key: "nationality",
    display: "Nationality",
  },
  {
    key: "url",
    display: "URL",
  },
];
```

### Source URL (required)
You must supply the URL of the endpoint that will supply the table data.

The endpoint must support RESTful query parameters and offset pagination.
- limit
- offset
- filter strings

### Getters (optional)
Getters are a set of default props designed to support a wide range of endpoints.

Each getter is a function that accepts a dictionary and returns the desired value.

For example, the Formula 1 API structures its response to the Driver endpoint as follows:

```
{
    "MRData": {
        "total": 858,
        "limit": 10,
        "offset": 0,
        "DriverTable": {
            "Drivers": [{..}, {..}, {..} ... {..}]
        }
    }
}
```

**Total Getter**
The total getter is a function that returns the total number of results.

```
function totalGetter(jsonResponse) {
  return jsonResponse["MRData"]["total"];
}
```

Getters are optional. The following function is used as a default. Depending on the where the total is stored, you may not need to provide a custom function.

```
function defaultTotalGetter(response) {
  return response["count"];
}
```

**Rows Getter**
The rows getter is a function that returns the array that will be used to populate the table's rows.

In the Formula 1 example, we have to provide a custom rows getter to extract the list of drivers from the JSON response.

```
function rowsGetter(jsonResponse) {
  return jsonResponse["MRData"]["DriverTable"]["Drivers"];
}
```

### Rows Pre-processor (optional)
There may be times where you want to process data from the endpoint before rendering it in the table.

Examples:
- Your endpoint returns firstName and lastName separately but you want to display the full name.
- You want to format a date before rendering it in the table.

You can provide a function to the rowsPreProcessor prop. It must accept an array of row objects and return an array of row objects of the same length.

```
function rowsPreprocessor(rows) {
  // Combines first and last name fields
  // Formats the date of birth

  return rows.map((row) => {
    row["name"] = getFullName(row.givenName, row.familyName);
    row["dateOfBirth"] = formatDate(row.dateOfBirth);
    return row;
  });
}
```

By default, there is no pre-processing.

### Table Class (optional)
You may supply one or more classes which will be applied to the table element. This has been added to allow Bootstrap classes to be applied to the table element.

### Results Per Page Options (optional)
Users are allowed to change how many results are displayed per page.

By default, the options are 10, 25 and 50.

The first value of the array will be used to request the number of results for the first page.

### Default Error Message (optional)
You may supply a custom message to be displayed if there is an error fetching table data.

## Slots

### Rows
There are many applications where you may need to render custom components inside cells of the table.

A slot for rows is provided which has access to the rows returned by the endpoint.

Each row is an array of values that has been sorted in the order of the headings.

The slot is optional. By default, it will render the raw values.

**Example**
```    
<paginated-table
    tableClass="table table-striped table-hover table-responsive"
    :headings="headings"
    sourceURL="http://ergast.com/api/f1/drivers.json"
    :rowsGetter="ergastAPI.rowsGetter"
    :totalGetter="ergastAPI.totalGetter"
    :rowsPreProcessor="ergastAPI.rowsPreprocessor"
>
    <template v-slot="{ rows }">
    <tr v-for="(row, index) in rows" :key="index">
        <td v-for="(cell, i) in row" :key="i">
        {{ cell }}
        </td>
    </tr>
    </template>
</paginated-table>
```