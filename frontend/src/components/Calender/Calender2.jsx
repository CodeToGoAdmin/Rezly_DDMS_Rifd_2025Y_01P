import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Calender.css";
import EventModal from "./EventModal.jsx";
import CalenderIcon from "../../icons/calender.svg";
import ReSizeIcon from "../../icons/resize.svg";
import DownArrowIcon from "../../icons/downarrow.svg";
import RightArrowIcon from "../../icons/rightarrow.svg";
import LeftArrowIcon from "../../icons/leftarrow.svg";
import MiniCalender from "../MiniCalender/MiniCalender";

export default function Calender2() {
  const calendarRef = useRef(null);

  const [events, setEvents] = useState([
    { id: 1, title: "تدريب شخصي", start: "2024-09-05T08:00:00", end: "2024-09-05T09:00:00", bg:"#DBEAFE", border:"#3B82F6", text:"#1E3A8A" },
    { id: 2, title: "يوغا", start: "2024-09-05T11:00:00", end: "2024-09-05T12:00:00", bg:"#EDE9FE", border:"#8B5CF6", text:"#4C1D95" },
  ]);

  const [open, setOpen] = useState(false);


  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newEvent, setNewEvent] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("timeGridDay");
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [participantsOpen, setParticipantsOpen] = useState(false);

  const colors = [
    { bg: "#DBEAFE", border: "#3B82F6", text: "#1E3A8A" },
    { bg: "#EDE9FE", border: "#8B5CF6", text: "#4C1D95" },
    { bg: "#DCFCE7", border: "#22C55E", text: "#14532D" },
    { bg: "#FEF3C7", border: "#F59E0B", text: "#92400E" },
  ];
  
  const allParticipants = ["محمود", "ليلى", "سارة", "أحمد", "خالد"];

  const nextId = () => (events.length ? Math.max(...events.map(e => e.id)) + 1 : 1);

  const handleDateSelect = (selectInfo) => {
    if (!selectInfo.startStr || !selectInfo.endStr) return;

    setNewEvent({
      id: null,
      title: "",
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      description: "",
      room: "",
      coach: "",
      participants: [],
    });
    setEditMode(false);
    setShowModal(true);
    if (calendarRef.current) calendarRef.current.getApi().unselect();
    console.log("clicked", selectInfo)
  };

  const handleEventClick = (clickInfo) => {
    const ev = clickInfo.event;
    setNewEvent({
      id: ev.id,
      title: ev.title,
      start: ev.startStr,
      end: ev.endStr,
      bg: ev.extendedProps.bg ?? "#DBEAFE",
      border: ev.extendedProps.border ?? "#3B82F6",
      text: ev.extendedProps.text ?? "#1E3A8A",
      description: ev.extendedProps.description ?? "",
      room: ev.extendedProps.room ?? "",
      coach: ev.extendedProps.coach ?? "",
      participants: ev.extendedProps.participants ?? [],
    });
    setEditMode(true);
    setShowModal(true);
  };

  // في handleSaveEvent
