import {Temporal} from "@js-temporal/polyfill";

export function standardizeDate(date) {
  if (!date) {
    console.error("Date is null or undefined");
    return null;
  }

  try {

    if (date instanceof Temporal.PlainDate) {
      return date;
    }


    const dateString = String(date).trim();


    if (/^\d{1,2}\/\d{1,2}\/\d{4}$/.test(dateString)) {
      const [day, month, year] = dateString.split('/');
      return Temporal.PlainDate.from({ year: parseInt(year), month: parseInt(month), day: parseInt(day) });
    }


    if (/^\d{4}-\d{2}-\d{2}$/.test(dateString)) {
      return Temporal.PlainDate.from(dateString);
    }

    console.error("Failed to parse date:", dateString);
    return null;
  } catch (error) {
    console.error("Error in standardizeDate:", error);
    return null;
  }
}

export function formatDate(date, formatStr = "DD/MM/YYYY") {
  if (!date) return '';

  try {
    const dateObj = date instanceof Temporal.PlainDate ? date : Temporal.PlainDate.from(date);



    return `${dateObj.day.toString().padStart(2, '0')}/${dateObj.month.toString().padStart(2, '0')}/${dateObj.year}`;
  } catch (error) {
    console.error("Error formatting date:", error);
    return '';
  }
}

export const createStructuredDate = (date) => {
  if (!date) return null;

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return null;

  return parsedDate;
};

export const formatStructuredDate = (date) => {
  if (!date) return '';

  const parsedDate = new Date(date);
  if (isNaN(parsedDate.getTime())) return '';

  const options = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };

  return parsedDate.toLocaleDateString('es-ES', options);
};

export const getWeekDates = (date) => {
  const current = new Date(date);
  const week = [];


  current.setDate(current.getDate() - current.getDay());

  for (let i = 0; i < 7; i++) {
    week.push(new Date(current));
    current.setDate(current.getDate() + 1);
  }

  return week;
};

export const isSameDay = (date1, date2) => {
  if (!date1 || !date2) return false;

  const d1 = new Date(date1);
  const d2 = new Date(date2);

  return d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();
};

export const isToday = (date) => {
  return isSameDay(date, new Date());
};

export const addDays = (date, days) => {
  const result = new Date(date);
  result.setDate(result.getDate() + days);
  return result;
};

export const subtractDays = (date, days) => {
  return addDays(date, -days);
};

export const getMonthDates = (year, month) => {
  const dates = [];
  const date = new Date(year, month, 1);

  while (date.getMonth() === month) {
    dates.push(new Date(date));
    date.setDate(date.getDate() + 1);
  }

  return dates;
};

export const formatTimeSlot = (time) => {
  if (!time) return '';

  const [hours, minutes] = time.split(':');
  return `${hours.padStart(2, '0')}:${minutes.padStart(2, '0')}`;
};

export const isValidTimeSlot = (time) => {
  if (!time) return false;

  const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
  return timeRegex.test(time);
};
