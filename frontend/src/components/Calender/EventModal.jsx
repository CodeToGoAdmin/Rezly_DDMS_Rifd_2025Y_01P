import React, { useState } from "react";
import MiniCalender from "../MiniCalender/MiniCalender";
import DeleteIcon from "../../icons/Delete.svg";
import leftarrowIcon from "../../icons/arrow-left.svg";
import addressIcon from "../../icons/address.svg";
import discIcon from "../../icons/disc.svg";
import calenderIcon from "../../icons/calender.svg";
import hourIcon from "../../icons/hour.svg";
import CloseIcon from "../../icons/close.svg";
import locationIcon from "../../icons/location.svg";
import downarrowIcon from "../../icons/downarrow.svg";
import searchIcon from "../../icons/search.svg";
import membersIcon from "../../icons/members.svg";
import trainerIcon from "../../icons/trainer.svg";
import colorIcon from "../../icons/color.svg";
import notificationIcon from "../../icons/notification.svg";
import muteIcon from "../../icons/mute.svg";
import addcircleIcon from "../../icons/addcircle.svg";

export default function EventModal({
  newEvent,
  setNewEvent,
  handleSaveEvent,
  handleDeleteClick,
  closeModal,
}) {
  const members = ["مشترك 1", "مشترك 2", "مشترك 3", "مشترك 4", "مشترك 5"];

  const [showCalendar, setShowCalendar] = useState(false);
  const [openCoach, setOpenCoach] = useState(false);
  const [coachSearch, setCoachSearch] = useState("");
  const [openMembers, setOpenMembers] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [openLocation, setOpenLocation] = useState(false);

  const days = [
    "السبت",
    "الأحد",
    "الاثنين",
    "الثلاثاء",
    "الأربعاء",
    "الخميس",
    "الجمعة",
  ];
  const coaches = [
    "مريم محمد",
    "معاذ حجاوي",
    "أحمد علي",
    "سارة يوسف",
    "حنين",
    "بيان",
  ];
  const locations = ["القاعة 1", "القاعة 2", "القاعة 3", "القاعة 4"];

  const [openReminder, setOpenReminder] = useState(false);

  const handleDateChange = (date) => {
    const dateString = date.toISOString().split("T")[0];
    setNewEvent({
      ...newEvent,
      start: dateString + "T08:00:00",
      end: dateString + "T09:00:00",
    });
    setShowCalendar(false);
  };

  const getTimeString = (dt) => {
    if (!dt) return "";
    if (dt instanceof Date) return dt.toTimeString().slice(0, 5);
    if (typeof dt === "string" && dt.includes("T"))
      return dt.split("T")[1].slice(0, 5);
    return "";
  };

  const getDateString = (dt) => {
    if (!dt) return "";
    if (dt instanceof Date) return dt.toISOString().split("T")[0];
    if (typeof dt === "string" && dt.includes("T")) return dt.split("T")[0];
    return "";
  };

  return (
    <div className="fixed inset-0 z-[4000] flex justify-center items-center">
      <div className="w-[361px] h-full bg-white rounded-[16px] flex flex-col overflow-hidden p-6 gap-2 shadow-[7.5px_1.5px_25px_rgba(0,0,0,0.25)] text-right text-black text-base font-cairo font-bold leading-6 break-words">
        {/* الهيدر */}
        <div className="w-full h-8 flex items-center justify-between">
          <h3 className="text-right text-black text-[16px] font-['Cairo'] font-bold leading-[24px]">
            تفاصيل الموعد
          </h3>
          <div className="flex w-18 h-full gap-2 flex items-center justify-between">
            <img
              className="w-8 h-8 object-contain"
              src={DeleteIcon}
              alt="delete"
              onClick={() => {
                if (!newEvent?.id) return;
                handleDeleteClick();
              }}
            />
            <div className="w-8 h-8 flex items-center justify-center">
              <img
                className="max-w-full max-h-full"
                src={CloseIcon}
                alt="close"
                onClick={closeModal}
              />
            </div>
          </div>
        </div>

        {/* المحتوى */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">
          {/* العنوان */}
          <div>
            <label className="block font-bold text-sm w-full h-[18px] mb-2">
              العنوان
            </label>
            <div className="relative flex items-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-2">
                <path d="M5.99805 12.7032L5.12891 13.5724C4.53647 14.1646 3.73317 14.4972 2.89551 14.4972H2C1.72386 14.4972 1.5 14.2733 1.5 13.9972V13.1046C1.5 12.2668 1.83251 11.4628 2.4248 10.8702L3.29492 10.0001L5.99805 12.7032ZM7.66504 11.0363L6.70605 11.9962L4.00293 9.29309L4.96191 8.33313L7.66504 11.0363ZM11.4551 1.84094C11.9102 1.38576 12.6487 1.38647 13.1035 1.84192L14.1602 2.89954C14.6144 3.35459 14.6139 4.09235 14.1592 4.547L8.37305 10.3322L5.66895 7.62805L11.4551 1.84094Z" fill="  var(--color-purple)
"/>
              </svg>
              <input
                type="text"
                value={newEvent.title || ""}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, title: e.target.value })
                }
                placeholder="مثال: يوغا"
                className="h-10 pr-8 pl-2 w-full rounded-md border border-[#7E818C] border-solid focus:outline-none"
              />
            </div>
          </div>

          {/* الوصف */}
          <div>
            <label className="block font-bold text-sm w-full h-[18px] mb-2">
              الوصف (اختياري)
            </label>
            <div className="relative flex items-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-2">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M3.45329 1.5C2.37329 1.5 1.5 2.37329 1.5 3.45329V12.5534C1.5 13.6267 2.37329 14.5 3.45329 14.5H9.29997C9.4733 14.5 9.63993 14.4333 9.75993 14.3066L14.3066 9.75993C14.4333 9.63993 14.5 9.4733 14.5 9.29997V3.45329C14.5 2.37329 13.6266 1.5 12.5533 1.5H3.45329ZM13.2 9.03337L9.03328 13.2V10.0334C9.03328 9.48003 9.47995 9.03337 10.0333 9.03337H13.2Z" fill="  var(--color-purple)
