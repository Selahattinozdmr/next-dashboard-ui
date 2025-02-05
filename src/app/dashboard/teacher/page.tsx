import Announcement from '@/components/Announcement'
import BigCalendar from '@/components/BigCalendar'
import BigCalendarContainer from '@/components/BigCalendarContainer'
import EventCalendar from '@/components/EventCalendar'
import { auth } from '@clerk/nextjs/server'
import React from 'react'

const TeacherPage =async () => {
  
  const {userId}=await auth()
  return (
    <div className="flex-1 p-4 flex gap-4 flex-col xl:flex-row">
    {/* LEFT */}
    <div className="w-full xl:w-2/3">
      <div className=" h-full bg-white rounded-md  p-4">
        <h1 className=" text-xl font-semibold">Schedule </h1>
        <BigCalendarContainer type='teacherId' id={userId!}/>
      </div>
    </div>
    {/* RIGHT */}
      <div className="w-full xl:w-1/3 flex flex-col gap-8">
        <Announcement />
      </div>
  </div>
  )
}

export default TeacherPage