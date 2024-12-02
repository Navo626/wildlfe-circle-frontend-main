import {Calendar} from "@fullcalendar/core";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import listPlugin from "@fullcalendar/list";
import interactionPlugin from "@fullcalendar/interaction";
import {useEffect, useRef} from "react";
import PropTypes from "prop-types";

const EventCalendar = ({ data, onEventClick }) => {
  const calendarRef = useRef(null);
  const today = new Date().toISOString().split("T")[0];

  useEffect(() => {
    const calendar = new Calendar(calendarRef.current, {
      plugins: [dayGridPlugin, timeGridPlugin, listPlugin, interactionPlugin],
      now: today,
      initialView: "dayGridMonth",
      events: [...data],
      headerToolbar: {
        left: "prev,next today",
        center: "title",
        right: "dayGridMonth,timeGridWeek,timeGridDay",
      },
      buttonText: {
        today: "Today",
        month: "Month",
        week: "Week",
        day: "Day",
      },
      editable: false,
      selectable: true,
      selectMirror: true,
      dayMaxEvents: true,
      eventClick: function (arg) {
        onEventClick(arg.event);
      },
    });
    calendar.render();
  }, [onEventClick, today]);

  return (
    <>
      <div ref={calendarRef} />
    </>
  );
};

EventCalendar.propTypes = {
  data: PropTypes.array,
  onEventClick: PropTypes.func.isRequired,
};

export default EventCalendar;
