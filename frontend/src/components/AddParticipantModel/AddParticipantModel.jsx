import React, { useState } from "react";
import CloseIcon from "../../icons/close.svg";
import Step1Participant from "./Step1Participant.jsx";
import Step2Participant from "./Step2Participant.jsx";
import Step3Participant from "./Step3Participant.jsx";
import Step4Participant from "./Step4Participant.jsx";


const AddBookingModal = ({ onClose, onSave }) => {
  const [activeStep, setActiveStep] = useState(0);
  const [bookingData, setBookingData] = useState({
    title: "",
    coach: "",
    room: "",
    maxParticipants: "",
    date: null,
    time: "",
  });

  const steps = ["المعلومات الشخصية ", "بيانات الاتصال ", "الملف الصحي", "تفاصيل الاشتراك"];

  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep(activeStep + 1);
    } else {
      if (onSave) onSave(bookingData);
      onClose();
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep(activeStep - 1);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/25">
      <div className="bg-white rounded-2xl shadow-lg w-[849px] h-[712px] flex flex-col p-6 text-right overflow-hidden">
        <div className="flex flex-col w-[801px] h-[712px] gap-4 mx-auto">
          {/* الهيدر */}
          <div className="flex justify-between items-start">
            <h2 className="text-[16px] font-bold text-black">إضافة مشترك جديد</h2>
            <div className="w-8 h-8 flex items-center justify-center">
              <img
                className="max-w-full max-h-full cursor-pointer"
                src={CloseIcon}
                alt="close"
                onClick={onClose}
              />
            </div>
          </div>

          {/* Stepper */}
          <div className="flex justify-center items-center gap-4 mt-6 mb-8">
            {steps.map((step, index) => (
              <React.Fragment key={index}>
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={() => setActiveStep(index)}
                >
                  <div
                    className={`w-[20px] h-[20px] flex items-center justify-center rounded-[10px] text-xs font-medium border ${
                      index < activeStep
                        ? "border-[#6A0EAD] bg-[#6A0EAD] text-white"
                        : index === activeStep
                        ? "border-[#6A0EAD] text-[#6A0EAD]"
                        : "border-gray-300 text-gray-500"
                    }`}
                  >
                    {index < activeStep ? "✓" : index + 1}
                  </div>
                  <span
                    className={`text-sm font-medium ${
                      index <= activeStep ? "text-[var(--color-purple)]" : "text-gray-500"
                    }`}
                  >
                    {step}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="w-[51px] h-[1px] bg-gray-200"></div>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* محتوى الخطوة */}
          <div className="flex-grow flex flex-col justify-between pr-2 text-[14px]">
            {activeStep === 0 && (
              <Step1Participant bookingData={bookingData} setBookingData={setBookingData} />
            )}
            {activeStep === 1 && (
              <Step2Participant bookingData={bookingData} setBookingData={setBookingData} />
            )}
             {activeStep === 2 && (
              <Step3Participant bookingData={bookingData} setBookingData={setBookingData} />
            )}
            {activeStep === 3 && (
              <Step4Participant bookingData={bookingData} setBookingData={setBookingData} />
            )}

            {/* أزرار التنقل */}
            <div className="w-[344px] mt-4 self-center flex gap-4">
              {activeStep > 0 && (
                <button
                  onClick={handleBack}
                  className="w-full py-3 border border-gray-300 text-gray-700 text-sm font-medium rounded-[8px] hover:bg-gray-100"
                >
                  السابق
                </button>
              )}

              <button
                onClick={handleNext}
                className="w-full py-3 text-white text-sm font-medium rounded-[8px]"
                style={{ backgroundColor: "#6A0EAD" }}
              >
                {activeStep === steps.length - 1 ? "حفظ" : "التالي"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBookingModal;
