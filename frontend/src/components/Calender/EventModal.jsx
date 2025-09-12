import React, { useState } from "react";
import MiniCalender from "../MiniCalender/MiniCalender"; 
import "./EventModal.css";
import DeleteIcon from "../../icons/Delete.svg";
import CalenderIcon from "../../icons/calender.svg";
import leftarrowIcon from "../../icons/arrow-left.svg";
import addressIcon from "../../icons/address.svg";
import discIcon from "../../icons/disc.svg";
import calenderIcon from "../../icons/calender.svg";
import hourIcon from "../../icons/hour.svg";
import colorIcon from "../../icons/color.svg";

export default function EventModal({
  newEvent,
  setNewEvent,
  handleSaveEvent,
  handleDeleteEvent,
  participantsOpen,
  setParticipantsOpen,
  allParticipants,
  closeModal
}) {
  const [showCalendar, setShowCalendar] = useState(false);

  const handleDateChange = (date) => {
    const dateString = date.toISOString().split("T")[0];
    setNewEvent({
      ...newEvent,
      start: dateString + "T08:00:00",
      end: dateString + "T09:00:00",
    });
    setShowCalendar(false);
  };

  const days = ["السبت","الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة"];

  return (
    <div className="event-panel-overlay">
      <div className="event-panel">
        {/* ديف الهيدر */}
        <div className="panel-header">
          <h3>تفاصيل الموعد</h3>
          <div className="header-icons">
            <button className="delete-icon" onClick={handleDeleteEvent}>
              <img src={DeleteIcon} alt="delete" />
            </button>
            <button className="close-icon" onClick={closeModal}>✖</button>
          </div>
        </div>

        {/* ديف المحتوى */}
        <div className="panel-content">

          <label >العنوان</label>
          <div className="relative flex items-center">
          <img src={addressIcon} alt="address" className="absolute pointee-events-none left-2" />
          <input
            type="text"
            value={newEvent.title || ""}
            onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
            placeholder="مثال: يوغا"
            className="h-[40px] pl-8 w-80 rounded-[8px] ring-blue focus-outline-none"
          />
          </div>

          <label>الوصف (اختياري)</label>
          <div className="relative flex items-center">
          <img src={discIcon} alt="disc" className="absolute pointee-events-none left-2"/>
          <textarea
            value={newEvent.description || ""}
            onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
            placeholder="....."
            className="h-[40px] pl-8 w-80 rounded-[8px] ring-blue focus-outline-none"
          />
          </div>

            <label className="cursor-pointer" onClick={() => setShowCalendar(!showCalendar)}>
              التاريخ
            </label>
            <div className="relative flex items-center">
          <img src={calenderIcon} alt="calender" className="absolute pointee-events-none left-2"/>
            <input
              type="text"
              value={newEvent.start ? newEvent.start.split("T")[0] : ""}
              readOnly
              className="border px-2 py-1 rounded mt-1 w-full cursor-pointer"
              onClick={() => setShowCalendar(!showCalendar)}
            />

            {showCalendar && (
              <div className="absolute top-full left-0 mt-2 z-30 w-60">
                    <MiniCalender
                  currentDate={newEvent.start ? new Date(newEvent.start) : new Date()}
                  handleDateChange={handleDateChange}
                />
              </div>
            )}
          </div>

<label>الوقت</label>
<div className="time-row flex items-center gap-2">

  {/* ساعة البداية */}
  <div className="relative w-[136px] h-[44px]">
    {/* أيقونة الساعة على اليمين */}
    <img
      src={hourIcon}
      alt="hour"
      className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
    />

    <select
  value={newEvent.start ? newEvent.start.split("T")[1]?.slice(0, 5) : ""}
  onChange={(e) => {
    const datePart = (newEvent.start || newEvent.end || new Date().toISOString()).split("T")[0];
    setNewEvent({ ...newEvent, start: `${datePart}T${e.target.value}` });
  }}
  className="pr-10 h-full w-full border border-gray-300 rounded-[8px] appearance-none bg-white text-center"
  style={{ scrollbarWidth: "none" }}
>

      {Array.from({ length: 15 }, (_, idx) => {
        const i = idx + 8;
        const hour = i % 12 === 0 ? 12 : i % 12;
        const suffix = i < 12 ? "ص" : "م";
        const label = `${hour}:00 ${suffix}`;
        const value = String(i).padStart(2, "0") + ":00";
        return <option key={i} value={value}>{label}</option>;
      })}
    </select>
  </div>

  {/* السهم */}
  <img src={leftarrowIcon} alt="leftarrow" className="w-4 h-4" />

  {/* ساعة النهاية */}
  <div className="relative w-[136px] h-[44px]">
    <img
      src={hourIcon}
      alt="hour"
      className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 pointer-events-none"
    />

    <select
  value={newEvent.end ? newEvent.end.split("T")[1]?.slice(0, 5) : ""}
  onChange={(e) => {
    const datePart = (newEvent.start || newEvent.end || new Date().toISOString()).split("T")[0];
    setNewEvent({ ...newEvent, end: `${datePart}T${e.target.value}` });
  }}
  className="pr-10 h-full w-full border border-gray-300 rounded-[8px] appearance-none bg-white text-center"
  style={{ scrollbarWidth: "none" }}
>

      {Array.from({ length: 15 }, (_, idx) => {
        const i = idx + 8;
        const hour = i % 12 === 0 ? 12 : i % 12;
        const suffix = i < 12 ? "ص" : "م";
        const label = `${hour}:00 ${suffix}`;
        const value = String(i).padStart(2, "0") + ":00";
        return <option key={i} value={value}>{label}</option>;
      })}
    </select>
  </div>

</div>


          <label>المكان</label>
          
          <select
            value={newEvent.room || ""}
            onChange={e => setNewEvent({ ...newEvent, room: e.target.value })}
          >
            <option value="">اختر القاعة</option>
            <option value="قاعة 1">القاعة 1</option>
            <option value="قاعة 2">القاعة 2</option>
            <option value="قاعة 3">القاعة 3</option>
          </select>

          <label>المدرب</label>
          <select
            value={newEvent.coach || ""}
            onChange={e => setNewEvent({ ...newEvent, coach: e.target.value })}
          >
            <option value="">اختر المدرب</option>
            <option value="مريم محمد">مريم محمد</option>
            <option value="معاذ حجاوي">معاذ حجاوي</option>
          </select>

          <label>المشاركون</label>
          <div className="participants-box" onClick={() => setParticipantsOpen(!participantsOpen)}>
            <div className="avatars">
              {newEvent.participants?.slice(0,4).map((p,i) => (
                <div key={i} className="avatar-circle">{p[0]}</div>
              ))}
              {newEvent.participants?.length > 4 && (
                <span className="more">+{newEvent.participants.length - 4}</span>
              )}
            </div>
            <span>{newEvent.participants?.length || 0} مشارك</span>
          </div>
          {participantsOpen && (
            <div className="participants-list">
              {allParticipants.map(p => (
                <label key={p} className="participant-option">
                  <input
                    type="checkbox"
                    checked={newEvent.participants?.includes(p)}
                    onChange={e => {
                      if (e.target.checked) {
                        setNewEvent({
                          ...newEvent,
                          participants: [...(newEvent.participants || []), p]
                        });
                      } else {
                        setNewEvent({
                          ...newEvent,
                          participants: newEvent.participants.filter(x => x !== p)
                        });
                      }
                    }}
                  />
                  {p}
                </label>
              ))}
            </div>
          )}

<div className="flex items-center w-100 h-40 gap-1">
  <label className="flex items-center">
    اللون
  </label>

  <div className="flex items-center gap-8">
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
          className="w-[14px] h-[14px] rounded-full border-none bg-transparent p-0 transition-all duration-200"
          style={{
            backgroundColor: c.border,
            boxShadow: isSelected ? `0 0 0 4px ${c.border}` : "none",
          }}
        />
      );
    })}
  </div>
