import moment from "moment";

export const getDate = (date) => {
  return moment(date).format("DD-MM-YYYY");
};
export const getTime = (date) => {
  return moment(date).format("HH:mm");
};
