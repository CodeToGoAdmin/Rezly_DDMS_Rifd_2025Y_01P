import React from "react";

export default function Step1Participant() {
    return (
        <div className=" flex justify-center  bg-white w-full">
            <form className="w-[343px] flex flex-col gap-3 font-[Cairo]">
                   <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-[700] text-black">نوع الاشتراك <span className="text-red-500">*</span></label>
                    <select
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[12px] text-[color:var(--grey,#7E818C)] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                        <option>اختر نوع الإشتراك</option>
                    </select>
                </div>
                        <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-[700] text-black"> مدة الإشتراك <span className="text-red-500">*</span></label>
                    <select
                        className="w-full border border-gray-300 rounded-xl px-3 py-2 text-[12px] text-[color:var(--grey,#7E818C)] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                        <option>اختر مدة الإشتراك</option>
                    </select>
                </div>
                    <div>
                        <label className="block text-[14px] font-[700] text-black mb-1.5 ">
                             الرسوم<span className="text-red-500">*</span>
                        </label>
                        
                        <input
                            type="text"
                            placeholder=" أدخل الرسوم  "
                            className="w-full p-2.5 border border-gray-300 rounded-xl text-[12px] placeholder-[color:var(--grey,#7E818C)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />

                    </div>
                      <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-[700] text-black">  طريقة الدفع <span className="text-red-500">*</span></label>
                    <select
                        className="w-full border border-gray-300 rounded-xl px-2.5 py-2 text-[12px] text-[color:var(--grey,#7E818C)] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                        <option>اختر طريقة الدفع</option>
                    </select>
                </div>

                   <div className="flex flex-col gap-2">
                    <label className="text-[14px] font-[700] text-black"> المدرب المسؤول <span className="text-red-500">*</span></label>
                    <select
                        className="w-full border border-gray-300 rounded-xl px-2 py-2 text-[12px] text-[color:var(--grey,#7E818C)] focus:outline-none focus:ring-2 focus:ring-purple-600"
                    >
                        <option> اختر المدرب المسؤول </option>
                    </select>
                </div>

            </form>
        </div>
    );
}