</div>


<div className="repeat-container">
          <label>تكرار</label>
          <div className="repeat-options">
            <label>
              <input
                type="checkbox"
                checked={newEvent.repeat === "daily"}
                onChange={e => setNewEvent({ ...newEvent, repeat: e.target.checked ? "daily" : "" })}
              />
              يومياً
            </label>
            </div> </div>
            <div className="days-grid">
              {days.map(day => (
                <label key={day}>
                  <input
                    className="w-2 h-2" // هنا حجم المربع

                    type="checkbox"
                    checked={newEvent.days?.includes(day)}
                    onChange={e => {
                      if (e.target.checked) {
                        setNewEvent({
                          ...newEvent,
                          days: [...(newEvent.days || []), day]
                        });
                      } else {
                        setNewEvent({
                          ...newEvent,
                          days: newEvent.days.filter(d => d !== day)
                        });
                      }
                    }}
                  />
                  {day}
                </label>
              ))}
            </div>


          <label>تذكير</label>
          <select
            value={newEvent.reminder || "30"}
            onChange={e => setNewEvent({ ...newEvent, reminder: e.target.value })}
          >
            <option value="10">قبل 10 دقائق</option>
            <option value="30">قبل 30 دقيقة</option>
            <option value="60">قبل ساعة</option>
          </select>
        </div>

        {/* ديف زر الحفظ */}
        <div className="panel-footer">
          <button className="main-save-btn" onClick={handleSaveEvent}>
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
}
