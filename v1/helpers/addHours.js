const addHours = (anyDate, hours) => {
  const dt = new Date(anyDate);
  const milliseconds = dt.getTime();
  const milliseconds2 = milliseconds + 1000 * 60 * 60 * hours;
  return new Date(milliseconds2);
};

module.exports = addHours;