"/>
              </svg>
              <textarea
                value={newEvent.description || ""}
                onChange={(e) =>
                  setNewEvent({ ...newEvent, description: e.target.value })
                }
                placeholder="....."
                className="h-10 pr-8 pl-2 w-full rounded-md border border-[#7E818C] border-solid focus:outline-none "
              />
            </div>
          </div>

          {/* التاريخ */}
          <div>
            <label className="block font-bold text-sm w-full h-[18px] mb-2 ">التاريخ</label>
            <div className="relative flex items-center">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-2 ">
                <path d="M14 8V12.6667C14 13.0203 13.8595 13.3594 13.6095 13.6095C13.3594 13.8595 13.0203 14 12.6667 14H3.33333C2.97971 14 2.64057 13.8595 2.39052 13.6095C2.14048 13.3594 2 13.0203 2 12.6667V8H14ZM10.6667 2C10.8435 2 11.013 2.07024 11.1381 2.19526C11.2631 2.32029 11.3333 2.48986 11.3333 2.66667V3.33333H12.6667C13.0203 3.33333 13.3594 3.47381 13.6095 3.72386C13.8595 3.97391 14 4.31304 14 4.66667V6.66667H2V4.66667C2 4.31304 2.14048 3.97391 2.39052 3.72386C2.64057 3.47381 2.97971 3.33333 3.33333 3.33333H4.66667V2.66667C4.66667 2.48986 4.7369 2.32029 4.86193 2.19526C4.98695 2.07024 5.15652 2 5.33333 2C5.51014 2 5.67971 2.07024 5.80474 2.19526C5.92976 2.32029 6 2.48986 6 2.66667V3.33333H10V2.66667C10 2.48986 10.0702 2.32029 10.1953 2.19526C10.3203 2.07024 10.4899 2 10.6667 2Z" fill="  var(--color-purple)
