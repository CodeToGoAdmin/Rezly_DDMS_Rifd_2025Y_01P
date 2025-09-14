import React, { useState } from "react";
import MiniCalender from "../MiniCalender/MiniCalender";
import DeleteIcon from "../../icons/Delete.svg";
import CalenderIcon from "../../icons/calender.svg";
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
    const members = ["مشترك 1", "مشترك 2", "مشترك 3", "مشترك 4", "مشترك 5"];

  const [showCalendar, setShowCalendar] = useState(false);
  const [openCoach, setOpenCoach] = useState(false);
  const [coachSearch, setCoachSearch] = useState("");
  const [openMembers, setOpenMembers] = useState(false);
  const [memberSearch, setMemberSearch] = useState("");
  const [selectedMembers, setSelectedMembers] = useState([...members]);
  const [openLocation, setOpenLocation] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState("");

  const days = ["السبت","الأحد","الاثنين","الثلاثاء","الأربعاء","الخميس","الجمعة"];
  const coaches = ["مريم محمد", "معاذ حجاوي", "أحمد علي", "سارة يوسف", "حنين", "بيان"];
  const locations = ["القاعة 1", "القاعة 2", "القاعة 3", "القاعة 4"];

  
  const [openReminder, setOpenReminder] = useState(false);       // للتحكم بفتح/اغلاق القائمة
