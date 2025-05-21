/*
 * Formats a JavaScript Date object into a string representing the time in 12-hour format with AM or PM suffix.
 * It checks if the provided input is a valid Date object and not an "Invalid Date". If the input is invalid,
 * it returns the string "Invalid Date". For valid dates, it converts the time to a 12-hour format with a leading
 * zero for minutes less than 10 and appends AM or PM as appropriate.
 */

export function getFormattedTime(date) {
  if (!(date instanceof Date) || isNaN(date.getTime())) {
    return "Invalid Date";
  }

  let hours = date.getHours();
  let minutes = date.getMinutes();
  const ampm = hours >= 12 ? "PM" : "AM";

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  minutes = minutes < 10 ? "0" + minutes : minutes;

  return `${hours}:${minutes} ${ampm}`;
}

const parseDateProto = (date) => {
  return new Date(date.year, date.month - 1, date.day);
};

const getDateProto = (date) => {
  return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
};

const isDateProto = (obj) => {
  return obj && obj.year && obj.month && obj.day;
};

export { parseDateProto, getDateProto, isDateProto };