"/>
              </svg>
              <input
                type="text"
                value={getDateString(newEvent.start)}
                readOnly
                className="h-10 pr-8 pl-2 w-full rounded-md border border-[#7E818C] border-solid focus:outline-none"
                onClick={() => setShowCalendar(!showCalendar)}
              />
              {showCalendar && (
                <div className="absolute top-full left-0 mt-2 z-30 w-60">
                  <MiniCalender
                    currentDate={
                      newEvent.start ? new Date(newEvent.start) : new Date()
                    }
                    handleDateChange={handleDateChange}
                  />
                </div>
              )}
            </div>
          </div>

          {/* الوقت */}
          <div>
            <label className="block font-bold text-sm w-full h-[18px] mb-2">
              الوقت
            </label>
            <div className="flex items-center gap-2">
              {/* بداية */}
              <div className="relative w-[136px] h-11">
                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-2 top-1/2 -translate-y-1/2">
                  <path d="M8.5 0C12.9183 1.61064e-08 16.5 3.58172 16.5 8C16.5 12.4183 12.9183 16 8.5 16C4.08172 16 0.5 12.4183 0.5 8C0.5 3.58172 4.08172 0 8.5 0ZM8.5 4.2793C8.089 4.2793 7.75586 4.61243 7.75586 5.02344V8C7.75586 8.19737 7.83407 8.38681 7.97363 8.52637L9.46191 10.0146C9.75254 10.3053 10.224 10.3053 10.5146 10.0146C10.8053 9.72403 10.8053 9.25254 10.5146 8.96191L9.24414 7.69141V5.02344C9.24414 4.61243 8.911 4.2793 8.5 4.2793Z" fill="  var(--color-purple)
