
/*
 * iCal Parser
 */


// Assumes time is in format HHMMSS (an integer, military time)
// returns the number of seconds past midnight

const icsTimeToTime = time => {
  // x >> 0 removes fractional part of x
  var hours = time / (100 * 100) >> 0;
  var minutes = (time % (100 * 100)) / 100 >> 0;
  var seconds = time % 100;

  return (hours * 60 + minutes) * 60 + seconds;

};

// Assumes time is in "(H)H:MM <AM orPM>" format
// returns the number of seconds (not minutes) past midnight.
const stringToTime = timeStr => {
  var parts = timeStr.split(" ");
  var time = parts[0];
  var pm = parts[1] == "PM";
  
  parts = time.split(":");
  var hours = parseInt(parts[0]);
  var minutes = parseInt(parts[1]);

  if (hours == 12) {
    if (pm) {
      pm = false;
    } else {
      hours = 0;
    }
  }

  var numericTime = hours * 60 + minutes;

  if (pm) numericTime += 12 * 60;

  return numericTime * 60;
};

const fixDay = dayStr => {
  return ({
    M: "MO",
    T: "TU",
    W: "WE",
    Th: "TH",
    F: "FR",
  })[dayStr];
};

const icalDayToEnglish = icalDay => {
  return ({
    MO: "Monday",
    TU: "Tuesday",
    WE: "Wednesday",
    TH: "Thursday",
    FR: "Friday"
  })[icalDay];
};

// Important: assumes s2 > s1 and e2 > e1;
const rangeMinDistance = (s1, e1, s2, e2) => {
  if (s1 > s2) { // swap if the first range starts before the second
    var tmp1 = s1;
    var tmp2 = e1;
    s1 = s2;
    e1 = e2;
    s2 = tmp1;
    e2 = tmp2;
  }

  return Math.min(e2 - s1, s2 - e1);

};

const getICSIntervals = ics => {
  var lines = ics.split("\n");
  var line, parts, type, arg;
  var index;

  var intervals = [];
  var intervalIndex = -1;
  var curInterval = {};

  var time;
  var date;
  var days;

  curInterval.location = "";
  curInterval.ignore = false;

  for (index = 0; index < lines.length; index++) {
    line = lines[index];
    parts = line.split(":");
    if (parts.length < 2) continue;
    type = parts[0].trim();
    arg = parts.slice(1).join(":").trim();
    if (type == "BEGIN" && arg == "VEVENT") {
      intervalIndex++;
      intervals[intervalIndex] = {};
      curInterval = intervals[intervalIndex];
    }

    if (type == "SUMMARY") {
      curInterval.name = arg;
    }

    if (type == "DTSTART") {
      [date, time] = arg.split("T");
      curInterval.start_date = date
      curInterval.start_time = icsTimeToTime(parseInt(time));
    }
    if (type == "DTEND") {
      [date, time] = arg.split("T");
      curInterval.end_date = date
      curInterval.end_time = icsTimeToTime(parseInt(time));
    }

    if (type == "RRULE") {
      days = arg.match(/BYDAY=(.*)/)[1];
      if (days) {
        curInterval.days_of_week = days.replace(/,/g, " ");
      }
    }


  }

  return intervals;

};

module.exports = {
  parseICS: getICSIntervals,
  rangeMinDistance: rangeMinDistance
};