const handleSaveEvent = () => {
  if (!newEvent.title?.trim()) return;

  if (editMode && newEvent.id != null) {
    setEvents(events.map(ev => ev.id === newEvent.id ? { ...newEvent } : ev));
  } else {
    const id = nextId();

    // نحسب orderIndex لكل حدث في نفس الساعة
    const sameSlotEvents = events.filter(
      ev => ev.start === newEvent.start
    );
    const orderIndex = sameSlotEvents.length; // أول حدث=0، الثاني=1 ...

    setEvents([...events, { ...newEvent, id, orderIndex }]);
  }

  setShowModal(false);
  setEditMode(false);
};


  const handleDeleteEvent = () => {
    if (newEvent.id == null) { setShowModal(false); return; }
    setEvents(events.filter(ev => ev.id !== newEvent.id));
    setShowModal(false);
    setEditMode(false);
  };

  const handleDateChange = (date) => {
    setCurrentDate(date);
    setShowDatePicker(false);
    if (calendarRef.current) {
      calendarRef.current.getApi().gotoDate(date);
    }
  };

  const handleChangeView = (newView) => {
    setView(newView);
    setShowViewMenu(false);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(newView);
    }
  };

  useEffect(() => {
  console.log("showModal =", showModal);
}, [showModal]);

  const renderEvent = (eventInfo) => {
    const ev = eventInfo.event;
    const bg = ev.extendedProps.bg ?? "#DBEAFE";
    const border = ev.extendedProps.border ?? "#3B82F6";
    const text = ev.extendedProps.text ?? "#1E3A8A";


    
    return (
      <div
  className="fc--event flex flex-col justify-center items-start pl-[8px] box-border font-[Cairo] text-[10px] font-bold border-r-4"
      style={{
        background: bg,
        borderColor: border,
        color: text,
        width: "138px",   // ثابت
        height: "36px",   // ثابت
      }}
    >
      <div className="opacity-90">{eventInfo.timeText}</div>
      <div className="leading-4 truncate">{ev.title}</div>
    </div>
    );
  };

  useEffect(() => { if (!calendarRef.current) return; calendarRef.current.getApi().render(); }, [events]);

  return (
    <>
<div className="bg-white w-full h-full rounded-[16px] overflow-hidden relative z-0" dir="rtl">

        {/* الهيدر */}
        <div className="grid grid-cols-[50px_1fr] ">
          <div className="border-l border-[#eee] w-[46px] pt-[12px]"></div>
          <div className="flex justify-between items-center px-[12px] pb-[12px] pt-[12px]">
            <div className="flex items-center gap-[12px]">
              <div className="relative">
  <button
    onClick={() => setShowDatePicker(!showDatePicker)}
      className="h-[32px] w-[auto] px-2 flex items-center gap-2 rounded-[8px] font-semibold bg-white border-0 outline-none"

  >
<svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
<path d="M21 12V19C21 19.5304 20.7893 20.0391 20.4142 20.4142C20.0391 20.7893 19.5304 21 19 21H5C4.46957 21 3.96086 20.7893 3.58579 20.4142C3.21071 20.0391 3 19.5304 3 19V12H21ZM16 3C16.2652 3 16.5196 3.10536 16.7071 3.29289C16.8946 3.48043 17 3.73478 17 4V5H19C19.5304 5 20.0391 5.21071 20.4142 5.58579C20.7893 5.96086 21 6.46957 21 7V10H3V7C3 6.46957 3.21071 5.96086 3.58579 5.58579C3.96086 5.21071 4.46957 5 5 5H7V4C7 3.73478 7.10536 3.48043 7.29289 3.29289C7.48043 3.10536 7.73478 3 8 3C8.26522 3 8.51957 3.10536 8.70711 3.29289C8.89464 3.48043 9 3.73478 9 4V5H15V4C15 3.73478 15.1054 3.48043 15.2929 3.29289C15.4804 3.10536 15.7348 3 16 3Z" fill="var(--color-purple)"/>
</svg>
  <span className="font-cairo text-[14px] font-bold text-black">
  {currentDate.toLocaleDateString("ar-en", {
    day: "numeric",
    month: "short",
  })}
</span>

    <img src={DownArrowIcon} alt="downarrow" />
  </button>

  {showDatePicker && (
    <div className="absolute top-full left-0 z-30">
      <MiniCalender
        currentDate={currentDate}
        handleDateChange={handleDateChange}
      />
    </div>
  )}
</div>


              <div className="relative">
                <button onClick={()=>setShowViewMenu(!showViewMenu)} className="bg-white w-[111px] h-[32px] px-[8px] py-2 rounded-[8px] font-semibold flex items-center justify-between gap-x-[12px] !border-0 !outline-none"> 
                  <img src={RightArrowIcon} alt="rightarrow" /> 
                  <span className="font-cairo text-[14px] font-[700] text-black"> {view==="timeGridDay"?"يوم":view==="timeGridWeek"?"أسبوع":"شهر"} </span> <img src={LeftArrowIcon} alt="leftarrow" /> </button>
                {showViewMenu && (
                  <div className="absolute z-30 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-24">
                    <div className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-black" onClick={()=>handleChangeView("timeGridDay")}>يوم</div>
                    <div className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-black" onClick={()=>handleChangeView("timeGridWeek")}>أسبوع</div>
                    <div className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-black" onClick={()=>handleChangeView("dayGridMonth")}>شهر</div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div>
                <svg width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg" onClick={() => setOpen(true)}>
<rect width="30" height="30" rx="8" fill="var(--color-purple)"/>
<path d="M12.9717 15.9697C13.2646 15.6769 13.7393 15.6769 14.0322 15.9697C14.3251 16.2626 14.3251 16.7374 14.0322 17.0303L7.82031 23.2432C7.94988 23.2368 8.08612 23.2274 8.22656 23.2158C8.6184 23.1834 9.01872 23.1355 9.38965 23.0908C9.41867 23.0873 9.44792 23.0835 9.47656 23.0801C9.84972 23.0352 10.2292 22.99 10.4893 22.9863C10.9034 22.9804 11.2441 23.3115 11.25 23.7256C11.2559 24.1397 10.9249 24.4804 10.5107 24.4863C10.3487 24.4886 10.0622 24.5204 9.65527 24.5693C9.62561 24.5729 9.59499 24.5764 9.56445 24.5801C9.19815 24.6242 8.77166 24.6761 8.35059 24.7109C7.89857 24.7483 7.41888 24.769 6.99902 24.7354C6.78877 24.7185 6.57007 24.6867 6.36621 24.625C6.16881 24.5652 5.93112 24.4613 5.73633 24.2666C5.54146 24.0717 5.43773 23.8332 5.37793 23.6357C5.31624 23.4319 5.28344 23.2131 5.2666 23.0029C5.23303 22.5833 5.25467 22.1041 5.29199 21.6523C5.3268 21.2311 5.37773 20.8039 5.42188 20.4375C5.42554 20.4071 5.43004 20.3772 5.43359 20.3477C5.48248 19.9409 5.51427 19.6543 5.5166 19.4922C5.52249 19.0782 5.86241 18.7473 6.27637 18.7529C6.69054 18.7588 7.02249 19.0995 7.0166 19.5137C7.01286 19.7738 6.96768 20.1533 6.92285 20.5264C6.91941 20.555 6.9156 20.5843 6.91211 20.6133C6.86746 20.9841 6.81948 21.3837 6.78711 21.7754C6.77547 21.9163 6.76609 22.0527 6.75977 22.1826L12.9717 15.9697ZM23.001 5.2666C23.2112 5.28346 23.43 5.31622 23.6338 5.37793C23.8312 5.43775 24.069 5.5416 24.2637 5.73633C24.4584 5.93112 24.5623 6.16879 24.6221 6.36621C24.6838 6.57009 24.7165 6.78875 24.7334 6.99902C24.767 7.41888 24.7454 7.89857 24.708 8.35059C24.6732 8.77166 24.6213 9.19814 24.5771 9.56445C24.5735 9.59499 24.57 9.62561 24.5664 9.65527C24.5175 10.0622 24.4857 10.3487 24.4834 10.5107C24.4775 10.9249 24.1368 11.2559 23.7227 11.25C23.3086 11.244 22.9775 10.9033 22.9834 10.4893C22.9871 10.2292 23.0323 9.84971 23.0771 9.47656C23.0806 9.44792 23.0844 9.41866 23.0879 9.38965C23.1326 9.01872 23.1805 8.6184 23.2129 8.22656C23.2246 8.08489 23.2339 7.94798 23.2402 7.81738L17.0322 14.0264C16.7394 14.3192 16.2646 14.3192 15.9717 14.0264C15.6788 13.7335 15.6788 13.2587 15.9717 12.9658L22.1768 6.75977C22.0478 6.76608 21.9122 6.77557 21.7725 6.78711C21.3808 6.81948 20.9811 6.86746 20.6104 6.91211C20.5813 6.9156 20.5521 6.91941 20.5234 6.92285C20.1503 6.96768 19.7708 7.01287 19.5107 7.0166C19.0966 7.02249 18.7559 6.69054 18.75 6.27637C18.7444 5.86241 19.0752 5.52249 19.4893 5.5166C19.6514 5.51428 19.9378 5.48249 20.3447 5.43359C20.3743 5.43004 20.4042 5.42554 20.4346 5.42187C20.801 5.37773 21.2282 5.3268 21.6494 5.29199C22.1014 5.25465 22.5812 5.23298 23.001 5.2666Z" fill="white"/>
</svg>

              </div>
            </div>
          </div>
        </div>


        {/* الكاليندر */}
       <FullCalendar
  ref={calendarRef}
  plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
  initialView={view}
  selectable={true}
  selectMirror={true}
  select={handleDateSelect}
  eventClick={handleEventClick}
  events={events}
  headerToolbar={false}
  slotMinTime="08:00:00"
  slotMaxTime="24:00:00"
  slotDuration="01:00:00"
  allDaySlot={false}
  locale="ar"
  direction="rtl"
  selectOverlap={true}
  eventOverlap={true}        // مهم للأحداث المتداخلة
  slotEventOverlap={true}    // مهم للأحداث بنفس الصف
  eventOrder={(a,b) => a.id - b.id} // ترتيب حسب الإضافة
  height="100%"
  eventContent={renderEvent}
   slotLabelContent={(arg) => {
    let hours = arg.date.getHours();     // 0-23
    let displayHour = hours % 12 === 0 ? 12 : hours % 12; // 12h format
    return displayHour + ":00";
  }}
  eventDidMount={(info) => {
  const el = info.el;
  const idx = info.event.extendedProps.orderIndex ?? 0;

  el.style.position = "absolute";
  el.style.top = "0px";
  el.style.left = `${idx * (138 + 12)}px`; // 138px عرض الحدث + 12px فراغ
  el.style.width = "138px";
  el.style.height = "36px";
}}
/>

      </div>

      {/* مودال الحدث */}
      {showModal && (
  <div className="fixed inset-0 z-[9999] flex justify-center items-center">
    <EventModal
      newEvent={newEvent}
      setNewEvent={setNewEvent}
      handleSaveEvent={handleSaveEvent}
      handleDeleteEvent={handleDeleteEvent}
      participantsOpen={participantsOpen}
      setParticipantsOpen={setParticipantsOpen}
      allParticipants={allParticipants}
      closeModal={() => setShowModal(false)}
    />
  </div>
)}

    </>
  );
}
