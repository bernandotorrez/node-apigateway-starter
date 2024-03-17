const moment = require('moment');

const time = () => {
  const date = new Date();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];
  const day = date.getDate();
  const month = monthNames[date.getMonth()];
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const loginTime = `${day} ${month} ${year} ${hour}:${minute}:${second}`;

  return loginTime;
};

const timeDate = () => {
  const currentDate = new Date();
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
  ];

  const day = currentDate.getDate();
  const month = monthNames[currentDate.getMonth()];
  const year = currentDate.getFullYear();

  const timeDate = `${day}-${month}-${year}`;

  return timeDate;
};

const checkNull = (value) => {
  if (!value || value === '' || value == null) {
    return '-';
  } else {
    return value;
  }
};

const checkNullStart = (value) => {
  if (!value || value === '' || value == null || value === 0) {
    return '-';
  } else {
    return value;
  }
};

const timeHis = () => {
  const date = new Date();

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const timeHis = `${year}-${month}-${day} ${hour}:${minute}:${second}`;

  return timeHis;
};

const logTime = () => {
  const date = new Date();

  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  const second = date.getSeconds();

  const logTime = `${day}-${month}-${year} ${hour}:${minute}:${second}`;

  return logTime;
};

const capitalEachWord = (letter) => {
  const callback = letter.toLowerCase()
    .split(' ')
    .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
    .join(' ');

  return callback;
};

const checkDate = (value) => {
  let newDate;
  if (moment(value, 'DD-MM-YYYY', true).isValid() || moment(value, 'D-MM-YYYY', true).isValid()) {
    newDate = value.split('-').reverse().join('-');
  } else if (moment(value, 'DD/MM/YYYY', true).isValid() || moment(value, 'D/MM/YYYY', true).isValid()) {
    newDate = value.split('/').reverse().join('-');
  } else {
    newDate = value;
  }

  return newDate;
};

const convertMessage = (messages) => {
  const data = [];

  messages.forEach((row) => {
    data.push({
      message: row.message,
      field: row.path[0]
    });
  });

  return data;
};

module.exports = {
  time,
  timeHis,
  capitalEachWord,
  logTime,
  checkNull,
  checkNullStart,
  checkDate,
  timeDate,
  convertMessage
};
