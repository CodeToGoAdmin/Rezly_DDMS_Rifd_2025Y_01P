import { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./MiniCalender.css";
import RightArrowIcon from "../../icons/rightarrow.svg";
import LeftArrowIcon from "../../icons/leftarrow.svg";

const MiniCalender = ({ currentDate, handleDateChange }) => {
  const [tempDate, setTempDate] = useState(currentDate);

  return (
    <div className="absolute z-30 right-1/4 translate-x-1/4 w-[374px] h-[374px] rounded-[16px] bg-white/100">
  {/* الكارد الخارجي */}
  <div
  className="absolute z-30  right-1/3 translate-x-1/2 w-[374px] h-[374px] rounded-[16px] bg-[#ffffff] shadow-[0_10px_25px_rgba(0,0,0,0.25)] flex items-center justify-center"
>

  {/* الديف الداخلي يحتوي الكاليندر + الزر */}
  <div className="flex flex-col w-[326px] h-[326px] gap-[24px]">

    {/* الميني كاليندر */}
    <div className="flex flex-col w-full h-[269px] gap-[24px]">
            <DatePicker
  inline
  selected={tempDate}
  onChange={(date) => setTempDate(date)}
  locale="ar"
  calendarClassName="calendar-inside"
  renderCustomHeader={({ date, decreaseMonth, increaseMonth }) => (
    <div className="flex items-center justify-between w-full h-[32px]">
      
      {/* اسم الشهر والسنة */}
      <div className="flex items-center justify-start w-[238px] h-[32px] text-[14px] font-bold" style={{ direction: "rtl" }}>
        {date.toLocaleDateString("ar-EG", { month: "long", year: "numeric" })}
      </div>

      {/* الأسهم */}
      <div className="flex items-center gap-[16px]">
        <button
          onClick={decreaseMonth}
          className="flex items-center justify-center w-[32px] h-[32px] rounded-[8px] bg-gray-300 ml-[8px]"
          style={{ border: "none" }}

        >
          <img src={RightArrowIcon} alt="rightarrow" />
        </button>
        <button
          onClick={increaseMonth}
          className="flex items-center justify-center w-[32px] h-[32px] rounded-[8px] bg-gray-300"
          style={{ border: "none" }}

        >
          <img src={LeftArrowIcon} alt="leftarrow" />
        </button>
      </div>

    </div>
  )}
  formatWeekDay={(nameOfDay) => {
    const daysShort = ["س", "ح", "ن", "ث", "ر", "خ", "ج"];
    const days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    return daysShort[days.indexOf(nameOfDay)];
  }}
/>

          </div>

          {/* زر اختيار التاريخ */}
          <button
  className="rounded-[8px] font-bold w-full h-[32px] bg-[#6A0EAD] text-white border-0 focus:outline-none"
  style={{ color: "white", border: "none" }}
  onClick={() => handleDateChange(tempDate)}
>
  اختيار
</button>


        </div>
      </div>
    </div>
  );
};

export default MiniCalender;
