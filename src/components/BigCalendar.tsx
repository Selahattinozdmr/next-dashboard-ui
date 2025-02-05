"use client"
import React, { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css"
import { Calendar, momentLocalizer, View, Views } from "react-big-calendar";
import moment from "moment";

const localizer = momentLocalizer(moment);

const BigCalendar = ({data}:{data:{title:string,start:Date,end:Date}[]}) => {
  const [view,setView]= useState<View>(Views.WORK_WEEK)
  const handleChangeView=(selectedView:View)=>{
    setView(selectedView)
  }
  return (
      <Calendar
        localizer={localizer}
        startAccessor="start"
        endAccessor="end"
        events={data}
        views={["work_week", "day"]}
        view={view}
        style={{ height: "98%" }}
        onView={handleChangeView}
        min={new Date(2025,1,1,8,0,0)}
        max={new Date(2025,1,20,17,0,0)}
      />
  );
};

export default BigCalendar;
