const dateDiffMin = (date1, date2) => {
  const startDate = new Date(date1);
  const endDate = new Date(date2);
  diff = startDate - endDate;
  return Math.round(diff / (1000 * 60));
};

module.exports = dateDiffMin;
