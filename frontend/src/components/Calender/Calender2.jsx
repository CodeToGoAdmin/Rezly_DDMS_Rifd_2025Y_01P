import React, { useState, useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./Calender.css";
import EventModal from "./EventModal";
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
<div className="bg-white w-[684px] h-[922px] rounded-[16px] overflow-y-auto relative z-0" dir="rtl">
        {/* الهيدر */}
        <div className="grid grid-cols-[50px_1fr] ">
          <div className="border-l border-[#eee] w-[46px] pt-[12px]"></div>
          <div className="flex justify-between items-center px-[12px] pb-[12px] pt-[12px]">
            <div className="flex items-center gap-[12px]">
              <div className="relative">
  <button
    onClick={() => setShowDatePicker(!showDatePicker)}
    className="bg-red-500 w-[147px] h-[32px] px-[8px] py-2 rounded-lg font-semibold flex items-center gap-x-[8px] !border-0 !outline-nonebg-white w-auto h-[32px] px-[8px] py-2 rounded-[8px] font-semibold flex items-center gap-x-[8px] !border-0 !outline-none"
  >
    <img src={CalenderIcon} alt="calender" />
    <span className="font-cairo text-[14px] font-[700]">
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
                <button onClick={()=>setShowViewMenu(!showViewMenu)} className="bg-white w-[111px] h-[32px] px-[8px] py-2 rounded-[8px] font-semibold flex items-center justify-between gap-x-[12px] !border-0 !outline-none"> <img src={RightArrowIcon} alt="rightarrow" /> <span className="font-cairo text-[14px] font-[700]"> {view==="timeGridDay"?"يوم":view==="timeGridWeek"?"أسبوع":"شهر"} </span> <img src={LeftArrowIcon} alt="leftarrow" /> </button>
                {showViewMenu && (
                  <div className="absolute z-30 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-24">
                    <div className="px-3 py-2 cursor-pointer hover:bg-gray-100" onClick={()=>handleChangeView("timeGridDay")}>يوم</div>
                    <div className="px-3 py-2 cursor-pointer hover:bg-gray-100" onClick={()=>handleChangeView("timeGridWeek")}>أسبوع</div>
                    <div className="px-3 py-2 cursor-pointer hover:bg-gray-100" onClick={()=>handleChangeView("dayGridMonth")}>شهر</div>
                  </div>
                )}
              </div>
            </div>

            <div>
              <div className=" flex gap-[12px] bg-purple-600 text-white px-2 py-2 rounded-lg cursor-pointer font-bold">
                <img src={ReSizeIcon} alt="calender" onClick={() => setOpen(true)}/>
              </div>
            </div>
          </div>
        </div>

{open && (
        <div className="fixed inset-0 bg-black flex items-center justify-center z-50">
  <div className="bg-[#ffffff] rounded-2xl p-6 shadow-lg w-[400px]">
    <h2 className="text-lg font-bold mb-4">مودال مع خلفية معتمة</h2>
            <p>فتحتيني لما كبستي على الصورة 😍</p>

            <button
              onClick={() => setOpen(false)}
              className="mt-4 px-4 py-2 bg-gray-200 rounded-lg"
            >
              إغلاق
            </button>
          </div>
        </div>
      )}
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
  slotMaxTime="22:00:00"
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
  <div className="fixed inset-0 z-[9999] flex justify-center items-center bg-black/30">
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
