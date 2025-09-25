import React from "react";
import deletedocIcon from "../../icons/delete-document.svg";
import delete2Icon from "../../icons/delete2.svg";

export default function ConfirmDeleteModal({ onCancel, onConfirm, event }) {
  let dateTimeText = "";
  if (event?.start && event?.end) {
    const start = new Date(event.start);
    const end = new Date(event.end);

    // صيغة التاريخ: day/month/year
    const dateStr = `${start.getDate()}/${
      start.getMonth() + 1
    }/${start.getFullYear()}`;

    // صيغة الوقت: 24 بدون AM/PM
    const startTime = start.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
    const endTime = end.toLocaleTimeString("en-GB", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });

    dateTimeText = `${startTime} - ${endTime} ${dateStr}`;
  }

  return (
    <div className="fixed inset-0 z-[10000] flex justify-center items-center bg-black/30">
      <div
        className="bg-white rounded-[16px] border border-gray-300 flex flex-col p-6 gap-2"
        style={{ width: "320px", height: "202px" }}
      >
        <div
          className="flex flex-col gap-[11px] items-center justify-center text-center"
          style={{ width: "272px", height: "162px" }}
        >
          <img src={deletedocIcon} alt="حذف" className="w-14 h-14 mx-auto" />

          <span className="text-sm font-medium" style={{ color: "#FF0000" }}>
            {dateTimeText}
          </span>

          <span className="font-bold text-black text-sm">
            هل أنت متأكد من حذف الموعد؟
          </span>

          {/* ديف الأزرار */}
          <div className="flex flex-row justify-center gap-2 w-full mt-2">
            <button
              className="flex items-center justify-center w-[120px] h-[32px] rounded-[8px] px-2 py-2 text-white font-semibold transition gap-2"
              style={{ backgroundColor: "#FF0000" }}
              onClick={onConfirm}
            >
              <img src={delete2Icon} alt="حذف" />
              حذف
            </button>
            <button
              className="flex items-center justify-center w-[120px] h-[32px] rounded-[8px] px-2 py-2 font-semibold text-black transition"
              style={{ border: "1px solid #FF0000" }}
              onClick={onCancel}
            >
              إلغاء
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
