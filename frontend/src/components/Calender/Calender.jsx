import React, { useState, useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import MiniCalender from "../MiniCalender/MiniCalender.jsx";
import EventModal from "./EventModal.jsx";
import ConfirmDeleteModal from "./ConfirmDeleteModal.jsx";
import "./Calender.css";

import CalenderIcon from "../../icons/calender.svg";
import ReSizeIcon from "../../icons/resize.svg";
import DownArrowIcon from "../../icons/downarrow.svg";
import RightArrowIcon from "../../icons/rightarrow.svg";
import LeftArrowIcon from "../../icons/leftarrow.svg";

export default function Calender() {
  const calendarRef = useRef(null);

  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [newEvent, setNewEvent] = useState({});
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [view, setView] = useState("timeGridDay");
  const [showViewMenu, setShowViewMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [fullScreenMode, setFullScreenMode] = useState(false);

  const nextId = () =>
    events.length
      ? String(Math.max(...events.map((e) => Number(e.id))) + 1)
      : "1";

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
      bg: "#DBEAFE",
      border: "#3B82F6",
      text: "#1E3A8A",
      repeat: "",
      days: [],
      reminder: "30",
      reminderName: "قبل 30 دقيقة",
    });
    setEditMode(false);
    setShowModal(true);
    if (calendarRef.current) calendarRef.current.getApi().unselect();
  };

  const handleEventClick = (clickInfo) => {
    const ev = clickInfo.event;
    setNewEvent({
      id: String(ev.id),
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
      repeat: ev.extendedProps.repeat ?? "",
      days: ev.extendedProps.days ?? [],
      reminder: ev.extendedProps.reminder ?? "30",
      reminderName: ev.extendedProps.reminderName ?? "قبل 30 دقيقة",
    });
    setEditMode(true);
    setShowModal(true);
  };

  const handleSaveEvent = () => {
    if (!newEvent.title?.trim()) return;
    if (editMode && newEvent.id != null) {
      setEvents(
        events.map((ev) => (ev.id === newEvent.id ? { ...newEvent } : ev))
      );
    } else {
      const id = nextId();
      setEvents([...events, { ...newEvent, id }]);
    }
    setShowModal(false);
    setEditMode(false);
  };

  const handleDeleteClick = () => setShowDeleteConfirm(true);

  const handleConfirmDelete = () => {
    setEvents(events.filter((ev) => ev.id !== newEvent.id));
    setShowDeleteConfirm(false);
    setShowModal(false);
  };

  const handleCancelDelete = () => setShowDeleteConfirm(false);

  const handleDateChange = (date) => {
    setCurrentDate(date);
    setShowDatePicker(false);
    if (calendarRef.current) calendarRef.current.getApi().gotoDate(date);
  };

  const handleChangeView = (newView) => {
    setView(newView);
    setShowViewMenu(false);
    if (calendarRef.current) {
      calendarRef.current.getApi().changeView(newView);
    }
  };

  const renderEvent = (eventInfo) => {
    const ev = eventInfo.event;
    const bg = ev.extendedProps.bg ?? "#DBEAFE";
    const border = ev.extendedProps.border ?? "#3B82F6";
    const text = ev.extendedProps.text ?? "#1E3A8A";
    return (
      <div
        className="flex flex-col justify-center items-start pl-2 box-border font-[Cairo] text-[10px] sm:text-xs md:text-sm font-bold border-r-4 w-full h-full truncate"
        style={{ background: bg, borderColor: border, color: text }}
      >
        <div className="opacity-90">{eventInfo.timeText}</div>
        <div className="leading-4 truncate">{ev.title}</div>
      </div>
    );
  };

  return (
    <>
      <div
        className={`${
          fullScreenMode
            ? "fixed inset-0 z-50 p-4 bg-white flex flex-col"
            : "relative w-full h-full"
        }`}
      >
        <div
          className="bg-white rounded-[16px] overflow-hidden flex-1 flex flex-col"
          dir="rtl"
        >
          {/* الهيدر */}
          <div className="grid grid-cols-[50px_1fr]">
            <div className="border-l border-[#eee] w-[46px] pt-[12px]"></div>
            <div className="flex justify-between items-center px-[12px] pb-[12px] pt-[12px]">
              <div className="flex items-center gap-[12px]">
                <div className="relative">
                  <button
                    onClick={() => setShowDatePicker(!showDatePicker)}
                    className="h-[32px] w-auto px-2 flex items-center gap-2 rounded-[8px] font-semibold bg-white border-0 outline-none"
                  >
                    <img src={CalenderIcon} alt="calender" />
                    <span className="font-cairo text-[14px] font-bold text-black truncate">
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
                  <button
                    onClick={() => setShowViewMenu(!showViewMenu)}
                    className="bg-white w-[111px] h-[32px] px-[8px] py-2 rounded-[8px] font-semibold flex items-center justify-between gap-x-[12px] !border-0 !outline-none"
                  >
                    <img src={RightArrowIcon} alt="rightarrow" />
                    <span className="font-cairo text-[14px] font-[700] text-black">
                      {view === "timeGridDay"
                        ? "يوم"
                        : view === "timeGridWeek"
                        ? "أسبوع"
                        : "شهر"}
                    </span>
                    <img src={LeftArrowIcon} alt="leftarrow" />
                  </button>
                  {showViewMenu && (
                    <div className="absolute z-30 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg w-24">
                      <div
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-black"
                        onClick={() => handleChangeView("timeGridDay")}
                      >
                        يوم
                      </div>
                      <div
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-black"
                        onClick={() => handleChangeView("timeGridWeek")}
                      >
                        أسبوع
                      </div>
                      <div
                        className="px-3 py-2 cursor-pointer hover:bg-gray-100 text-black"
                        onClick={() => handleChangeView("dayGridMonth")}
                      >
                        شهر
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div>
                <img
                  src={ReSizeIcon}
                  alt="calender"
                  className="cursor-pointer"
                  onClick={() => {
                    setFullScreenMode(!fullScreenMode);
                    if (calendarRef.current) {
                      const api = calendarRef.current.getApi();
                      setTimeout(() => {
                        api.removeAllEvents();
                        api.addEventSource(events); // بعيد إضافة كل الأحداث
                        api.render();
                      }, 0);
                    }
                  }}
                />
              </div>
            </div>
          </div>

          {/* الكاليندر */}
          <FullCalendar
            key={fullScreenMode ? "fullscreen" : "dashboard"}
            height={fullScreenMode ? "100%" : "auto"}
            contentHeight={fullScreenMode ? "100%" : "auto"}
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
            eventMaxStack={
              fullScreenMode
                ? 10 // عرض 10 أحداث أقصى حد بالصف الواحد في صفحة الكاليندر الموسعة
                : 4 // عرض 4 أحداث أقصى حد في الكاليندر بالداشبورد
            }
            eventDisplay={fullScreenMode ? "auto" : "auto"}
            allDaySlot={false}
            locale="ar"
            direction="rtl"
            selectOverlap={true}
            eventOverlap={true}
            slotEventOverlap={true}
            slotLabelContent={(arg) =>
              arg.date
                .toLocaleTimeString("en-US", {
                  hour: "numeric",
                  minute: "2-digit",
                  hour12: true,
                })
                .replace("AM", "")
                .replace("PM", "")
                .trim()
            }
            eventOrder={(a, b) => Number(a.id) - Number(b.id)}
            eventContent={renderEvent}
          />
        </div>
      </div>

      {/* مودال الحدث */}
      {showModal && (
        <EventModal
          newEvent={newEvent}
          setNewEvent={setNewEvent}
          handleSaveEvent={handleSaveEvent}
          handleDeleteClick={handleDeleteClick}
          closeModal={() => setShowModal(false)}
        />
      )}

      {/* تأكيد الحذف */}
      {showDeleteConfirm && (
        <ConfirmDeleteModal
          onCancel={handleCancelDelete}
          onConfirm={handleConfirmDelete}
          event={newEvent}
        />
      )}
    </>
  );
}
