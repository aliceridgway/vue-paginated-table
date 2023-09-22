export function defaultTotalGetter(response){
    // Returns the total number of results.
    return response["count"]
}

export function defaultRowsGetter(response){
    // returns an array of rows from the AJAX response
    return response["data"]
}