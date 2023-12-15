var moment = require('moment');

time = () => {
    var date = new Date();
    const monthNames = ["January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    var day = date.getDate(),
        month = monthNames[date.getMonth()],
        year = date.getFullYear(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds();

    var login_time = `${day} ${month} ${year} ${hour}:${minute}:${second}`

    return login_time
}

time_date = () => {
    var date = new Date();
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
        "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];

    var day = date.getDate(),
        month = monthNames[date.getMonth()],
        year = date.getFullYear()

    var date = `${day}-${month}-${year}`

    return date
}

check_null = (value) => {
    if (!value || value == '' || value == null) {
        return '-';
    } else {
        return value;
    }
}

check_null_start = (value) => {
    if (!value || value == '' || value == null || value == 0) {
        return '-';
    } else {
        return value;
    }
}

time_his = () => {
    var date = new Date();

    var day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds();

    var time_his = `${year}-${month}-${day} ${hour}:${minute}:${second}`

    return time_his
}

log_time = () => {
    var date = new Date();

    var day = date.getDate(),
        month = date.getMonth() + 1,
        year = date.getFullYear(),
        hour = date.getHours(),
        minute = date.getMinutes(),
        second = date.getSeconds();

    var log_time = `${day}-${month}-${year} ${hour}:${minute}:${second}`

    return log_time
}


capital_each_word = (letter) => {
    let callback = letter.toLowerCase()
        .split(' ')
        .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
        .join(' ');

    return callback
}

check_date = (value) => {

    if (moment(value, 'DD-MM-YYYY', true).isValid() || moment(value, 'D-MM-YYYY', true).isValid()) {
        var newdate = value.split("-").reverse().join("-");
    } else if (moment(value, 'DD/MM/YYYY', true).isValid() || moment(value, 'D/MM/YYYY', true).isValid()) {
        var newdate = value.split("/").reverse().join("-");
    } else {
        var newdate = value;
    }

    return newdate;
}

module.exports = {
    time: time,
    time_his: time_his,
    capital_each_word: capital_each_word,
    log_time: log_time,
    check_null: check_null,
    check_null_start: check_null_start,
    check_date: check_date,
    time_date: time_date
}