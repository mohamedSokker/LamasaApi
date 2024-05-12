const dateDiffDays = (date1, date2) => {
  const startDate = new Date(date1);
  const endDate = new Date(date2);
  diff = startDate - endDate;
  return Math.round(diff / (60 * 60 * 24 * 1000));
};

module.exports = dateDiffDays;
