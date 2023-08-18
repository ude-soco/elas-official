export const parseDate = (date, time) => {
  let temp = time.split(":");
  let hours = temp[0];
  let minutes = temp[1];

  let setHours = new Date(new Date(date).setHours(hours));
  let setMinutes = new Date(new Date(setHours).setMinutes(minutes));
  return new Date(setMinutes);
};