"/>
                </svg>
                <select
                  value={getTimeString(newEvent.start)}
                  onChange={(e) => {
                    const datePart =
                      getDateString(newEvent.start) ||
                      new Date().toISOString().split("T")[0];
                    const newStart = `${datePart}T${e.target.value}`;

                    // ضبط النهاية افتراضي 1 ساعة بعد البداية
                    const [hour, minute] = e.target.value
                      .split(":")
                      .map(Number);
                    let endHour = hour + 1;
                    if (endHour > 24) endHour = 24;
                    const endValue = `${String(endHour).padStart(
                      2,
                      "0"
                    )}:${minute.toString().padStart(2, "0")}`;
                    setNewEvent({
                      ...newEvent,
                      start: newStart,
                      end: endValue,
                    });
                  }}
                  className="h-10 pr-8 pl-2 w-full rounded-md border border-[#7E818C] border-solid focus:outline-none appearance-none"
                >
                  {Array.from({ length: 16 }, (_, idx) => {
                    const i = idx + 8; // 08:00 ص - 23:00 م
                    const hour = i % 12 === 0 ? 12 : i % 12;
                    const suffix = i < 12 ? "ص" : "م";
                    const label = `${hour}:00 ${suffix}`;
                    const value = String(i).padStart(2, "0") + ":00";
                    return (
                      <option key={i} value={value}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>
              <svg width="25" height="24" viewBox="0 0 25 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M8.79297 6.29297C9.18349 5.90247 9.81651 5.90246 10.207 6.29297C10.5975 6.68349 10.5975 7.31651 10.207 7.70703L6.91406 11H20.5C21.0523 11 21.5 11.4477 21.5 12C21.5 12.5523 21.0523 13 20.5 13H6.91406L10.207 16.293C10.5976 16.6835 10.5976 17.3165 10.207 17.707C9.81651 18.0976 9.18349 18.0976 8.79297 17.707L3.79297 12.707C3.69263 12.6067 3.61811 12.4904 3.56934 12.3662C3.52584 12.2556 3.50114 12.1346 3.5 12.0088V11.9971C3.50041 11.8551 3.53022 11.7199 3.58398 11.5977C3.6236 11.5074 3.67756 11.4214 3.74512 11.3438C3.7619 11.3245 3.77965 11.306 3.79785 11.2881L8.79297 6.29297Z" fill="  var(--color-purple)
"/>
              </svg>
              {/* نهاية */}
              <div className="relative w-[136px] h-11">
                <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-2 top-1/2 -translate-y-1/2">
                  <path d="M8.5 0C12.9183 1.61064e-08 16.5 3.58172 16.5 8C16.5 12.4183 12.9183 16 8.5 16C4.08172 16 0.5 12.4183 0.5 8C0.5 3.58172 4.08172 0 8.5 0ZM8.5 4.2793C8.089 4.2793 7.75586 4.61243 7.75586 5.02344V8C7.75586 8.19737 7.83407 8.38681 7.97363 8.52637L9.46191 10.0146C9.75254 10.3053 10.224 10.3053 10.5146 10.0146C10.8053 9.72403 10.8053 9.25254 10.5146 8.96191L9.24414 7.69141V5.02344C9.24414 4.61243 8.911 4.2793 8.5 4.2793Z" fill="  var(--color-purple)
"/>
                </svg>                <select
                  value={newEvent.end ? newEvent.end.split("T")[1]?.slice(0, 5) : ""}
                  onChange={(e) => {
                    const datePart =
                      getDateString(newEvent.start) ||
                      new Date().toISOString().split("T")[0];
                    setNewEvent({
                      ...newEvent,
                      end: `${datePart}T${e.target.value}`,
                    });
                  }}
                  className="h-10 pr-8 pl-2 w-full rounded-md border border-[#7E818C] border-solid focus:outline-none appearance-none"
                >
                  {Array.from({ length: 17 }, (_, idx) => {
                    const i = idx + 8; // 08:00 ص - 24:00 منتصف الليل
                    const hour = i % 12 === 0 ? 12 : i % 12;
                    const suffix = i < 12 ? "ص" : "م";
                    const label = i === 24 ? "12:00 م" : `${hour}:00 ${suffix}`;
                    const value =
                      i === 24 ? "24:00" : String(i).padStart(2, "0") + ":00";
                    return (
                      <option key={i} value={value}>
                        {label}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>
          </div>

          {/* المكان */}
          <div className="relative">
            <label className="block font-bold text-sm w-full h-[18px] mb-2">
              المكان
            </label>
            <div
              className="w-full h-10 border border-[#7E818C] rounded-md flex items-center justify-between cursor-pointer relative"
              onClick={() => setOpenLocation(!openLocation)}
            >
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="absolute right-2">
                <path fill-rule="evenodd" clip-rule="evenodd" d="M7.99984 0.833313C4.77346 0.833313 2.1665 3.4738 2.1665 6.72042C2.1665 8.58361 2.90945 10.037 4.33489 11.3002C5.26228 12.122 6.9282 13.8693 7.57292 14.9268C7.66223 15.0733 7.82044 15.1638 7.992 15.1665C8.16357 15.1692 8.32453 15.0837 8.41839 14.9401C9.10478 13.8897 10.7463 12.1141 11.6648 11.3002C13.0902 10.037 13.8332 8.58361 13.8332 6.72042C13.8332 3.4738 11.2262 0.833313 7.99984 0.833313ZM8.02327 8.99998C9.31194 8.99998 10.3566 7.95531 10.3566 6.66665C10.3566 5.37798 9.31194 4.33331 8.02327 4.33331C6.73461 4.33331 5.68994 5.37798 5.68994 6.66665C5.68994 7.95531 6.73461 8.99998 8.02327 8.99998Z" fill="  var(--color-purple)
"/>
              </svg>
              <span className="h-10 pr-8 pl-2 w-full flex items-center">
                {newEvent.room || "اختر المكان"}
              </span>
              <img
                src={downarrowIcon}
                alt="downarrow"
                className="absolute left-2"
              />
            </div>

            {openLocation && (
              <div className="absolute top-full left-0 w-full bg-white rounded-[16px] border border-gray-500/40 mt-1 shadow-[0_4px_12px_rgba(0,0,0,0.25)] z-50 text-[#000000]">
                <div className="w-full h-full p-4 box-border overflow-y-auto">
                  <div
                    className="flex items-center h-[32px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-[rgba(126,129,140,0.4)]"
                    onClick={() => console.log("فتح واجهة إضافة جديد")}
                  >
                    <div className="flex items-center gap-2">
                      <img src={addcircleIcon} alt="add" className="w-4 h-4" />
                      <span className="text-gray-800 font-normal">
                        إضافة جديد
                      </span>
                    </div>
                  </div>
                  {locations.map((location, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between h-[32px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-[rgba(126,129,140,0.4)] last:border-b-0"
                      onClick={() => {
                        setNewEvent({ ...newEvent, room: location });
                        setOpenLocation(false);
                      }}
                    >
                      <span className={selectedLocation === location ? "font-bold text-black" : "font-normal text-gray-800"}>{location}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center border-purple`}>
                        {selectedLocation === location && (
                          <div className="w-3 h-3 rounded-full bg-purple flex items-center justify-center"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* المدرب */}
          <div className="relative">
            <label className="block font-bold text-sm w-full h-[18px] mb-2">
              المدرب
            </label>
            <div
              className="w-full h-10 border border-[#7E818C] rounded-md flex items-center justify-between cursor-pointer relative"
              onClick={() => setOpenCoach(!openCoach)}
            >
              <img
                src={trainerIcon}
                alt="trainer"
                className="absolute right-2"
              />
              <span className="h-10 pr-8 pl-2 w-full flex items-center">
                {newEvent.coach || "اختر المدرب"}
              </span>
              <img
                src={downarrowIcon}
                alt="downarrow"
                className="absolute left-2"
              />
            </div>

            {openCoach && (
              <div className="absolute top-full left-0 w-full bg-white rounded-[16px] border border-gray-500/40 mt-1 shadow-[0_4px_12px_rgba(0,0,0,0.25)] z-50 text-[#000000]">
                <div className="w-full h-full p-4 box-border overflow-y-auto">
                  <div className="relative w-full h-[30px] mb-2">
                    <input
                      type="text"
                      placeholder="ابحث عن مدرب..."
                      value={coachSearch}
                      onChange={(e) => setCoachSearch(e.target.value)}
                      className="w-full h-full rounded-[8px] border border-gray-500 px-3 pr-10 focus:outline-none placeholder-gray-400 text-gray-800"
                    />
                    <img
                      src={searchIcon}
                      alt="search"
                      className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5"
                    />
                  </div>
                  {coaches
                    .filter((c) =>
                      c.toLowerCase().includes(coachSearch.toLowerCase())
                    )
                    .map((coach, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between h-[32px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-[rgba(126,129,140,0.4)] last:border-b-0"
                        onClick={() => {
                          setNewEvent({ ...newEvent, coach });
                          setOpenCoach(false);
                          setCoachSearch("");
                        }}
                      >
                        <span
                          className={
                            newEvent.coach === coach
                              ? "font-bold text-black"
                              : "font-normal text-gray-800"
                          }
                        >
                          {coach}
                        </span>
                        <div
                          className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${newEvent.coach === coach
                              ? "border-[#6A0EAD]"
                              : "border-gray-400"
                            }`}
                        >
                          {newEvent.coach === coach && (
                            <div className="w-3 h-3 rounded-full bg-[#6A0EAD]"></div>
                          )}
                        </div>
                      </div>
                    ))}
                  {coaches.filter((c) => c.includes(coachSearch)).length ===
                    0 && (
                      <div className="px-3 py-2 text-gray-400 font-normal">
                        لا يوجد مدربين
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>

          {/* المشتركين */}
          <div className="relative">
            <label className="block font-bold text-sm w-full h-[18px] mb-2">
              المشتركين
            </label>

            {/* صندوق الاختيار */}
            <div
              className="w-full h-10 border border-[#7E818C] rounded-md flex items-center justify-between cursor-pointer"
              onClick={() => setOpenMembers(!openMembers)}
            >
              <img
                src={membersIcon}
                alt="members"
                className="absolute right-2"
              />
              <span className="h-10 pr-8 pl-2 w-full flex items-center">
                {newEvent.participants?.length > 0
                  ? `${newEvent.participants.length} مشتركين`
                  : "اختر المشتركين"}
              </span>
              <img
                src={addcircleIcon}
                alt="addcircle"
                className="absolute left-2"
              />
            </div>

            {/* Dropdown */}
            {openMembers && (
              <div className="absolute top-full left-0 w-full bg-white rounded-[16px] border border-gray-500/40 mt-1 shadow-[0_4px_12px_rgba(0,0,0,0.25)] z-50 text-[#000000]">
                <div className="w-full h-full p-4 box-border overflow-y-auto">
                  {/* البحث */}
                  <div className="relative w-full h-[30px] mb-2">
                    <input
                      type="text"
                      placeholder="ابحث عن مشترك..."
                      value={memberSearch}
                      onChange={(e) => setMemberSearch(e.target.value)}
                      className="w-full h-full rounded-[8px] border border-gray-500 px-3 pr-10 focus:outline-none placeholder-gray-400 text-gray-800"
                    />
                    <img
                      src={searchIcon}
                      alt="search"
                      className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5"
                    />
                  </div>

                  {/* قائمة المشتركين */}
                  {members
                    .filter((m) => m.includes(memberSearch))
                    .map((member, idx) => {
                      const isSelected =
                        newEvent.participants?.includes(member);
                      return (
                        <div
                          key={idx}
                          className="flex items-center justify-between h-[32px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-[rgba(126,129,140,0.4)] last:border-b-0"
                          onClick={() => {
                            setNewEvent((prev) => {
                              let updated;
                              if (prev.participants?.includes(member)) {
                                // إذا كان موجود → نشيله
                                updated = prev.participants.filter(
                                  (m) => m !== member
                                );
                              } else {
                                // إذا مش موجود → نضيفه
                                updated = [
                                  ...(prev.participants || []),
                                  member,
                                ];
                              }
                              return { ...prev, participants: updated };
                            });
                          }}
                        >
                          <span
                            className={`${isSelected
                                ? "font-bold text-black"
                                : "font-normal text-gray-800"
                              }`}
                          >
                            {member}
                          </span>
                          {/* مربع الاختيار */}
                          <div
                            className={`w-5 h-5 border-2 flex items-center justify-center rounded-sm ${isSelected
                                ? "bg-purple-500 border-purple-500"
                                : "border-gray-400 bg-white"
                              }`}
                          >
                            {isSelected && (
                              <svg
                                className="w-3 h-3 text-white"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="3"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <polyline points="20 6 9 17 4 12" />
                              </svg>
                            )}
                          </div>
                        </div>
                      );
                    })}

                  {members.filter((m) => m.includes(memberSearch)).length ===
                    0 && (
                      <div className="px-3 py-2 text-gray-400 font-normal">
                        لا يوجد مشتركين
                      </div>
                    )}
                </div>
              </div>
            )}
          </div>

          {/* اللون */}
          <div className="flex items-center gap-4">
            <label className=" flex items-center gap-2 block font-bold text-sm w-[52px] h-[18px] mb-2">
              <img src={colorIcon} alt="color" className="w-4 h-4" />
              اللون
            </label>
            <div className="flex gap-4">
              {[
                { bg: "#DCFCE7", border: "#22C55E", text: "#14532D" },
                { bg: "#EDE9FE", border: "#8B5CF6", text: "#4C1D95" },
                { bg: "#DBEAFE", border: "#3B82F6", text: "#1E3A8A" },
                { bg: "#FEF3C7", border: "#F59E0B", text: "#92400E" },
              ].map((c, i) => {
                const isSelected = newEvent.bg === c.bg;
                return (
                  <button
                    key={i}
                    onClick={() =>
                      setNewEvent({
                        ...newEvent,
                        bg: c.bg,
                        border: c.border,
                        text: c.text,
                      })
                    }
                    className="relative w-5 h-5 rounded-full flex-shrink-0 transition-all duration-200 flex items-center justify-center"
                    style={{ padding: 0, border: "none" }}
                  >
                    <div
                      className="w-3.5 h-3.5 rounded-full"
                      style={{ backgroundColor: c.border }}
                    />
                    {isSelected && (
                      <div
                        className="absolute rounded-full"
                        style={{
                          width: "130%",
                          height: "130%",
                          border: `2px solid ${c.border}`,
                        }}
                      />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* التكرار */}
          <div className="flex items-center justify-between mt-4">
            <label className="block font-bold text-sm">تكرار</label>
            <div className="flex items-center gap-2">
              <span className="text-sm">يوميًا</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={newEvent.repeat === "daily"}
                  onChange={(e) => {
                    if (e.target.checked) {
                      setNewEvent({
                        ...newEvent,
                        repeat: "daily",
                        days: [...days],
                      });
                    } else {
                      setNewEvent({ ...newEvent, repeat: "", days: [] });
                    }
                  }}
                  className="sr-only peer"
                />
                <div className="w-10 h-5 bg-gray-300 peer-checked:bg-purple-500 rounded-full peer transition-colors duration-300"></div>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>

          {/* أيام الأسبوع */}
          <div className="grid grid-cols-4 gap-2 mt-2">
            {days.map((day) => {
              const isSelected = newEvent.days?.includes(day);
              return (
                <label
                  key={day}
                  className="flex items-center gap-2 text-xs cursor-pointer select-none"
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={(e) => {
                      let newDays;
                      if (e.target.checked) {
                        newDays = [...(newEvent.days || []), day];
                      } else {
                        newDays = newEvent.days.filter((d) => d !== day);
                      }

                      setNewEvent({
                        ...newEvent,
                        days: newDays,
                        repeat: newDays.length === days.length ? "daily" : "", // إذا كل الأيام مختارة يصبح يوميًا
                      });
                    }}
                    className="hidden peer"
                  />
                  <span className="w-4 h-4 flex items-center justify-center border rounded-sm peer-checked:bg-purple-500 peer-checked:border-purple-500">
                    {isSelected && (
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="w-3 h-3 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={3}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    )}
                  </span>
                  {day}
                </label>
              );
            })}
          </div>

          {/* التذكير */}
          <div className="relative w-full">
            <label className="block font-bold text-sm w-full h-[18px] mb-2">
              تذكير
            </label>

            {/* الصندوق */}
            <div
              className="w-full h-10 border border-[#7E818C] rounded-md flex items-center justify-between cursor-pointer px-3"
              onClick={() => setOpenReminder(!openReminder)}
            >
              <div className="flex items-center gap-2">
                <img
                  src={newEvent.reminder === "0" ? muteIcon : notificationIcon}
                  alt="notification"
                  className="w-4 h-4"
                />
                <span>{newEvent.reminderName || "قبل 30 دقيقة"}</span>
              </div>
              <img src={downarrowIcon} alt="downarrow" className="w-4 h-4" />
            </div>

            {/* Dropdown */}
            {openReminder && (
              <div className="absolute top-full left-0 w-full bg-white border border-gray-300 rounded-[16px] mt-1 z-50 shadow-[0_4px_12px_rgba(0,0,0,0.25)] text-[#000000]">
                <div className="w-full h-full p-4 box-border overflow-y-auto">
                  {[
                    { value: "0", label: "عدم التذكير", icon: muteIcon }, // أيقونة الجرس المخفف/مكتوم
                    {
                      value: "30",
                      label: "قبل 30 دقيقة",
                      icon: notificationIcon,
                    },
                    { value: "60", label: "قبل ساعة", icon: notificationIcon },
                    { value: "24", label: "قبل 1 يوم", icon: notificationIcon },
                  ].map((option, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between h-[32px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-[rgba(126,129,140,0.4)] last:border-b-0"
                      onClick={() => {
                        setNewEvent({
                          ...newEvent,
                          reminder: option.value,
                          reminderName: option.label,
                        });
                        setOpenReminder(false);
                      }}
                    >
                      <div className="flex items-center gap-2">
                        <img
                          src={option.icon} // أيقونة الجرس حسب النوع
                          alt="notification"
                          className={`w-4 h-4 ${newEvent.reminder === option.value
                              ? "opacity-40"
                              : ""
                            }`}
                        />
                        <span
                          className={`${newEvent.reminder === option.value
                              ? "font-bold text-black"
                              : "font-normal text-gray-800"
                            }`}
                        >
                          {option.label}
                        </span>
                      </div>

                      {/* دائرة الاختيار */}
                      <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center bg-purple">
                        {newEvent.reminder === option.value && (
                          <div className="w-3 h-3 rounded-full bg-purple"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="pt-2">
          <button
            className="w-full h-10 bg-bg !text-white !bg-purple rounded-md font-semibold hover:!bg-bg-800"
            onClick={() => handleSaveEvent(newEvent)}
          >
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
}
