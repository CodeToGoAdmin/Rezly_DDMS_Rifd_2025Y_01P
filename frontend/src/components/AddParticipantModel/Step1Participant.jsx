import React from "react";

export default function Step1Participant() {
    return (
        <div className=" flex justify-center  bg-white w-full ">
            <form className="w-[343px] flex flex-col gap-2 font-[Cairo]">
                <div className=" flex gap-3  align-item-center">
                    {/* الاسم الأول */}
                    <div className="flex-1">
                        <label className="block text-[14px] font-[700] text-black mb-1.5 ">
                            الاسم الأول <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="أدخل الاسم الأول"
                            className="w-full p-2.5 border border-gray-300 rounded-xl text-[12px] placeholder-[color:var(--grey,#7E818C)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />


                    </div>

                    {/* الاسم الثاني */}
                    <div className="flex-1">
                        <label className="block text-[14px] font-[700] text-black mb-1.5 ">
                            الاسم الثاني <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="أدخل الاسم الثاني"
                            className="w-full p-2.5 border border-gray-300 rounded-xl text-[12px] placeholder-[color:var(--grey,#7E818C)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                </div>


                {/* الجنس */}
                <div>
                    <label className="block text-[14px] font-[700] text-black mb-1.5 ">
                        الجنس <span className="text-red-500">*</span>
                    </label>
                    <select className="w-full p-2.5 border border-gray-300 rounded-xl text-[12px] text-[color:var(--grey,#7E818C)] focus:outline-none focus:ring-2 focus:ring-purple-500">
                        <option className="text-black">اختر الجنس</option>
                        <option>ذكر</option>
                        <option>أنثى</option>
                    </select>
                </div>

                {/* رقم الهوية */}
                 <div>
                        <label className="block text-[14px] font-[700] text-black mb-1.5 ">
                             رقم الهوية <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            placeholder="أدخل  رقم الهوية "
                            className="w-full p-2.5 border border-gray-300 rounded-xl text-[12px] placeholder-[color:var(--grey,#7E818C)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                {/* تاريخ الميلاد */}
                <div>
                    <label className="block text-[14px] font-[700] text-black mb-1.5 ">
                        تاريخ الميلاد <span className="text-red-500">*</span>
                    </label>
                    <input
                        type="date"
                        className="w-full p-2.5 border border-gray-300 rounded-xl text-[12px] text-[color:var(--grey,#7E818C)] focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                {/* رفع الملف */}
                <div>
                    <label className="block text-[14px] font-[700] text-black mb-1.5 ">
                        صورة الملف الشخصي
                    </label>
                    <div className="  border-2 border-dashed border-[var(--color-purple)] rounded-xl p-5 text-center text-gray-500 text-[12px] cursor-pointer hover:border-purple-400 transition">
                        <svg width="33" height="32" viewBox="0 0 33 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="m-auto">
                            <rect x="0.5" width="32" height="32" rx="8" fill="#E1CFEF" />
                            <path d="M13.5 20.5V14.5H9.5L16.5 7.5L23.5 14.5H19.5V20.5H13.5ZM9.5 24.5V22.5H23.5V24.5H9.5Z" fill="var(--color-purple)" />
                        </svg>

                        <p>اسحب الملف وأفلته هنا أو اختر ملفا</p>
                        <p className="text-xs text-gray-400 mt-1">الحد الأقصى 2MB</p>
                    </div>
                </div>

                {/* الأزرار */}

            </form>
        </div>
    );
}
