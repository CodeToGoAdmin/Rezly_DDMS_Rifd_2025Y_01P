import React, { useState } from "react";
import SubscribersTab from "../components/Tabs/SubscribersTab";
import AddBookingModal from "../components/AddParticipantModel/AddParticipantModel.jsx"; 

const tabs = ["الحجوزات", "المشتركين", "سجل الحضور", "التقارير", "الإعدادات"];

export default function ClientsPage() {
  const [activeTab, setActiveTab] = useState("المشتركين");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const renderContent = () => {
    switch (activeTab) {
      case "المشتركين":
        return <SubscribersTab />;
      default:
        return <div className="p-4 bg-white rounded-2xl shadow">محتوى {activeTab}</div>;
    }
  };

  return (
    <div className="flex flex-col gap-3 w-full">
      {/* Navbar */}
      <div className="flex">
        <div className="flex w-full bg-white">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-2.5 text-base cursor-pointer relative pb-1 text-[12px] font-[600] font-Cairo leading-[150%] text-center transition ${
                activeTab === tab ? "" : "text-[var(--grey,#7E818C)]"
              }`}
            >
              {tab}
              {activeTab === tab && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-15 h-[2px] bg-[var(--color-purple)] rounded-full"></span>
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="flex justify-between items-center p-2">
        {/* الجانب الأيمن */}
        <div className="flex items-center gap-3">
          {/* زر إضافة مشترك */}
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-2 bg-[var(--color-purple)] text-white px-2 py-1 rounded-lg transition"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M12.333 8.66699C12.7011 8.66699 12.9998 8.96497 13 9.33301V11H14.667C15.035 11.0002 15.333 11.2989 15.333 11.667C15.3328 12.0349 15.0349 12.3328 14.667 12.333H13V14C13 14.3682 12.7012 14.667 12.333 14.667C11.965 14.6668 11.667 14.3681 11.667 14V12.333H10C9.63192 12.333 9.33318 12.035 9.33301 11.667C9.33301 11.2988 9.63181 11 10 11H11.667V9.33301C11.6672 8.96508 11.9651 8.66717 12.333 8.66699ZM7.33301 8.83301C8.57388 8.83301 9.71278 9.27092 10.6035 10H10C9.07953 10 8.33301 10.7465 8.33301 11.667C8.33318 12.5873 9.07963 13.333 10 13.333H10.667V14C10.667 14.1742 10.6936 14.3422 10.7432 14.5H1.33301C1.05702 14.4998 0.833008 14.276 0.833008 14C0.833008 11.1465 3.14653 8.83301 6 8.83301H7.33301ZM6.66699 1.5C8.41574 1.50018 9.83301 2.9182 9.83301 4.66699C9.83283 6.41564 8.41564 7.83283 6.66699 7.83301C4.9182 7.83301 3.50018 6.41574 3.5 4.66699C3.5 2.91809 4.91809 1.5 6.66699 1.5Z"
                fill="white"
              />
            </svg>
            <span className="text-[12px] font-[600] font-Cairo leading-[150%]">
              اضافة مشترك
            </span>
          </button>

          {/* فلترة */}
          <div className="flex items-center gap-1 cursor-pointer text-gray-700 hover:text-gray-900">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M0.5 1.66667C0.5 1.02233 1.02234 0.5 1.66667 0.5H12.3333C12.9777 0.5 13.5 1.02233 13.5 1.66667V3.35442C13.5 3.70066 13.3462 4.02902 13.0802 4.25067L9.51659 7.22037C9.48496 7.24672 9.46421 7.28385 9.45833 7.32459L8.87068 11.3954C8.81609 11.7735 8.57982 12.101 8.23818 12.272L6.74583 13.019C6.01978 13.3824 5.15376 12.9115 5.06409 12.1045L4.53269 7.32194C4.52794 7.27915 4.50682 7.23987 4.47374 7.21231L0.919785 4.25067C0.653793 4.02902 0.5 3.70066 0.5 3.35442V1.66667Z"
                fill="#6A0EAD"
              />
            </svg>
            <span className="text-[12px] font-[600] font-Cairo leading-[150%]">
              فلترة حسب
            </span>
          </div>

          {/* الأشخاص مع رقم */}
          <div className="flex items-center gap-1 px-3 py-1">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                fillRule="evenodd"
                clipRule="evenodd"
                d="M6.39968 2.40658C5.36634 2.97324 4.65969 4.07317 4.65969 5.33317C4.65969 6.0065 4.85967 6.63984 5.20634 7.1665C3.87967 7.09984 2.82635 6.0065 2.82635 4.6665C2.82635 3.3265 3.94635 2.1665 5.32635 2.1665C5.70635 2.1665 6.07301 2.25324 6.39968 2.40658ZM5.51967 8.1665C3.86634 8.65984 2.66634 10.1865 2.66634 11.9998V13.1665H1.33301C1.05967 13.1665 0.833008 12.9398 0.833008 12.6665V11.3332C0.833008 9.5865 2.25301 8.1665 3.99967 8.1665H5.51967ZM7.99967 2.83317C6.61967 2.83317 5.49967 3.95317 5.49967 5.33317C5.49967 6.71317 6.61967 7.83317 7.99967 7.83317C9.37967 7.83317 10.4997 6.71317 10.4997 5.33317C10.4997 3.95317 9.37967 2.83317 7.99967 2.83317ZM6.66634 8.83317C4.91967 8.83317 3.49967 10.2532 3.49967 11.9998V13.3332C3.49967 13.6065 3.72634 13.8332 3.99967 13.8332H11.9997C12.273 13.8332 12.4997 13.6065 12.4997 13.3332V11.9998C12.4997 10.2532 11.0797 8.83317 9.33301 8.83317H6.66634ZM13.1663 4.6665C13.1663 6.0065 12.113 7.09984 10.7864 7.1665C11.133 6.63984 11.333 6.0065 11.333 5.33317C11.333 4.07317 10.633 2.97324 9.59302 2.40658C9.91968 2.25324 10.2797 2.1665 10.6663 2.1665C12.0463 2.1665 13.1663 3.2865 13.1663 4.6665ZM14.6663 13.1665H13.333V11.9998C13.333 10.1865 12.133 8.65984 10.4797 8.1665H11.9997C13.7463 8.1665 15.1663 9.5865 15.1663 11.3332V12.6665C15.1663 12.9398 14.9397 13.1665 14.6663 13.1665Z"
                fill="#6A0EAD"
              />
            </svg>
            <span>30</span>
          </div>
        </div>

        {/* الجانب الأيسر */}
        <div>
          <button className="text-black text-[12px] font-[600] font-Cairo leading-[150%]">
            عرض الكل
          </button>
        </div>
      </div>

      {/* المحتوى حسب التاب */}
      {renderContent()}

      {isModalOpen && (
        <AddBookingModal
          onClose={() => setIsModalOpen(false)}
          onSave={(data) => console.log("معلومات المشترك ", data)}
        />
      )}
    </div>
  );
}
