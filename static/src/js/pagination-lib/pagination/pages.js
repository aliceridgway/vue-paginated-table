function getCurrentPage(offset, limit) {
  if (offset === 0) {
    return 1;
  }

  return offset / limit + 1;
}

function getTotalPages(total, limit) {
  return Math.ceil(total / limit);
}

function getNextOffset(requestedPage, limit) {
  return (requestedPage - 1) * limit
}

export default {
  getCurrentPage,
  getTotalPages,
  getNextOffset
};
