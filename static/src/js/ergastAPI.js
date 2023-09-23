function rowsGetter(jsonResponse) {
  return jsonResponse["MRData"]["DriverTable"]["Drivers"];
}

function totalGetter(jsonResponse) {
  return jsonResponse["MRData"]["total"];
}

function rowsPreprocessor(rows) {
  // Combines first and last name fields
  // Formats the date of birth

  return rows.map((row) => {
    row["name"] = getFullName(row.givenName, row.familyName);
    row["dateOfBirth"] = formatDate(row.dateOfBirth);
    return row;
  });
}

function getFullName(firstName, lastName) {
  return `${firstName} ${lastName}`;
}

function formatDate(inputDate) {
  const options = { year: "numeric", month: "long", day: "numeric" };
  const dateParts = inputDate.split("-");
  const year = parseInt(dateParts[0]);
  const month = parseInt(dateParts[1]) - 1; // Month is 0-indexed in JavaScript
  const day = parseInt(dateParts[2]);

  const formattedDate = new Date(year, month, day).toLocaleDateString(
    undefined,
    options,
  );

  return formattedDate.replace(/(\d)(st|nd|rd|th)/, "$1<sup>$2</sup>");
}

export default {
  rowsGetter,
  totalGetter,
  rowsPreprocessor,
};
