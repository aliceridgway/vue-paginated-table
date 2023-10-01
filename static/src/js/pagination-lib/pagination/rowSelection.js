function toggleRowSelection(rowIdentifier, isSelected, selectedRows){
    if (isSelected){
        return addToSelectedRows(rowIdentifier, selectedRows)
    } else {
        return removeFromSelectedRows(rowIdentifier, selectedRows)
    }
}

function addToSelectedRows(rowIdentifier, selectedRows) {

    const selectedRowsCopy = [...selectedRows]

    if (!(rowIdentifier in selectedRowsCopy)){
      selectedRowsCopy.push(rowIdentifier)
    }
    return selectedRowsCopy
  }
  
function removeFromSelectedRows(rowIdentifier, selectedRows) {

    const selectedRowsCopy = [...selectedRows];

    const index = selectedRowsCopy.indexOf(rowIdentifier);
  
    if (index === -1){
      return selectedRowsCopy
    }
  
    selectedRowsCopy.splice(index, 1)
  
    return selectedRowsCopy
}

export default {
    toggleRowSelection,
    addToSelectedRows,
    removeFromSelectedRows
}
