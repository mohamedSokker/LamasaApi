const formatDate = (anyDate) => {
  dt = new Date(anyDate);
  const year = dt.getFullYear();
  let day = dt.getDate().toString();
  let month = (Number(dt.getMonth()) + 1).toString();
  if (month.length < 2) month = `0${month}`;
  if (day.length < 2) day = `0${day}`;
  return `${year}-${month}-${day}`;
};

module.exports = formatDate;
