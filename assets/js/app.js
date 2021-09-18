//get today's time
var time = AMPMformat(new Date(Date.now()));

//when the page open, set the date and load the events
$(document).ready(function () {
  cleanOlderEvents();
  setCurrentDay(currentDay());
  var timeBlocksContainer = $(".container");
  for (var i = 9; i <= 17; i++) {
    var hour = AMPMformat(new Date(0, 0, 0, i));
    var moment = isEarlier(hour, time)
      ? "past"
      : isLater(hour, time)
      ? "future"
      : "present";
    var description = getEventDescription(hour);
    timeBlocksContainer.append(
      "<div class='time-block row'><div class='hour col'>\n" +
        hour +
        "\n</div><textarea class='" +
        moment +
        " col-10'>" +
        description +
        "</textarea><div class='saveBtn col d-inline-flex align-items-center' onclick='saveEvent(\"" +
        hour +
        "\")'><i class='far fa-save'></i></div></div>"
    );
  }
});

//iterate throuh all events and remove the past ones to prevent the localStorage from running out of space
function cleanOlderEvents() {
  var day = currentDay();
  var eventList = getEventList();
  eventList.forEach(function (event, index, array) {
    if (event.day !== day) {
      array.splice(index, 1);
    }
  });
}

//get the description of the event from the day at the specified hour from the localStorage
function getEventDescription(hour) {
  var day = currentDay();
  var eventList = getEventList();
  var event = eventList.find(
    (event) => event.day === day && event.time === hour
  );
  return event ? event.description : "";
}

//save the event of the specified hour to the localStorage
function saveEvent(hour) {
  $(".time-block").each(function (index, element) {
    if ($(element).find(".hour").text().trim() === hour) {
      var eventList = getEventList();
      if (
        !eventList.some((event) => {
          if (
            event.day === $("#currentDay").text().trim() &&
            event.time === hour
          ) {
            event.description = $(element).find("textarea").val().trim();
            return true;
          }
        })
      ) {
        eventList.push({
          day: $("#currentDay").text().trim(),
          time: hour,
          description: $(element).find("textarea").val().trim(),
        });
      }
      localStorage.eventList = JSON.stringify(eventList);
    }
  });
}

//return the eventList from the localStorage
function getEventList() {
  return localStorage.eventList && localStorage.eventList !== undefined
    ? JSON.parse(localStorage.eventList)
    : [];
}

//return today's date as "weekday, month day" format
function currentDay() {
  return new Date(Date.now()).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

//set the header date to provided date
function setCurrentDay(date) {
  $("#currentDay").text(date);
}

//return true is time1 is later than time2, false otherwise
function isLater(time1, time2) {
  if (time1.slice(-2) === time2.slice(-2)) {
    return time1 === "12PM"
      ? false
      : time1.replace(/[^0-9]+/, "") > time2.replace(/[^0-9]+/, "")
      ? true
      : false;
  } else {
    return time2.slice(-2) === "AM" ? true : false;
  }
}

//return true is time1 is earlier than time2, false otherwise
function isEarlier(time1, time2) {
  if (time1.slice(-2) === time2.slice(-2)) {
    return time1 === "12PM"
      ? true
      : time1.replace(/[^0-9]+/, "") < time2.replace(/[^0-9]+/, "")
      ? true
      : false;
  } else {
    return time2.slice(-2) === "PM" ? true : false;
  }
}

//return the hour portion of the date as a string in 12h AM/PM format
function AMPMformat(date) {
  var hours = date.getHours();
  var ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12;
  hours = hours ? hours : 12;
  return hours + ampm;
}