const [remind, setRemind] = useState({
  reminder: "30",          // القيمة الحالية للتذكير
  reminderName: "قبل 30 دقيقة",
  // باقي الحقول عندك
});

  const handleDateChange = (date) => {
    const dateString = date.toISOString().split("T")[0];
    setNewEvent({
      ...newEvent,
      start: dateString + "T08:00:00",
      end: dateString + "T09:00:00",
    });
    setShowCalendar(false);
  };

  return (
    <div className="fixed inset-0 z-[4000] flex justify-center items-center">
      <div className="w-[361px] h-full bg-white rounded-[16px] flex flex-col overflow-hidden p-6 gap-2 shadow-[7.5px_1.5px_25px_rgba(0,0,0,0.25)] text-right text-black text-base font-cairo font-bold leading-6 break-words">
        {/* الهيدر */}
        <div className="w-full h-8 flex items-center justify-between">
          <h3 className="text-right text-black text-[16px] font-['Cairo'] font-bold leading-[24px]">تفاصيل الموعد</h3>
          <div className="flex w-18 h-full gap-2 flex items-center justify-between">
            <img className="w-8 h-8 object-contain" src={DeleteIcon} alt="delete" onClick={handleDeleteEvent}/>
            <div className="w-8 h-8 flex items-center justify-center">
              <img className="max-w-full max-h-full" src={CloseIcon} alt="close" onClick={closeModal}/>
            </div>
          </div>
        </div>

        {/* المحتوى */}
        <div className="flex-1 overflow-y-auto no-scrollbar space-y-4">

          {/* العنوان */}
          <div>
            <label className="block font-bold text-sm w-full h-[18px] mb-2">العنوان</label>
            <div className="relative flex items-center">
              <img src={addressIcon} alt="address" className="absolute right-2" />
              <input
                type="text"
                value={newEvent.title || ""}
                onChange={e => setNewEvent({ ...newEvent, title: e.target.value })}
                placeholder="مثال: يوغا"
                className="h-10 pr-8 pl-2 w-full rounded-md border border-[#7E818C] border-solid focus:outline-none"
              />
            </div>
          </div>

          {/* الوصف */}
          <div>
            <label className="block font-bold text-sm w-full h-[18px] mb-2">الوصف (اختياري)</label>
            <div className="relative flex items-center">
              <img src={discIcon} alt="disc" className="absolute right-2" />
              <textarea
                value={newEvent.description || ""}
                onChange={e => setNewEvent({ ...newEvent, description: e.target.value })}
                placeholder="....."
                className="h-10 pr-8 pl-2 w-full rounded-md border border-[#7E818C] border-solid focus:outline-none"
              />
            </div>
          </div>

          {/* التاريخ */}
          <div>
            <label className="block font-bold text-sm w-full h-[18px] mb-2">التاريخ</label>
            <div className="relative flex items-center">
              <img src={calenderIcon} alt="calender" className="absolute right-2"/>
              <input
                type="text"
                value={newEvent.start ? newEvent.start.split("T")[0] : ""}
                readOnly
                className="h-10 pr-8 pl-2 w-full rounded-md border border-[#7E818C] border-solid focus:outline-none"
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
          </div>

          {/* الوقت */}
          <div>
            <label className="block font-bold text-sm w-full h-[18px] mb-2">الوقت</label>
            <div className="flex items-center gap-2">
              {/* بداية */}
              <div className="relative w-[136px] h-11">
                <img src={hourIcon} alt="hour" className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5"/>
                <select
                  value={newEvent.start ? newEvent.start.split("T")[1]?.slice(0,5) : ""}
                  onChange={(e) => {
                    const datePart = (newEvent.start || new Date().toISOString()).split("T")[0];
                    setNewEvent({ ...newEvent, start: `${datePart}T${e.target.value}` });
                  }}
                  className="h-10 pr-8 pl-2 w-full rounded-md border border-[#7E818C] border-solid focus:outline-none appearance-none"
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
              <img src={leftarrowIcon} alt="leftarrow" />
              {/* نهاية */}
              <div className="relative w-[136px] h-11">
                <img src={hourIcon} alt="hour" className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5"/>
                <select
                  value={newEvent.end ? newEvent.end.split("T")[1]?.slice(0,5) : ""}
                  onChange={(e) => {
                    const datePart = (newEvent.start || new Date().toISOString()).split("T")[0];
                    setNewEvent({ ...newEvent, end: `${datePart}T${e.target.value}` });
                  }}
                  className="h-10 pr-8 pl-2 w-full rounded-md border border-[#7E818C] border-solid focus:outline-none appearance-none"
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
          </div>

          {/* المكان */}
          <div className="relative">
            <label className="block font-bold text-sm w-full h-[18px] mb-2">المكان</label>
            <div
              className="w-full h-10 border border-[#7E818C] rounded-md flex items-center justify-between cursor-pointer relative"
              onClick={() => setOpenLocation(!openLocation)}
            >
              <img src={locationIcon} alt="location" className="absolute right-2" />
              <span className="h-10 pr-8 pl-2 w-full flex items-center">
                {selectedLocation || "اختر المكان"}
              </span>
              <img src={downarrowIcon} alt="downarrow" className="absolute left-2" />
            </div>

            {openLocation && (
              <div className="absolute top-full left-0 w-full h-[278px] bg-white rounded-[16px] border border-gray-500/40 mt-1 shadow-[0_4px_12px_rgba(0,0,0,0.25)] z-50 text-[#000000]">
                <div className="w-full h-full p-4 box-border overflow-y-auto">
                  <div
                    className="flex items-center h-[32px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-[rgba(126,129,140,0.4)]"
                    onClick={() => console.log("فتح واجهة إضافة جديد")}
                  >
                    <img src={locationIcon} alt="add" className="w-5 h-5 mr-2" />
                    <span className="text-gray-800 font-normal">إضافة جديد</span>
                  </div>
                  {locations.map((location, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between h-[32px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-[rgba(126,129,140,0.4)] last:border-b-0"
                      onClick={() => { setSelectedLocation(location); setOpenLocation(false); }}
                    >
                      <span className={selectedLocation === location ? "font-bold text-black" : "font-normal text-gray-800"}>{location}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center border-[#6A0EAD]`}>
                        {selectedLocation === location && (
                          <div className="w-3 h-3 rounded-full bg-[#6A0EAD] flex items-center justify-center"></div>
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
            <label className="block font-bold text-sm w-full h-[18px] mb-2">المدرب</label>
            <div
              className="w-full h-10 border border-[#7E818C] rounded-md flex items-center justify-between cursor-pointer relative"
              onClick={() => setOpenCoach(!openCoach)}
            >
              <img src={trainerIcon} alt="trainer" className="absolute right-2" />
              <span className="h-10 pr-8 pl-2 w-full flex items-center">{newEvent.coach || "اختر المدرب"}</span>
              <img src={downarrowIcon} alt="downarrow" className="absolute left-2" />
            </div>

            {openCoach && (
              <div className="absolute top-full left-0 w-full h-[278px] bg-white rounded-[16px] border border-gray-500/40 mt-1 shadow-[0_4px_12px_rgba(0,0,0,0.25)] z-50 text-[#000000]">
                <div className="w-full h-full p-4 box-border overflow-y-auto">
                  <div className="relative w-full h-[30px] mb-2">
                    <input
                      type="text"
                      placeholder="ابحث عن مدرب..."
                      value={coachSearch}
                      onChange={e => setCoachSearch(e.target.value)}
                      className="w-full h-full rounded-[8px] border border-gray-500 px-3 pr-10 focus:outline-none placeholder-gray-400 text-gray-800"
                    />
                    <img src={searchIcon} alt="search" className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5" />
                  </div>
                  {coaches.filter(c => c.includes(coachSearch)).map((coach, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between h-[32px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-[rgba(126,129,140,0.4)] last:border-b-0"
                      onClick={() => { setNewEvent({ ...newEvent, coach }); setOpenCoach(false); setCoachSearch(""); }}
                    >
                      <span className={newEvent.coach === coach ? "font-bold text-black" : "font-normal text-gray-800"}>{coach}</span>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${newEvent.coach === coach ? "border-[#6A0EAD]" : "border-gray-400"}`}>
                        {newEvent.coach === coach && <div className="w-3 h-3 rounded-full bg-[#6A0EAD]"></div>}
                      </div>
                    </div>
                  ))}
                  {coaches.filter(c => c.includes(coachSearch)).length === 0 && (
                    <div className="px-3 py-2 text-gray-400 font-normal">لا يوجد مدربين</div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* المشتركين */}
          <div className="relative">
  <label className="block font-bold text-sm w-full h-[18px] mb-2">المشتركين</label>
  
  {/* صندوق الاختيار */}
  <div
    className="w-full h-10 border border-[#7E818C] rounded-md flex items-center justify-between cursor-pointer"
    onClick={() => setOpenMembers(!openMembers)}
  >
    <img src={membersIcon} alt="members" className="absolute right-2" />
    <span className="h-10 pr-8 pl-2 w-full flex items-center">
      {selectedMembers.length > 0 ? `${selectedMembers.length} مشتركين` : "اختر المشتركين"}
    </span>
    <img src={downarrowIcon} alt="downarrow" className="absolute left-2" />
  </div>

  {/* Dropdown */}
  {openMembers && (
    <div className="absolute top-full left-0 w-full h-[278px] bg-white rounded-[16px] border border-gray-500/40 mt-1 shadow-[0_4px_12px_rgba(0,0,0,0.25)] z-50 text-[#000000]">
      <div className="w-full h-full p-4 box-border overflow-y-auto">

        {/* البحث */}
        <div className="relative w-full h-[30px] mb-2">
          <input
            type="text"
            placeholder="ابحث عن مشترك..."
            value={memberSearch}
            onChange={e => setMemberSearch(e.target.value)}
            className="w-full h-full rounded-[8px] border border-gray-500 px-3 pr-10 focus:outline-none placeholder-gray-400 text-gray-800"
          />
          <img 
            src={searchIcon} 
            alt="search" 
            className="absolute top-1/2 right-2 -translate-y-1/2 w-5 h-5" 
          />
        </div>

        {/* قائمة المشتركين */}
        {members.filter(m => m.includes(memberSearch)).map((member, idx) => {
          const isSelected = selectedMembers.includes(member);
          return (
            <div
              key={idx}
              className="flex items-center justify-between h-[32px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-[rgba(126,129,140,0.4)] last:border-b-0"
              onClick={() => {
                if (isSelected) {
                  setSelectedMembers(selectedMembers.filter(m => m !== member));
                } else {
                  setSelectedMembers([...selectedMembers, member]);
                }
              }}
            >
              <span className={`${isSelected ? "font-bold text-black" : "font-normal text-gray-800"}`}>
                {member}
              </span>
              {/* مربع الاختيار */}
              <div className={`w-5 h-5 border-2 flex items-center justify-center rounded-sm ${
                isSelected ? "bg-purple-500 border-purple-500" : "border-gray-400 bg-white"
              }`}>
                {isSelected && <svg className="w-3 h-3 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>}
              </div>
            </div>
          )
        })}

        {members.filter(m => m.includes(memberSearch)).length === 0 && (
          <div className="px-3 py-2 text-gray-400 font-normal">لا يوجد مشتركين</div>
        )}
      </div>
    </div>
  )}
</div>


          {/* اللون */}
          <div className="flex items-center gap-4">
            <label className=" flex items-center gap-2 block font-bold text-sm w-[52px] h-[18px] mb-2">
              <img src={colorIcon} alt="color" className="w-4 h-4" />اللون
            </label>
            <div className="flex gap-4">
              {[ { bg: "#DCFCE7", border: "#22C55E", text: "#14532D" },
                 { bg: "#EDE9FE", border: "#8B5CF6", text: "#4C1D95" },
                 { bg: "#DBEAFE", border: "#3B82F6", text: "#1E3A8A" },
                 { bg: "#FEF3C7", border: "#F59E0B", text: "#92400E" },
              ].map((c, i) => {
                const isSelected = newEvent.bg === c.bg;
                return (
                  <button key={i} onClick={() => setNewEvent({ ...newEvent, bg: c.bg, border: c.border, text: c.text })} className="relative w-5 h-5 rounded-full flex-shrink-0 transition-all duration-200 flex items-center justify-center" style={{ padding: 0, border: "none" }}>
                    <div className="w-3.5 h-3.5 rounded-full" style={{ backgroundColor: c.border }} />
                    {isSelected && (
                      <div className="absolute rounded-full" style={{ width: "130%", height: "130%", border: `2px solid ${c.border}` }} />
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
                <input type="checkbox" checked={newEvent.repeat === "daily"} onChange={e => { if (e.target.checked) { setNewEvent({ ...newEvent, repeat: "daily", days: [...days] }); } else { setNewEvent({ ...newEvent, repeat: "", days: [] }); } }} className="sr-only peer" />
                <div className="w-10 h-5 bg-gray-300 peer-checked:bg-purple-500 rounded-full peer transition-colors duration-300"></div>
                <div className="absolute left-0.5 top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-300 peer-checked:translate-x-5"></div>
              </label>
            </div>
          </div>

          {/* أيام الأسبوع */}
          <div className="grid grid-cols-4 gap-2 mt-2">
            {days.map(day => {
              const isSelected = newEvent.days?.includes(day);
              return (
                <label key={day} className="flex items-center gap-2 text-xs cursor-pointer select-none">
                  <input type="checkbox" checked={isSelected} onChange={e => {
                    let newDays;
                    if (e.target.checked) newDays = [...(newEvent.days || []), day];
                    else newDays = newEvent.days.filter(d => d !== day);
                    const repeatDaily = newDays.length === days.length ? "daily" : "";
                    setNewEvent({ ...newEvent, days: newDays, repeat: repeatDaily });
                  }} className="hidden peer" />
                  <span className="w-4 h-4 flex items-center justify-center border rounded-sm peer-checked:bg-purple-500 peer-checked:border-purple-500">
                    {isSelected && (
                      <svg xmlns="http://www.w3.org/2000/svg" className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
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
  <label className="block font-bold text-sm w-full h-[18px] mb-2">تذكير</label>

  {/* الصندوق */}
  <div
    className="w-full h-10 border border-[#7E818C] rounded-md flex items-center justify-between cursor-pointer px-3"
    onClick={() => setOpenReminder(!openReminder)}
  >
    <span>{newEvent.reminderName || "قبل 30 دقيقة"}</span>
    <img src={downarrowIcon} alt="downarrow" className="w-4 h-4" />
  </div>

  {/* Dropdown */}
  {openReminder && (
  <div className="absolute top-full left-0 w-full h-[178px] bg-white border border-gray-300 rounded-[16px] mt-1 z-50 shadow-[0_4px_12px_rgba(0,0,0,0.25)] text-[#000000]">
    <div className="w-full h-full p-4 box-border overflow-y-auto">
      {[
        { value: "0", label: "عدم التذكير", icon: muteIcon }, // أيقونة الجرس المخفف/مكتوم
        { value: "30", label: "قبل 30 دقيقة", icon: notificationIcon },
        { value: "60", label: "قبل ساعة", icon: notificationIcon },
        { value: "24", label: "قبل 1 يوم", icon: notificationIcon },
      ].map((option, idx) => (
        <div
          key={idx}
          className="flex items-center justify-between h-[32px] px-3 py-2 cursor-pointer hover:bg-gray-100 border-b border-[rgba(126,129,140,0.4)] last:border-b-0"
          onClick={() => {
            setNewEvent({ ...newEvent, reminder: option.value, reminderName: option.label });
            setOpenReminder(false);
          }}
        >
          {/* أيقونة + نص */}
          <div className="flex items-center gap-2">
            <img
              src={notificationIcon} // أيقونة الجرس حسب النوع
              alt="notification"
              className={`w-4 h-4 ${newEvent.reminder === option.value ? "opacity-40" : ""}`}
            />
            <span className={`${newEvent.reminder === option.value ? "font-bold text-black" : "font-normal text-gray-800"}`}>
              {option.label}
            </span>
          </div>

          {/* دائرة الاختيار */}
          <div className="w-5 h-5 rounded-full border-2 flex items-center justify-center border-[#6A0EAD]">
            {newEvent.reminder === option.value && (
              <div className="w-3 h-3 rounded-full bg-[#6A0EAD]"></div>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
)}
</div>
</div>

        {/* زر الحفظ */}
        <div className="pt-2">
          <button className="w-full h-10 bg-purple-600 !text-white !bg-purple-600 rounded-md font-semibold hover:!bg-purple-800" onClick={handleSaveEvent}>
            حفظ
          </button>
        </div>
      </div>
    </div>
  );
}
