"use client"
import React from "react";
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { eventsData } from "@/lib/data";

const localizer = momentLocalizer(moment);

const BigCalendar = () => {
  return (
    <div>
      <Calendar
        localizer={localizer}
        events={eventsData}
        startAccessor="startTime"
        endAccessor="endTime"
        style={{ height: 500 }}
      />
    </div>
  );
};

export default BigCalendar;
