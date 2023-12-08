export default function formatRows(rowsAsJson, key, visibleHeadingKeys){

    return rowsAsJson.map(rowAsJson => {
        const rowKey = rowAsJson[key]

        const rowValues = visibleHeadingKeys.map( headingKey => {
            availableKeys = Object.keys(rowJson);
            value = availableKeys.includes(headingKey) ? rowAsJson[headingKey] : ""
        })

        return {
            key: rowKey,
            values: rowValues
        }
    })
}