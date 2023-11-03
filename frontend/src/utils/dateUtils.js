import moment from "moment";

export const getFullDateFormatted = (unformattedDate) => moment(unformattedDate).format("DD MMMM YYYY");

export const formatDate = (unformattedDate) => moment(unformattedDate).format("MMM DD, YYYY");
